"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { SkillDemo } from "@/lib/skill-demos";

interface BrainOption {
  slug: string;
  name: string;
}

interface SkillOption {
  name: string;
  title: string;
  desc: string;
  icon: string;
  workflow: string;
}

interface SkillsPlaygroundProps {
  brains: BrainOption[];
  skills: SkillOption[];
  demos: Record<string, SkillDemo>;
  defaultBrain: string;
  defaultSkill: string;
}

const DEFAULT_DEMO_LIMIT = process.env.NODE_ENV === "development" ? 999 : 10;
const STORAGE_KEY = "bf-demo-count";

/** Split text into sentences and render each as its own paragraph */
function SentenceParagraphs({ text, className }: { text: string; className?: string }) {
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text];
  return (
    <div className={className}>
      {sentences.map((s, i) => (
        <p key={i} className={i > 0 ? "mt-3" : ""}>{s.trim()}</p>
      ))}
    </div>
  );
}

export function SkillsPlayground({
  brains,
  skills,
  demos,
  defaultBrain,
  defaultSkill,
}: SkillsPlaygroundProps) {
  const [selectedBrain, setSelectedBrain] = useState(defaultBrain);
  const [selectedSkill, setSelectedSkill] = useState(defaultSkill);

  // Interactive query state
  const [query, setQuery] = useState("");
  const [genericText, setGenericText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCount, setDemoCount] = useState(0);
  const [beastMode, setBeastMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const DEMO_LIMIT = beastMode ? 999 : DEFAULT_DEMO_LIMIT;

  // Read demo count + check beast mode from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "beast") setBeastMode(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDemoCount(parseInt(stored, 10) || 0);
    } catch {
      // SSR or storage unavailable
    }
  }, []);

  const cancelStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Cancel stream + hide result when brain or skill changes
  const handleBrainChange = (slug: string) => {
    cancelStream();
    setShowResult(false);
    setGenericText("");
    setEnhancedText("");
    setError(null);
    setSelectedBrain(slug);
  };

  const handleSkillChange = (name: string) => {
    cancelStream();
    setShowResult(false);
    setGenericText("");
    setEnhancedText("");
    setError(null);
    setSelectedSkill(name);
  };

  const handleRun = async () => {
    if (!query.trim() || demoCount >= DEMO_LIMIT || isStreaming) return;

    cancelStream();
    setGenericText("");
    setEnhancedText("");
    setError(null);
    setShowResult(true);
    setIsStreaming(true);

    const newCount = demoCount + 1;
    setDemoCount(newCount);
    try {
      localStorage.setItem(STORAGE_KEY, String(newCount));
    } catch {
      // storage unavailable
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(beastMode ? { "x-beast-mode": "1" } : {}),
        },
        body: JSON.stringify({
          brain: selectedBrain,
          skill: selectedSkill,
          query: query.trim(),
        }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setError("Demo limit reached — install a brain for unlimited use.");
        setIsStreaming(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong");
        setIsStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            if (msg.type === "generic") {
              setGenericText((prev) => prev + msg.delta);
            } else if (msg.type === "enhanced") {
              setEnhancedText((prev) => prev + msg.delta);
            } else if (msg.type === "meta" && msg.remaining !== undefined) {
              setDemoCount(DEMO_LIMIT - msg.remaining);
              try {
                localStorage.setItem(
                  STORAGE_KEY,
                  String(DEMO_LIMIT - msg.remaining),
                );
              } catch {
                // ignore
              }
            } else if (msg.type === "error") {
              setError(msg.message || "LLM call failed");
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Connection failed — please try again.");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const brainName =
    brains.find((b) => b.slug === selectedBrain)?.name ?? selectedBrain;
  const skillMeta = skills.find((s) => s.name === selectedSkill);
  const demo = demos[`${selectedBrain}:${selectedSkill}`] ?? null;
  const remaining = DEMO_LIMIT - demoCount;
  const canRun =
    query.trim().length > 0 && !isStreaming && demoCount < DEMO_LIMIT;

  return (
    <div className="mx-auto max-w-[1140px] px-6">
      {/* ─── Brain Selector ─── */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Choose a brain
        </label>

        {/* Desktop: button row */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          {brains.map((brain) => (
            <button
              key={brain.slug}
              onClick={() => handleBrainChange(brain.slug)}
              className={`rounded-lg border px-4 py-2 text-[14px] font-medium transition-all ${
                selectedBrain === brain.slug
                  ? "border-brain-indigo bg-brain-indigo/5 text-brain-indigo shadow-sm"
                  : "border-border-default bg-white text-body hover:border-border-indigo hover:text-deep-ink"
              }`}
            >
              {brain.name}
            </button>
          ))}
        </div>

        {/* Mobile: native select */}
        <select
          value={selectedBrain}
          onChange={(e) => handleBrainChange(e.target.value)}
          className="block w-full rounded-lg border border-border-default bg-white px-3 py-2.5 text-[15px] font-medium text-deep-ink focus:border-brain-indigo focus:outline-none focus:ring-2 focus:ring-brain-indigo/20 sm:hidden"
        >
          {brains.map((brain) => (
            <option key={brain.slug} value={brain.slug}>
              {brain.name}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Skill Selector ─── */}
      <div className="mb-8">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Choose a skill
        </label>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const active = selectedSkill === skill.name;
            return (
              <button
                key={skill.name}
                onClick={() => handleSkillChange(skill.name)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[13px] font-medium transition-all ${
                  active
                    ? "bg-brain-indigo text-white shadow-sm"
                    : "bg-cool-surface text-label hover:bg-brain-indigo/10 hover:text-brain-indigo"
                }`}
              >
                <span>{skill.icon}</span>
                <span>/{skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Interactive Query Section ─── */}
      <div className="mb-8">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Ask a question
        </label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canRun) {
              e.preventDefault();
              handleRun();
            }
          }}
          placeholder={`Ask ${brainName} anything using /${selectedSkill}...`}
          rows={2}
          className="w-full resize-none rounded-lg border border-border-default bg-white px-4 py-3 text-[15px] text-deep-ink placeholder:text-muted/60 focus:border-brain-indigo focus:outline-none focus:ring-2 focus:ring-brain-indigo/20"
          disabled={demoCount >= DEMO_LIMIT}
        />
        <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <button
            onClick={handleRun}
            disabled={!canRun}
            className="rounded-lg bg-brain-indigo px-6 py-3 font-mono text-[14px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {isStreaming ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Streaming...
              </span>
            ) : (
              <>Run /{selectedSkill}</>
            )}
          </button>
          <span className="text-xs text-muted">
            {demoCount >= DEMO_LIMIT ? (
              <span className="text-amber-600">
                Demo limit reached (6/6) — install a brain for unlimited use
              </span>
            ) : (
              <>
                {remaining} of {DEMO_LIMIT} demos remaining
              </>
            )}
          </span>
        </div>
      </div>

      {/* ─── Error Display ─── */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ─── Live Result (replaces static demos) OR Static Demo Gallery ─── */}
      {showResult ? (
        <div
          key="live-result"
          className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-300"
        >
          {/* Left: Generic AI (no brain) */}
          <div className="rounded-xl bg-deep-ink p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
              <span className="font-mono text-xs text-[#94a3b8]">
                Claude Sonnet — no brain
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
              <span className="text-[#94a3b8]">&gt;</span> You are{" "}
              {brainName}, {selectedSkill} me: {query.trim()}
            </p>
            <div className="mt-4 font-mono text-sm leading-relaxed text-[#cbd5e1]">
              {genericText ? (
                isStreaming ? (
                  <>
                    {genericText}
                    <span className="ml-0.5 inline-block animate-pulse text-[#94a3b8]">|</span>
                  </>
                ) : (
                  <SentenceParagraphs text={genericText} />
                )
              ) : (
                <span className="animate-pulse text-[#475569]">
                  Generating...
                </span>
              )}
            </div>
            {!isStreaming && genericText && (
              <p className="mt-4 font-mono text-xs text-[#475569]">
                Claude Sonnet — no brain loaded. Generic. No frameworks.
              </p>
            )}
          </div>

          {/* Right: With Brain */}
          <div className="rounded-xl border border-border-indigo bg-[#0f0b1e] p-6">
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isStreaming && !enhancedText ? "animate-pulse bg-amber-400" : "bg-success"}`}
              />
              <span className="font-mono text-xs text-success">
                Claude Sonnet + {brainName} brain loaded
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
              <span className="text-[#6366f1]">&gt;</span> /{selectedSkill}{" "}
              --{brainName} {query.trim()}
            </p>
            <div className="mt-4 font-mono text-sm leading-relaxed text-[#c7d2fe]">
              {enhancedText ? (
                isStreaming ? (
                  <>
                    {enhancedText}
                    <span className="ml-0.5 inline-block animate-pulse text-brain-indigo">|</span>
                  </>
                ) : (
                  <SentenceParagraphs text={enhancedText} />
                )
              ) : (
                <span className="animate-pulse text-[#818cf8]">
                  Loading brain context...
                </span>
              )}
            </div>
            {!isStreaming && enhancedText && (
              <p className="mt-4 font-mono text-xs text-[#6366f1]">
                Claude Sonnet + {brainName}&apos;s knowledge atoms
              </p>
            )}
          </div>
        </div>
      ) : demo ? (
        /* ─── Static Demo Gallery (shown when no live query has been run) ─── */
        <div
          key={`${selectedBrain}:${selectedSkill}`}
          className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-300"
        >
          {/* Left: Generic AI */}
          <div className="rounded-xl bg-deep-ink p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
              <span className="font-mono text-xs text-[#94a3b8]">
                Claude Sonnet — no brain
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
              <span className="text-[#94a3b8]">&gt;</span> You are{" "}
              {brainName}, {selectedSkill} me:{" "}
              {selectedSkill === "surprise"
                ? "Show me something interesting..."
                : demo.prompt}
            </p>
            <SentenceParagraphs text={demo.generic} className="mt-4 font-mono text-sm leading-relaxed text-[#cbd5e1]" />
            <p className="mt-4 font-mono text-xs text-[#475569]">
              Claude Sonnet — no brain loaded. Generic. No frameworks.
            </p>
          </div>

          {/* Right: With BrainsFor */}
          <div className="rounded-xl border border-border-indigo bg-[#0f0b1e] p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="font-mono text-xs text-success">
                {brainName} brain loaded ({demo.enhanced.atoms.length} atoms,
                confidence: {demo.enhanced.confidence})
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
              <span className="text-[#6366f1]">&gt;</span> /{selectedSkill}{" "}
              --{brainName}{" "}
              {selectedSkill !== "surprise" && demo.prompt}
            </p>
            <SentenceParagraphs text={demo.enhanced.response} className="mt-4 font-mono text-sm leading-relaxed text-[#c7d2fe]" />
            <div className="mt-3 font-mono text-xs text-[#818cf8]">
              Sources:{" "}
              {demo.enhanced.atoms.map((a, i) => (
                <span key={a}>
                  {i > 0 && ", "}
                  &quot;{a}&quot;
                </span>
              ))}
            </div>
            <div className="mt-3 font-mono text-xs text-[#6366f1]">
              Try{" "}
              {demo.enhanced.nextSkills.map((s, i) => (
                <span key={s}>
                  {i > 0 && " \u2022 "}
                  {s}
                </span>
              ))}{" "}
              to go deeper
            </div>
          </div>
        </div>
      ) : (
        /* ─── No Demo Fallback ─── */
        <div className="rounded-xl border border-border-default bg-cool-surface p-8 text-center">
          <p className="font-mono text-sm text-label">
            <span className="text-brain-indigo">/{selectedSkill}</span> +{" "}
            <span className="font-semibold text-deep-ink">{brainName}</span>
          </p>
          <p className="mt-3 text-sm text-body">
            Type a question above and click Run to see the difference a brain
            makes.
          </p>
          {skillMeta && (
            <p className="mt-4 text-xs text-muted">
              {skillMeta.icon} {skillMeta.title} &mdash; {skillMeta.desc}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
