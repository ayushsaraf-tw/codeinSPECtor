const fs = require('fs');
const path = require('path');

const partsDir = path.join(__dirname, 'templates', 'parts');

const partFiles = [
  'privacy_guardrails.md',
  'phase1_recon.md',
  'phase2_slicing.md',
  'phase3_analysis.md',
  'phase4_aggregation.md',
  'stakeholder_views.md'
];

const header = `---
name: build-baseline
description: Interactive 4-phase OpenSpec baseline engine with adaptive ecosystem detection, nested capability slicing, C4 architecture diagrams, multi-stakeholder views, confidence scoring, line citations, and zero-leakage privacy gates.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering engine for OpenSpec. Performs broad, framework-agnostic system reconnaissance, locks in the detected stack, generates nested capability specifications, C4 diagrams, and multi-stakeholder views while enforcing pre-flight privacy guardrails.

---

`;

const combinedParts = partFiles.map(file => {
  const filePath = path.join(partsDir, file);
  return fs.readFileSync(filePath, 'utf8');
}).join('\n\n---\n\n');

const finalContent = header + combinedParts;

fs.writeFileSync(path.join(__dirname, 'templates', 'SKILL.md'), finalContent, 'utf8');

console.log("🎉 Successfully assembled modular files into templates/SKILL.md!");