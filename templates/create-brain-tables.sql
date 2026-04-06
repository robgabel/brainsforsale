-- Create tables for a new brain pack.
--
-- Usage: Replace {{SLUG}} with your brain slug (e.g., "peter_attia").
--        Run against your Supabase project.
--
-- Example:
--   sed 's/{{SLUG}}/peter_attia/g' templates/create-brain-tables.sql | psql $DATABASE_URL

-- Atoms table
CREATE TABLE IF NOT EXISTS {{SLUG}}_atoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  original_quote TEXT,
  implication TEXT,
  cluster TEXT,
  topics TEXT[] DEFAULT '{}',
  source_ref TEXT,
  source_date TIMESTAMPTZ,
  confidence FLOAT DEFAULT 0.8,
  confidence_tier TEXT DEFAULT 'medium' CHECK (confidence_tier IN ('high', 'medium', 'low')),
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connections table
CREATE TABLE IF NOT EXISTS {{SLUG}}_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atom_id_1 UUID REFERENCES {{SLUG}}_atoms(id) ON DELETE CASCADE,
  atom_id_2 UUID REFERENCES {{SLUG}}_atoms(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('supports', 'contradicts', 'extends', 'related', 'inspired_by')),
  confidence FLOAT DEFAULT 0.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(atom_id_1, atom_id_2, relationship)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_atoms_cluster ON {{SLUG}}_atoms(cluster);
CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_atoms_topics ON {{SLUG}}_atoms USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_atoms_confidence ON {{SLUG}}_atoms(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_connections_atom1 ON {{SLUG}}_connections(atom_id_1);
CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_connections_atom2 ON {{SLUG}}_connections(atom_id_2);
CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_connections_rel ON {{SLUG}}_connections(relationship);

-- HNSW index for vector similarity search (create after loading embeddings)
-- CREATE INDEX IF NOT EXISTS idx_{{SLUG}}_atoms_embedding ON {{SLUG}}_atoms
--   USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- RLS (required by Supabase)
ALTER TABLE {{SLUG}}_atoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{SLUG}}_connections ENABLE ROW LEVEL SECURITY;

-- Policy: allow read access (adjust for your auth model)
CREATE POLICY "Allow public read on {{SLUG}}_atoms"
  ON {{SLUG}}_atoms FOR SELECT USING (true);
CREATE POLICY "Allow public read on {{SLUG}}_connections"
  ON {{SLUG}}_connections FOR SELECT USING (true);

-- Service role write access
CREATE POLICY "Allow service write on {{SLUG}}_atoms"
  ON {{SLUG}}_atoms FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service write on {{SLUG}}_connections"
  ON {{SLUG}}_connections FOR ALL USING (auth.role() = 'service_role');

-- Update brain_metadata registry
-- NOTE: brain_metadata has NOT NULL constraints on first_name, last_name, possessive.
-- This INSERT covers the minimum required columns. After creating tables,
-- update brain_metadata with full config (bio, tagline, source_*, skill_examples, etc.)
-- either via SQL or through the export pipeline.
INSERT INTO brain_metadata (
  slug, name, first_name, last_name, possessive,
  atoms_table, connections_table, status
)
VALUES (
  '{{SLUG}}', '{{NAME}}', '{{FIRST_NAME}}', '{{LAST_NAME}}', '{{POSSESSIVE}}',
  '{{SLUG}}_atoms', '{{SLUG}}_connections', 'draft'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  atoms_table = EXCLUDED.atoms_table,
  connections_table = EXCLUDED.connections_table,
  updated_at = NOW();
