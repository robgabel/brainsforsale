"use client";

import { useState } from "react";
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

export function SkillsPlayground({
  brains,
  skills,
  demos,
  defaultBrain,
  defaultSkill,
}: SkillsPlaygroundProps) {
  const [selectedBrain, setSelectedBrain] = useState(defaultBrain);
  const [selectedSkill, setSelectedSkill] = useState(defaultSkill);

  const brainName =
    brains.find((b) => b.slug === selectedBrain)?.name ?? selectedBrain;
  const skillMeta = skills.find((s) => s.name === selectedSkill);
  const demo = demos[`${selectedBrain}:${selectedSkill}`] ?? null;

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
              onClick={() => setSelectedBrain(brain.slug)}
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
          onChange={(e) => setSelectedBrain(e.target.value)}
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
      <div className="mb-10">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Choose a skill
        </label>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const active = selectedSkill === skill.name;
            const available = !!demos[`${selectedBrain}:${skill.name}`];
            return (
              <button
                key={skill.name}
                onClick={() => setSelectedSkill(skill.name)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[13px] font-medium transition-all ${
                  active
                    ? "bg-brain-indigo text-white shadow-sm"
                    : available
                      ? "bg-cool-surface text-label hover:bg-brain-indigo/10 hover:text-brain-indigo"
                      : "bg-cool-surface/50 text-muted"
                }`}
              >
                <span>{skill.icon}</span>
                <span>/{skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Split-Screen Panels ─── */}
      {demo ? (
        <div
          key={`${selectedBrain}:${selectedSkill}`}
          className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-300"
        >
          {/* Left: Generic AI */}
          <div className="rounded-xl bg-deep-ink p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
              <span className="font-mono text-xs text-[#94a3b8]">
                Without a brain
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
              <span className="text-[#64748b]">&gt;</span> You are {brainName},{" "}
              {selectedSkill === "surprise"
                ? "show me something interesting..."
                : `${selectedSkill} me on: `}
              {selectedSkill !== "surprise" && (
                <span className="text-[#94a3b8]">{demo.prompt}</span>
              )}
            </p>
            <div className="mt-4 font-mono text-sm leading-relaxed text-[#64748b]">
              {demo.generic}
            </div>
            <p className="mt-4 font-mono text-xs text-[#475569]">
              Generic. No frameworks. No evidence.
            </p>
          </div>

          {/* Right: With BrainsFor */}
          <div className="rounded-xl border border-border-indigo bg-deep-ink p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="font-mono text-xs text-success">
                {brainName} brain loaded ({demo.enhanced.atoms.length} atoms,
                confidence: {demo.enhanced.confidence})
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
              <span className="text-[#6366f1]">&gt;</span> /{selectedSkill}{" "}
              {selectedSkill !== "surprise" && (
                <span>&quot;{demo.prompt}&quot;</span>
              )}
            </p>
            <div className="mt-4 font-mono text-sm leading-relaxed text-[#c7d2fe]">
              {demo.enhanced.response}
            </div>
            <div className="mt-3 font-mono text-xs text-[#818cf8]">
              Sources: {demo.enhanced.atoms.map((a, i) => (
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
            Demo coming soon. Install the brain to try this skill live:
          </p>
          <div className="mx-auto mt-4 max-w-[400px] rounded-lg bg-deep-ink px-4 py-3 font-mono text-xs text-success">
            $ npx skills add brainsfor/{selectedBrain}
          </div>
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
