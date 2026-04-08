import fs from "fs";
import path from "path";

// Same resolution pattern as lib/brains.ts
const BRAINS_DIR = fs.existsSync(
  path.join(process.cwd(), "..", "brains", "index.json"),
)
  ? path.join(process.cwd(), "..", "brains")
  : path.join(process.cwd(), "public", "brains");

const contextCache = new Map<string, string>();

function validateSlug(slug: string): void {
  if (/[./\\]/.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
}

export function loadBrainContext(slug: string): string {
  validateSlug(slug);

  const cacheKey = `context:${slug}`;
  const cached = contextCache.get(cacheKey);
  if (cached) return cached;

  // Local dev: ../brains/{slug}/pack/brain-context.md
  // Vercel: public/brains/{slug}/brain-context.md
  const localPath = path.join(BRAINS_DIR, slug, "pack", "brain-context.md");
  const vercelPath = path.join(BRAINS_DIR, slug, "brain-context.md");

  const filePath = fs.existsSync(localPath) ? localPath : vercelPath;
  const content = fs.readFileSync(filePath, "utf-8");
  contextCache.set(cacheKey, content);
  return content;
}

export function loadSkillPrompt(slug: string, skill: string): string {
  validateSlug(slug);
  validateSlug(skill);

  const cacheKey = `skill:${slug}:${skill}`;
  const cached = contextCache.get(cacheKey);
  if (cached) return cached;

  // Local dev: two naming conventions exist:
  //   ../brains/{slug}/pack/skills/{skill}.md/SKILL.md (belsky, jobs, attia)
  //   ../brains/{slug}/pack/skills/{skill}/SKILL.md (pg, greens, sun-tzu)
  // Vercel: public/brains/{slug}/skills/{skill}.md (flattened by sync script)
  const localPathDotMd = path.join(
    BRAINS_DIR,
    slug,
    "pack",
    "skills",
    `${skill}.md`,
    "SKILL.md",
  );
  const localPathPlain = path.join(
    BRAINS_DIR,
    slug,
    "pack",
    "skills",
    skill,
    "SKILL.md",
  );
  const vercelPath = path.join(BRAINS_DIR, slug, "skills", `${skill}.md`);

  const filePath = fs.existsSync(localPathDotMd)
    ? localPathDotMd
    : fs.existsSync(localPathPlain)
      ? localPathPlain
      : vercelPath;
  const content = fs.readFileSync(filePath, "utf-8");
  contextCache.set(cacheKey, content);
  return content;
}
