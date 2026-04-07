import { TIERS } from "@/lib/brains";
import Link from "next/link";

export const metadata = {
  title: "Pricing — BrainsFor.Dev",
  description: "Knowledge brain packs for AI tools. Free during beta.",
};

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="px-6 pb-12 pt-16 md:pt-20">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border-indigo bg-indigo-mist/50 px-3.5 py-1 text-xs font-semibold text-indigo-deep tracking-wide">
            All tiers free during beta
          </div>
          <h1 className="font-display text-4xl font-light tracking-[-1.2px] text-deep-ink md:text-5xl">
            Simple pricing
          </h1>
          <p className="mx-auto mt-4 max-w-[540px] text-lg text-body">
            Every brain comes with 8 AI skills, full knowledge graph access, and a visual explorer.
            Currently free while we build.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-[1140px] gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border bg-white p-8 transition-all ${
                tier.highlighted
                  ? "border-border-indigo brain-stripe-top shadow-brain-elevated"
                  : "border-border-default shadow-brain"
              }`}
            >
              <h3 className="font-display text-xl font-normal tracking-tight text-deep-ink">{tier.name}</h3>

              <div className="mt-4">
                <span className="text-3xl font-light text-muted line-through">${tier.price}</span>
                <span className="ml-3 text-2xl font-display font-light text-deep-ink">$0</span>
                <span className="ml-1 text-sm text-muted">/{tier.period}</span>
              </div>
              <p className="mt-1 text-xs text-brain-indigo font-semibold">Free during beta</p>

              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-body">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/brains"
                className={`mt-8 block rounded-lg py-3 text-center text-[15px] font-semibold transition-all ${
                  tier.highlighted
                    ? "bg-brain-indigo text-white shadow-brain-cta hover:bg-indigo-hover active:scale-[0.98]"
                    : "border border-border-default text-label hover:border-border-indigo hover:text-deep-ink"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Team teaser */}
      <section className="bg-warm-paper px-6 py-16">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
            Teams coming soon
          </h2>
          <p className="mt-3 text-sm text-body">
            Shared brains for your whole team. Load the same frameworks into every AI tool across the org.
            One subscription, 10 seats.
          </p>
          <p className="mt-2 text-sm text-muted">
            Expected pricing: <span className="line-through">$199/team/month</span> &mdash; free during beta.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[720px]">
          <h2 className="mb-8 font-display text-2xl font-normal tracking-[-0.5px] text-deep-ink">
            Common questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How is this better than just asking ChatGPT what Belsky would say?",
                a: "Structured atoms with typed connections and confidence scores produce fundamentally different output than an LLM guessing from training data. You get specific frameworks, cited sources, intellectual evolution over time, and cross-brain synthesis. It's the difference between asking someone who read the Wikipedia summary and someone who has the entire corpus indexed.",
              },
              {
                q: "I can build this myself.",
                a: "You can — but will you? And will it be as good? The curation, connection typing, confidence scoring, voice extraction, and skill design are months of work. We've already done it. Your time is worth more than $29.",
              },
              {
                q: "Context windows are getting huge. Why not just paste the raw content?",
                a: "Connections, evolution tracking, and skills are the value — not pre-chunking. A 2M token window full of raw newsletters still won't give you /debate, /evolve, or /predict.",
              },
              {
                q: "What happens when beta ends?",
                a: "Founding supporters (first 100 per brain) keep free access forever. Everyone else moves to the pricing shown above. We'll give plenty of notice.",
              },
              {
                q: "Can I use this commercially?",
                a: "Standard and Pro tiers include personal and commercial use. API tier is for building products on top of the brain data. All brains use fair use of public content with full attribution.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-border-default pb-6">
                <h3 className="text-sm font-semibold text-deep-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
