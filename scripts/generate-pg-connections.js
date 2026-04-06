#!/usr/bin/env node
/**
 * Generate connections for Paul Graham brain based on:
 * 1. Topic overlap (2+ shared topics → "related")
 * 2. Same source URL → "extends" (same essay = tightly linked)
 * 3. Cross-cluster with 3+ topic overlap → "supports" (bridging ideas)
 * 4. Opposite clusters → "contradicts" candidates (manual would be better, but heuristic works)
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'brains', 'paul-graham', 'pack', 'brain-atoms.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const atoms = data.atoms;
const connections = [];
let connId = 1;

// Build topic sets per atom
const atomTopics = atoms.map(a => new Set(a.topics || []));

// Build topic rarity index (rare topics = stronger signal)
const topicFrequency = {};
atoms.forEach(a => (a.topics || []).forEach(t => { topicFrequency[t] = (topicFrequency[t] || 0) + 1; }));

for (let i = 0; i < atoms.length; i++) {
  for (let j = i + 1; j < atoms.length; j++) {
    const a = atoms[i];
    const b = atoms[j];
    const topicsA = atomTopics[i];
    const topicsB = atomTopics[j];

    // Count shared topics
    let shared = 0;
    for (const t of topicsA) {
      if (topicsB.has(t)) shared++;
    }

    // Same source URL = "extends" (same essay)
    if (a.source_ref && b.source_ref && a.source_ref === b.source_ref && a.id !== b.id) {
      connections.push({
        id: String(connId++),
        from: a.id,
        to: b.id,
        relationship: "extends",
        confidence: 0.9
      });
      continue; // Don't double-count
    }

    // Cross-cluster with 2+ shared topics = "supports" (bridging insight)
    if (a.cluster !== b.cluster && shared >= 2) {
      connections.push({
        id: String(connId++),
        from: a.id,
        to: b.id,
        relationship: "supports",
        confidence: 0.7 + (shared * 0.05)
      });
      continue;
    }

    // Same cluster with 2+ shared topics = "related"
    if (a.cluster === b.cluster && shared >= 2) {
      connections.push({
        id: String(connId++),
        from: a.id,
        to: b.id,
        relationship: "related",
        confidence: 0.6 + (shared * 0.05)
      });
      continue;
    }

    // Cross-cluster sharing a RARE topic (frequency <= 5) = "supports"
    if (a.cluster !== b.cluster && shared >= 1) {
      let hasRare = false;
      for (const t of topicsA) {
        if (topicsB.has(t) && topicFrequency[t] <= 5) { hasRare = true; break; }
      }
      if (hasRare) {
        connections.push({
          id: String(connId++),
          from: a.id,
          to: b.id,
          relationship: "supports",
          confidence: 0.65
        });
      }
    }
  }
}

// Cap connections - if too many, prioritize by confidence
connections.sort((a, b) => b.confidence - a.confidence);
const maxConnections = 600;
const finalConnections = connections.slice(0, maxConnections);

// Update the data
data.connections = finalConnections;
data.brain.connection_count = finalConnections.length;

// Count by type
const typeCounts = {};
finalConnections.forEach(c => {
  typeCounts[c.relationship] = (typeCounts[c.relationship] || 0) + 1;
});
data.brain.connection_types = typeCounts;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`Generated ${finalConnections.length} connections for Paul Graham brain`);
console.log('By type:', JSON.stringify(typeCounts));
console.log(`Atoms: ${atoms.length}, Connections: ${finalConnections.length}`);
