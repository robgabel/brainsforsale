#!/usr/bin/env node
/**
 * Syncs brain pack assets (explore.html, brain-atoms.json) into website/public/
 * so they're served as static files. Run automatically via `npm run prebuild`.
 */
import fs from "fs";
import path from "path";

const BRAINS_DIR = path.join(process.cwd(), "..", "brains");
const PUBLIC_DIR = path.join(process.cwd(), "public", "brains");

const indexPath = path.join(BRAINS_DIR, "index.json");
if (!fs.existsSync(indexPath)) {
  console.log("brains/index.json not found (expected on Vercel) — skipping sync.");
  process.exit(0);
}
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

const ASSETS = ["explore.html", "brain-atoms.json", "brain-context.md"];
const SKILL_NAMES = [
  "advise",
  "teach",
  "debate",
  "connect",
  "evolve",
  "surprise",
  "coach",
  "predict",
];

let synced = 0;

// Copy index.json so lib/brains.ts can find it on Vercel
fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.copyFileSync(indexPath, path.join(PUBLIC_DIR, "index.json"));
synced++;

for (const brain of index.brains) {
  const packDir = path.join(BRAINS_DIR, brain.slug, "pack");
  const destDir = path.join(PUBLIC_DIR, brain.slug);

  // Copy brain.json config so lib/brains.ts can read it on Vercel
  const configSrc = path.join(BRAINS_DIR, brain.slug, "brain.json");
  if (fs.existsSync(configSrc)) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(configSrc, path.join(destDir, "brain.json"));
    synced++;
  }

  for (const file of ASSETS) {
    const src = path.join(packDir, file);
    if (!fs.existsSync(src)) continue;

    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, file));
    synced++;
  }

  // Copy skill SKILL.md files (two conventions exist on disk)
  //   skills/advise.md/SKILL.md (belsky, jobs, attia)
  //   skills/advise/SKILL.md (pg, greens, sun-tzu)
  // Flatten both to: skills/advise.md
  const skillsDestDir = path.join(destDir, "skills");
  for (const skill of SKILL_NAMES) {
    const srcDotMd = path.join(packDir, "skills", `${skill}.md`, "SKILL.md");
    const srcPlain = path.join(packDir, "skills", skill, "SKILL.md");
    const src = fs.existsSync(srcDotMd) ? srcDotMd : srcPlain;
    if (!fs.existsSync(src)) continue;

    fs.mkdirSync(skillsDestDir, { recursive: true });
    fs.copyFileSync(src, path.join(skillsDestDir, `${skill}.md`));
    synced++;
  }
}

console.log(`Synced ${synced} brain assets for ${index.brains.length} brains.`);
