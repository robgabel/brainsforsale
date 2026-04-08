import fs from "fs";
import path from "path";

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

interface IndexEntry {
  slug: string;
  name: string;
  source: string;
  atom_count: number;
  connection_count: number;
  status: string;
  pack_path: string;
}

interface BrainConfig {
  brain_name: string;
  brain_source_description: string;
  brain_tagline?: string;
  edition_count?: number;
  clusters?: Record<string, unknown>;
  website?: {
    tagline?: string;
    bio?: string;
    topics?: string[];
    price?: number;
  };
}

// Try parent dir first (local dev), fall back to public/brains (Vercel)
const BRAINS_DIR = fs.existsSync(path.join(process.cwd(), "..", "brains", "index.json"))
  ? path.join(process.cwd(), "..", "brains")
  : path.join(process.cwd(), "public", "brains");

function loadBrains(): Brain[] {
  const indexPath = path.join(BRAINS_DIR, "index.json");
  const index: { brains: IndexEntry[] } = JSON.parse(
    fs.readFileSync(indexPath, "utf-8"),
  );

  return index.brains.map((entry) => {
    const configPath = fs.existsSync(path.join(BRAINS_DIR, entry.slug, "brain.json"))
      ? path.join(BRAINS_DIR, entry.slug, "brain.json")
      : path.join(process.cwd(), "public", "brains", entry.slug, "brain.json");
    const config: BrainConfig = JSON.parse(
      fs.readFileSync(configPath, "utf-8"),
    );

    const statusMap: Record<string, Brain["status"]> = {
      live: "live",
      ingesting: "scaffolded",
      scaffolded: "scaffolded",
      requested: "requested",
    };

    return {
      slug: entry.slug,
      name: config.brain_name,
      source: config.brain_source_description,
      tagline: config.website?.tagline ?? config.brain_tagline ?? "",
      bio: config.website?.bio ?? "",
      atomCount: entry.atom_count,
      connectionCount: entry.connection_count,
      editionCount: config.edition_count ?? 0,
      clusterCount: Object.keys(config.clusters ?? {}).length,
      status: statusMap[entry.status] ?? "scaffolded",
      price: config.website?.price ?? 29,
      topics: config.website?.topics ?? [],
      packPath: entry.pack_path,
    };
  });
}

export const BRAINS: Brain[] = loadBrains().sort((a, b) => {
  const lastA = a.name.split(" ").pop()?.toLowerCase() ?? "";
  const lastB = b.name.split(" ").pop()?.toLowerCase() ?? "";
  return lastA.localeCompare(lastB);
});

export function getBrain(slug: string): Brain | undefined {
  return BRAINS.find((b) => b.slug === slug);
}

export function getLiveBrains(): Brain[] {
  return BRAINS.filter((b) => b.status === "live");
}

export const SKILLS = [
  { name: "advise", title: "Advise", desc: "Strategic counsel on your decisions", icon: "\u{1F9ED}", workflow: "Decision" },
  { name: "teach", title: "Teach", desc: "Learn concepts through their lens", icon: "\u{1F4D6}", workflow: "Learning" },
  { name: "debate", title: "Debate", desc: "Stress-test ideas or pit positions head-to-head", icon: "\u2694\uFE0F", workflow: "Decision" },
  { name: "connect", title: "Connect", desc: "Find unexpected bridges or synthesize ideas", icon: "\u{1F517}", workflow: "Creative" },
  { name: "evolve", title: "Evolve", desc: "Track how their thinking changed over time", icon: "\u{1F4C8}", workflow: "Learning" },
  { name: "surprise", title: "Surprise", desc: "Surface an unexpected insight", icon: "\u2728", workflow: "Creative" },
  { name: "coach", title: "Coach", desc: "No answers \u2014 just the questions they\u2019d ask you", icon: "\u{1FA9E}", workflow: "Decision" },
  { name: "predict", title: "Predict", desc: "Trace second and third-order effects", icon: "\u{1F52E}", workflow: "Forecast" },
];

export const TIERS = [
  {
    name: "Standard",
    price: 29,
    period: "per brain",
    features: [
      "Full skill pack (8 AI skills)",
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
