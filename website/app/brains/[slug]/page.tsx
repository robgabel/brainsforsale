import { getBrain, BRAINS, SKILLS } from "@/lib/brains";
import { InstallCommand } from "@/components/InstallCommand";
import { GetBrainButton } from "@/components/GetBrainButton";
import { SkillBadge } from "@/components/SkillBadge";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return BRAINS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brain = getBrain(slug);
  if (!brain) return { title: "Brain not found" };
  return {
    title: `${brain.name} Brain — BrainsFor.Dev`,
    description: brain.tagline,
  };
}

export default async function BrainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brain = getBrain(slug);
  if (!brain) notFound();

  const isLive = brain.status === "live";

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="px-6 pb-12 pt-16 md:pt-20">
        <div className="mx-auto max-w-[1140px]">
          <Link href="/brains" className="text-sm text-brain-indigo hover:underline">&larr; All brains</Link>

          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[640px]">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl font-light tracking-[-1.2px] text-deep-ink md:text-5xl">
                  {brain.name}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isLive
                      ? "bg-[rgba(5,150,105,0.1)] text-success"
                      : "bg-indigo-mist text-indigo-deep"
                  }`}
                >
                  {isLive ? "Live" : "Building"}
                </span>
              </div>
              <p className="mt-1 font-mono text-sm text-muted">{brain.source}</p>
              <p className="mt-4 text-base leading-relaxed text-body">{brain.bio}</p>

              {/* Topics */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {brain.topics.map((t) => (
                  <SkillBadge key={t} label={t} />
                ))}
              </div>

              {/* Stats row */}
              {isLive && (
                <div className="mt-6 flex gap-8">
                  {[
                    { value: brain.atomCount, label: "atoms" },
                    { value: brain.connectionCount, label: "connections" },
                    { value: brain.editionCount, label: "editions" },
                    { value: brain.clusterCount, label: "clusters" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-2xl font-light text-deep-ink">{s.value}</div>
                      <div className="text-xs text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA card */}
            <div className="w-full rounded-xl border border-border-indigo bg-white p-6 shadow-brain-elevated md:w-[320px]">
              <div className="mb-4">
                <span className="text-2xl font-light text-muted line-through">${brain.price}</span>
                <span className="ml-3 rounded-full bg-indigo-mist px-3 py-1 text-sm font-semibold text-indigo-deep">
                  Free in Beta
                </span>
              </div>

              <GetBrainButton brainSlug={brain.slug} />

              {isLive && (
                <div className="mt-4">
                  <InstallCommand
                    command={`npx skills add brainsfor/${brain.slug}`}
                    size="sm"
                  />
                </div>
              )}

              <div className="mt-4 space-y-2 text-xs text-body">
                <p>8 AI skills included</p>
                <p>Works with Claude, Cursor, Gemini CLI</p>
                <p>Full knowledge graph access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Brain Explorer (iframe) ─── */}
      {isLive && (
        <section className="bg-warm-paper px-6 py-16">
          <div className="mx-auto max-w-[1140px]">
            <h2 className="mb-2 font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
              Explore this brain
            </h2>
            <p className="mb-6 text-sm text-body">
              Browse all {brain.atomCount} atoms, connections, and thinking patterns. This is what you get.
            </p>

            <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-brain-elevated">
              <iframe
                src={`/brains/${brain.slug}/explore.html`}
                className="h-[700px] w-full border-0"
                title={`${brain.name} Brain Explorer`}
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── Skills ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="mb-2 font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
            8 thinking skills included
          </h2>
          <p className="mb-8 text-sm text-body">
            Chain skills into workflows: Decision (/advise &rarr; /debate &rarr; /coach), Learning (/teach &rarr; /evolve &rarr; /coach), Creative (/surprise &rarr; /connect &rarr; /predict).
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="rounded-lg border border-border-default bg-white p-4 transition-all hover:border-border-indigo hover:shadow-brain"
              >
                <div className="text-2xl">{skill.icon}</div>
                <p className="mt-2 font-mono text-sm font-medium text-deep-ink">/{skill.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-body">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What you get ─── */}
      <section className="bg-warm-paper px-6 py-16">
        <div className="mx-auto max-w-[720px]">
          <h2 className="mb-6 font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
            What&apos;s in the pack
          </h2>

          <div className="rounded-xl bg-deep-ink p-6 font-mono text-sm leading-loose text-[#e2e8f0]">
            <div className="text-[#818cf8]">brainsfor-{brain.slug}/</div>
            <div className="pl-4 text-[#e2e8f0]">SKILL.md <span className="text-[#64748b]">&larr; brain setup (one-time)</span></div>
            <div className="pl-4 text-[#e2e8f0]">brain-context.md <span className="text-[#64748b]">&larr; THE LLM file (full knowledge)</span></div>
            <div className="pl-4 text-[#e2e8f0]">brain-atoms.json <span className="text-[#64748b]">&larr; structured data + connections</span></div>
            <div className="pl-4 text-[#e2e8f0]">explore.html <span className="text-[#64748b]">&larr; visual brain explorer</span></div>
            <div className="pl-4 text-[#e2e8f0]">README.md</div>
            <div className="pl-4 text-[#818cf8]">skills/</div>
            <div className="pl-8 text-[#e2e8f0]">advise/SKILL.md</div>
            <div className="pl-8 text-[#e2e8f0]">teach/SKILL.md</div>
            <div className="pl-8 text-[#e2e8f0]">debate/SKILL.md</div>
            <div className="pl-8 text-[#64748b]">... 7 more skills</div>
          </div>
        </div>
      </section>

      {/* ─── Sources & Ethics ─── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-[720px]">
          <div className="rounded-xl border border-border-default bg-cool-surface p-6">
            <h3 className="font-display text-lg font-normal tracking-tight text-deep-ink">
              Built from public sources only
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              This brain was derived exclusively from freely available, public resources &mdash; interviews,
              podcasts, free newsletters, public talks, and blog posts. No transcripts from commercial works
              or paywalled essays were used. Where book ideas appear, they come from public discourse:
              reviews, author interviews, press coverage, and widely discussed concepts.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Install ─── */}
      {isLive && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-[720px]">
            <h2 className="mb-6 font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
              Install in seconds
            </h2>

            <div className="space-y-4">
              {[
                { tool: "Claude Code / Cowork", cmd: `npx skills add brainsfor/${brain.slug}` },
                { tool: "Cursor", cmd: `npx skills add brainsfor/${brain.slug}` },
                { tool: "Manual", cmd: "Download the pack and drop brain-context.md into your AI tool's project context." },
              ].map((item) => (
                <div key={item.tool} className="rounded-lg border border-border-default bg-white p-4">
                  <p className="mb-2 text-sm font-medium text-label">{item.tool}</p>
                  {item.tool !== "Manual" ? (
                    <div className="rounded-lg bg-deep-ink px-4 py-3 font-mono text-sm text-success">
                      $ {item.cmd}
                    </div>
                  ) : (
                    <p className="text-sm text-body">{item.cmd}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
