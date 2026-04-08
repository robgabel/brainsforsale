import { getLiveBrains, SKILLS } from "@/lib/brains";
import { getAllDemos, getDefaultDemo } from "@/lib/skill-demos";
import { SkillsPlayground } from "@/components/SkillsPlayground";
import Link from "next/link";

export const metadata = {
  title: "Skills \u2014 brainsfor.dev",
  description:
    "Try 8 AI thinking skills powered by the world\u2019s best thinkers. See the difference structured knowledge makes.",
};

export default function SkillsPage() {
  const liveBrains = getLiveBrains().map((b) => ({
    slug: b.slug,
    name: b.name,
  }));
  const demos = getAllDemos();
  const defaultDemo = getDefaultDemo();

  return (
    <>
      {/* \u2500\u2500\u2500 Hero \u2500\u2500\u2500 */}
      <section className="px-6 pb-8 pt-20 md:pt-28">
        <div className="mx-auto max-w-[900px] text-center">
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-[-1.2px] text-deep-ink md:text-[48px]">
            Try the skills.
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-lg leading-relaxed text-body">
            Pick a brain. Pick a skill. See what structured knowledge does to
            your AI.
          </p>
        </div>
      </section>

      {/* \u2500\u2500\u2500 Interactive Playground \u2500\u2500\u2500 */}
      <section className="pb-20">
        <SkillsPlayground
          brains={liveBrains}
          skills={SKILLS}
          demos={demos}
          defaultBrain={defaultDemo.brain}
          defaultSkill={defaultDemo.skill}
        />
      </section>

      {/* \u2500\u2500\u2500 All 8 Skills Grid \u2500\u2500\u2500 */}
      <section className="bg-warm-paper px-6 py-20">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-center font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            8 thinking skills per brain
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-base text-body">
            Not just data. Interactive reasoning modes that chain into workflows.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="group rounded-lg border border-border-default bg-white p-4 transition-all hover:border-border-indigo hover:shadow-brain"
              >
                <div className="text-2xl">{skill.icon}</div>
                <p className="mt-2 font-mono text-sm font-medium text-deep-ink">
                  /{skill.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-body">
                  {skill.desc}
                </p>
                <span className="mt-2 inline-block rounded-full bg-cool-surface px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {skill.workflow}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 CTA \u2500\u2500\u2500 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            Ready to load a brain?
          </h2>
          <p className="mt-3 text-base text-body">
            Install in seconds. Works with Claude Code, Cursor, Gemini CLI, and
            more.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/brains"
              className="rounded-lg bg-brain-indigo px-6 py-3 text-[15px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98]"
            >
              Browse Brains
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border-[1.5px] border-indigo-soft bg-transparent px-6 py-3 text-[15px] font-semibold text-brain-indigo transition-all hover:border-brain-indigo hover:bg-brain-indigo/5"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
