const fs = require('fs');
const path = require('path');

const partsDir = path.join(__dirname, 'templates', 'parts');

const partFiles = [
  '01_privacy_guardrails.md',
  '02_fastpath_proposals.md',
  '03_phase1_recon.md',
  '04_phase2_slicing.md',
  '05_phase3_analysis.md',
  '06_phase4_aggregation.md',
  '07_stakeholder_views.md'
];

const header = `---
name: build-baseline
description: Interactive 4-phase OpenSpec baseline engine with adaptive ecosystem detection, nested capability slicing, C4 architecture diagrams, multi-stakeholder views, confidence scoring, line citations, zero-leakage privacy gates, and automated change proposals.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering engine for OpenSpec. Performs broad, framework-agnostic system reconnaissance, locks in the detected stack, generates nested capability specifications, multi-stakeholder views, and native OpenSpec change proposals while enforcing pre-flight privacy guardrails.

---

`;

const combinedParts = partFiles.map(file => {
  const filePath = path.join(partsDir, file);
  return fs.readFileSync(filePath, 'utf8');
}).join('\n\n---\n\n');

const finalContent = header + combinedParts;

fs.writeFileSync(path.join(__dirname, 'templates', 'SKILL.md'), finalContent, 'utf8');

console.log("🎉 Successfully assembled modular files into templates/SKILL.md!");