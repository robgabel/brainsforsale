import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadBrainContext, loadSkillPrompt } from "@/lib/brain-context";
import { SKILLS, getBrain } from "@/lib/brains";

export const runtime = "nodejs";

const VALID_SKILLS = SKILLS.map((s) => s.name);

// --- Rate limiting (in-memory, per-instance) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT = process.env.NODE_ENV === "development" ? 999 : 10;
const WINDOW_MS = 24 * 60 * 60 * 1000;

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }
  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: LIMIT - entry.count };
}

// --- System prompts ---
const BREVITY = `ABSOLUTELY CRITICAL — THIS IS A HARD CONSTRAINT:
You MUST respond in EXACTLY 3-4 sentences. Not 5, not 6. Count your sentences.
No bullet points. No headers. No bold. No italic. No markdown of any kind. No "Try next" suggestions. Plain prose only.`;

const GENERIC_SYSTEM = `You are a helpful AI assistant. Answer the following question directly.\n\n${BREVITY}`;

function buildEnhancedSystem(brainContext: string, skillPrompt: string): string {
  return `${brainContext}\n\n---\n\n${skillPrompt}\n\n---\n\n${BREVITY}\nGround every sentence in specific atoms from the brain context. Use the thinker's actual voice, vocabulary, and original quotes.`;
}

// --- POST handler ---
export async function POST(request: NextRequest) {
  // Parse body
  let body: { brain?: string; skill?: string; query?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { brain, skill, query } = body;

  // Validate inputs
  if (!brain || !skill || !query) {
    return Response.json(
      { error: "Missing brain, skill, or query" },
      { status: 400 },
    );
  }
  if (typeof query !== "string" || query.length > 500) {
    return Response.json(
      { error: "Query must be under 500 characters" },
      { status: 400 },
    );
  }
  if (!VALID_SKILLS.includes(skill)) {
    return Response.json({ error: "Invalid skill" }, { status: 400 });
  }

  // Rate limit (bypass with beast mode header)
  const isBeast = request.headers.get("x-beast-mode") === "1";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, remaining } = isBeast
    ? { allowed: true, remaining: 999 }
    : checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "limit", remaining: 0 },
      { status: 429 },
    );
  }

  // Load brain context + skill prompt
  let brainContext: string;
  let skillPrompt: string;
  try {
    brainContext = loadBrainContext(brain);
    skillPrompt = loadSkillPrompt(brain, skill);
  } catch {
    return Response.json(
      { error: "Brain or skill not found" },
      { status: 404 },
    );
  }

  const brainEntry = getBrain(brain);
  const brainName = brainEntry?.name ?? brain;

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };

      // Send remaining count
      emit({ type: "meta", remaining });

      const pump = async (
        systemPrompt: string,
        type: "generic" | "enhanced",
      ) => {
        try {
          const userMessage =
            type === "enhanced"
              ? `[DEMO MODE: Reply in exactly 3-4 sentences of plain prose. No markdown, no bold, no headers, no bullet points, no "Try next" suggestions. Just plain text.]\n\n${query}`
              : `You are ${brainName}, ${skill} me: ${query}`;
          const messageStream = client.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 200,
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }],
          });

          for await (const event of messageStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              emit({ type, delta: event.delta.text });
            }
          }
        } catch (err) {
          emit({
            type: "error",
            side: type,
            message: err instanceof Error ? err.message : "LLM call failed",
          });
        }
      };

      const enhancedSystem = buildEnhancedSystem(brainContext, skillPrompt);

      await Promise.all([
        pump(GENERIC_SYSTEM, "generic"),
        pump(enhancedSystem, "enhanced"),
      ]);

      emit({ type: "done" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Demos-Remaining": String(remaining),
    },
  });
}
