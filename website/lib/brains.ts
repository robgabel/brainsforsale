export interface Brain {
  slug: string;
  name: string;
  source: string;
  tagline: string;
  bio: string;
  atomCount: number;
  connectionCount: number;
  editionCount: number;
  clusterCount: number;
  status: "live" | "scaffolded" | "requested";
  price: number; // in dollars
  topics: string[];
  packPath: string;
}

export const BRAINS: Brain[] = [
  {
    slug: "scott-belsky",
    name: "Scott Belsky",
    source: "Implications newsletter",
    tagline: "Product intuition, creative leadership, Adobe/VC lens",
    bio: "Chief Strategy Officer at Adobe, founder of Behance, early investor in Uber, Pinterest, and Perplexity. Author of The Messy Middle. Writes Implications, a newsletter on product, design, and the future of creative tools.",
    atomCount: 284,
    connectionCount: 430,
    editionCount: 77,
    clusterCount: 16,
    status: "live",
    price: 29,
    topics: ["Product & Design", "AI & Technology", "Leadership", "Creativity", "Business Models", "Culture & Teams"],
    packPath: "brains/scott-belsky/pack/",
  },
  {
    slug: "paul-graham",
    name: "Paul Graham",
    source: "paulgraham.com essays (220+)",
    tagline: "Startup wisdom, essays on thinking, Y Combinator founder",
    bio: "Co-founder of Y Combinator, creator of Hacker News, Lisp programmer, essayist. His essays on startups, programming, and independent thinking have shaped a generation of founders.",
    atomCount: 182,
    connectionCount: 498,
    editionCount: 220,
    clusterCount: 12,
    status: "live",
    price: 29,
    topics: ["Startups", "Programming", "Writing", "Independent Thinking"],
    packPath: "brains/paul-graham/pack/",
  },
  {
    slug: "peter-attia",
    name: "Peter Attia",
    source: "The Drive podcast + Outlive",
    tagline: "Longevity science, health optimization, evidence-based medicine",
    bio: "Physician focused on the applied science of longevity. Host of The Drive podcast (300+ episodes), author of Outlive: The Science and Art of Longevity. Translates complex medical research into actionable frameworks.",
    atomCount: 0,
    connectionCount: 0,
    editionCount: 300,
    clusterCount: 0,
    status: "scaffolded",
    price: 29,
    topics: ["Longevity", "Exercise", "Nutrition", "Sleep", "Mental Health"],
    packPath: "brains/peter-attia/pack/",
  },
];

export function getBrain(slug: string): Brain | undefined {
  return BRAINS.find((b) => b.slug === slug);
}

export function getLiveBrains(): Brain[] {
  return BRAINS.filter((b) => b.status === "live");
}

export const SKILLS = [
  { name: "advise", title: "Advise", desc: "Strategic counsel on your decisions", icon: "🧭", workflow: "Decision" },
  { name: "teach", title: "Teach", desc: "Learn concepts through their lens", icon: "📖", workflow: "Learning" },
  { name: "debate", title: "Debate", desc: "Stress-test your thinking", icon: "⚔️", workflow: "Decision" },
  { name: "connect", title: "Connect", desc: "Find unexpected bridges to your work", icon: "🔗", workflow: "Creative" },
  { name: "evolve", title: "Evolve", desc: "Track how their thinking changed over time", icon: "📈", workflow: "Learning" },
  { name: "apply", title: "Apply", desc: "Turn frameworks into step-by-step action", icon: "🛠️", workflow: "Decision" },
  { name: "mashup", title: "Mashup", desc: "Synthesize ideas across multiple brains", icon: "🧬", workflow: "Creative" },
  { name: "brainfight", title: "Brainfight", desc: "Pit two brains head-to-head on a topic", icon: "🥊", workflow: "Research" },
  { name: "deep-dive", title: "Deep Dive", desc: "Everything a brain knows about one topic", icon: "🔬", workflow: "Research" },
  { name: "surprise", title: "Surprise", desc: "Surface an unexpected insight", icon: "✨", workflow: "Creative" },
];

export const TIERS = [
  {
    name: "Standard",
    price: 29,
    period: "per brain",
    features: [
      "Full skill pack (10 AI skills)",
      "Knowledge atoms (JSON)",
      "Brain context file (MD)",
      "Visual brain explorer (HTML)",
      "Mental model map",
      "All topic lenses",
    ],
    cta: "Get this brain",
    highlighted: true,
  },
  {
    name: "Pro",
    price: 79,
    period: "per brain",
    features: [
      "Everything in Standard",
      "Pre-computed embeddings (1536-dim)",
      "API access for semantic search",
      "Auto-updates on new content",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: false,
  },
  {
    name: "API",
    price: 199,
    period: "per month",
    features: [
      "Programmatic access to all brains",
      "Semantic search endpoint",
      "Graph traversal API",
      "Usage analytics",
      "Webhook notifications",
    ],
    cta: "Get API access",
    highlighted: false,
  },
];
