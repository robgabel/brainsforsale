import { BRAINS } from "@/lib/brains";
import { BrainCard } from "@/components/BrainCard";

export const metadata = {
  title: "Brains — BrainsFor.Dev",
  description: "Browse and explore knowledge graphs of the world's best thinkers.",
};

export default function BrainsPage() {
  const liveBrains = BRAINS.filter((b) => b.status === "live");
  const scaffoldedBrains = BRAINS.filter((b) => b.status === "scaffolded");

  return (
    <>
      {/* Header */}
      <section className="px-6 pb-12 pt-16 md:pt-20">
        <div className="mx-auto max-w-[1140px]">
          <h1 className="font-display text-4xl font-light tracking-[-1.2px] text-deep-ink md:text-5xl">
            Brain catalog
          </h1>
          <p className="mt-3 max-w-[600px] text-lg text-body">
            Explore every brain before you install. All atoms, connections, and insights are visible.
            All brains are free during beta.
          </p>
        </div>
      </section>

      {/* Live Brains */}
      {liveBrains.length > 0 && (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-[1140px]">
            <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-normal tracking-tight text-deep-ink">
              <span className="h-2 w-2 rounded-full bg-success" />
              Live
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {liveBrains.map((brain) => (
                <BrainCard key={brain.slug} brain={brain} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Building */}
      {scaffoldedBrains.length > 0 && (
        <section className="bg-warm-paper px-6 py-16">
          <div className="mx-auto max-w-[1140px]">
            <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-normal tracking-tight text-deep-ink">
              <span className="h-2 w-2 rounded-full bg-brain-indigo" />
              Building now
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {scaffoldedBrains.map((brain) => (
                <BrainCard key={brain.slug} brain={brain} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Request section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
            Don&apos;t see your thinker?
          </h2>
          <p className="mt-2 text-sm text-body">
            Request a brain. When it hits 50 requests, we build it.
          </p>
          <div className="mt-6 flex gap-3">
            <input
              type="text"
              placeholder="e.g. Naval Ravikant, Ray Dalio..."
              className="flex-1 rounded-lg border border-border-default bg-white px-4 py-3 text-sm text-deep-ink placeholder-muted outline-none transition-all focus:border-brain-indigo focus:ring-[3px] focus:ring-brain-indigo/20"
            />
            <button className="rounded-lg bg-brain-indigo px-5 py-3 text-sm font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover">
              Request
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
