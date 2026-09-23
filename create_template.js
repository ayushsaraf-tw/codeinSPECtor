const fs = require('fs');
const path = require('path');

const partsDir = path.join(__dirname, 'templates', 'parts');

// Array of modular template parts
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
description: Interactive 4-phase OpenSpec baseline engine with adaptive ecosystem detection, nested capability slicing, C4 architecture diagrams, multi-stakeholder views, confidence scoring, line citations, zero-leakage privacy gates, and strict TDD/engineering conventions.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering engine for OpenSpec. Performs broad, framework-agnostic system reconnaissance, locks in the detected stack, generates nested capability specifications, C4 diagrams, and multi-stakeholder views while enforcing pre-flight privacy guardrails and team engineering conventions.

---

`;

const combinedParts = partFiles.map(file => {
  const filePath = path.join(partsDir, file);
  return fs.readFileSync(filePath, 'utf8');
}).join('\n\n---\n\n');

const finalContent = header + combinedParts;

const outputDir = path.join(__dirname, 'templates');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'SKILL.md'), finalContent, 'utf8');

// Also generate a copy of CONVENTIONS.md for direct deployment
const conventionsSource = fs.readFileSync(path.join(partsDir, 'mandatory_conventions.md'), 'utf8');
fs.writeFileSync(path.join(outputDir, 'CONVENTIONS.md'), conventionsSource, 'utf8');

console.log("🎉 Assembled templates/SKILL.md and templates/CONVENTIONS.md successfully!");