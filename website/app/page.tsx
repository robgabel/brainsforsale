import { BRAINS, SKILLS } from "@/lib/brains";
import { BrainCard } from "@/components/BrainCard";
import { InstallCommand } from "@/components/InstallCommand";
import { RequestBrainForm } from "@/components/RequestBrainForm";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="px-6 pb-20 pt-20 md:pt-28">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-border-indigo bg-indigo-mist/50 px-3.5 py-1 text-xs font-semibold text-indigo-deep tracking-wide">
            Beta &mdash; All brains free
          </div>
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-[-1.5px] text-deep-ink md:text-[56px]">
            Load a genius into your AI.
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-relaxed text-body">
            Knowledge graphs of the world&apos;s best thinkers. 10 AI skills per brain.
            Install in seconds.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <InstallCommand />
            <p className="font-mono text-xs text-muted">
              Works with Claude Code, Cursor, Gemini CLI, and more
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/brains"
              className="rounded-lg bg-brain-indigo px-6 py-3 text-[15px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98]"
            >
              Browse Brains
            </Link>
            <Link
              href="/brains/scott-belsky"
              className="rounded-lg border-[1.5px] border-indigo-soft bg-transparent px-6 py-3 text-[15px] font-semibold text-brain-indigo transition-all hover:bg-brain-indigo/5 hover:border-brain-indigo"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Live Demo (side-by-side) ─── */}
      <section className="bg-warm-paper px-6 py-20">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-center font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            See the difference.
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-base text-body">
            The same question, with and without a brain loaded.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Without brain */}
            <div className="rounded-xl bg-deep-ink p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                <span className="font-mono text-xs text-[#94a3b8]">Without a brain</span>
              </div>
              <p className="font-mono text-sm leading-relaxed text-[#94a3b8]">
                <span className="text-[#e2e8f0]">&gt; Should I raise my Series A or stay bootstrapped?</span>
              </p>
              <div className="mt-4 font-mono text-sm leading-relaxed text-[#64748b]">
                It depends on your situation. Consider factors like your runway, growth rate, market opportunity, and
                personal goals. Both paths have trade-offs. Raising can accelerate growth but dilutes ownership.
                Bootstrapping preserves control but may limit speed...
              </div>
              <p className="mt-4 font-mono text-xs text-[#475569]">Generic. No frameworks. No evidence.</p>
            </div>

            {/* With brain */}
            <div className="rounded-xl border border-border-indigo bg-deep-ink p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <span className="font-mono text-xs text-success">Belsky Brain loaded (3 atoms, confidence: 0.95)</span>
              </div>
              <p className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
                &gt; /advise &quot;Should I raise my Series A or stay bootstrapped?&quot;
              </p>
              <div className="mt-4 font-mono text-sm leading-relaxed text-[#c7d2fe]">
                Belsky would push you toward staying small. His core thesis is
                &quot;revenue per employee&quot; as the new status metric &mdash; he believes
                resourcefulness outperforms resources, and AI-native tools let
                small teams scale ambition without proportionate headcount.
              </div>
              <div className="mt-3 font-mono text-xs text-[#818cf8]">
                Sources: &quot;Scaling Without Growing&quot;, &quot;Premium of Originality&quot;, &quot;Exponential Code&quot;
              </div>
              <div className="mt-3 font-mono text-xs text-[#6366f1]">
                Try /debate to stress-test &bull; /apply to model for your business
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Brain Catalog Preview ─── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-center font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            Available brains
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-base text-body">
            Explore before you install. Every atom, connection, and insight &mdash; visible.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BRAINS.map((brain) => (
              <BrainCard key={brain.slug} brain={brain} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/brains" className="text-sm font-semibold text-brain-indigo hover:underline">
              View all brains &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-warm-paper px-6 py-20">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-center font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            Three steps. That&apos;s it.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse & choose",
                desc: "Explore the full knowledge graph. See every atom, connection, and insight before you install.",
              },
              {
                step: "02",
                title: "Install with one command",
                desc: "One line in your terminal. Works with Claude Code, Cursor, Gemini CLI, and any AI tool that supports skills.",
                code: "npx skills add brainsforsale/belsky",
              },
              {
                step: "03",
                title: "Use 10 thinking skills",
                desc: "From /advise for decisions to /surprise for daily inspiration. Chain skills into workflows.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl bg-white p-6 shadow-brain">
                <span className="font-mono text-xs font-semibold text-brain-indigo">{item.step}</span>
                <h3 className="mt-3 font-display text-xl font-normal tracking-tight text-deep-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{item.desc}</p>
                {item.code && (
                  <div className="mt-4 rounded-lg bg-deep-ink px-4 py-3 font-mono text-xs text-success">
                    $ {item.code}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ���── Skill Showcase ─── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-center font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            10 thinking skills per brain
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-base text-body">
            Not just data. Interactive reasoning modes that chain into workflows.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="group rounded-lg border border-border-default bg-white p-4 transition-all hover:border-border-indigo hover:shadow-brain"
              >
                <div className="text-2xl">{skill.icon}</div>
                <p className="mt-2 font-mono text-sm font-medium text-deep-ink">/{skill.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-body">{skill.desc}</p>
                <span className="mt-2 inline-block rounded-full bg-cool-surface px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {skill.workflow}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-warm-paper px-6 py-16">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-center gap-12 text-center">
          {[
            { value: "284", label: "Knowledge atoms" },
            { value: "430", label: "Typed connections" },
            { value: "77", label: "Source editions" },
            { value: "16", label: "Topic clusters" },
            { value: "10", label: "AI skills" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl font-light tracking-tight text-deep-ink md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Founding Supporters ─── */}
      <section className="bg-brand-night px-6 py-20 text-white">
        <div className="mx-auto max-w-[720px] text-center">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
            Limited
          </span>
          <h2 className="mt-6 font-display text-3xl font-light tracking-[-0.75px] md:text-4xl">
            Become a founding supporter
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-base leading-relaxed text-white/70">
            First 100 members per brain get their name embedded in the brain pack, free updates forever,
            and a vote on the next brain we build.
          </p>
          <div className="mt-8">
            <Link
              href="/brains"
              className="inline-block rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-deep-ink transition-all hover:bg-white/90"
            >
              Claim your spot
            </Link>
          </div>
          <p className="mt-4 font-mono text-xs text-white/40">
            87 of 100 founding spots remaining for the Belsky brain
          </p>
        </div>
      </section>

      {/* ─── Request a Brain ─── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-display text-3xl font-normal tracking-[-0.75px] text-deep-ink md:text-4xl">
            Who should we build next?
          </h2>
          <p className="mt-3 text-base text-body">
            Request a thinker. When a brain hits 50 requests, we build it.
          </p>
          <div className="mt-8">
            <RequestBrainForm />
          </div>
        </div>
      </section>
    </>
  );
}
