const fs = require('fs');
const path = require('path');

const partsDir = path.join(__dirname, 'templates', 'parts');
const outputDir = path.join(__dirname, 'templates');
const cwd = process.cwd();

// 1. Array of modular template parts
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

> ⚡ **DIRECT EXECUTION INSTRUCTION:**
> Whenever this file is referenced or /opsx:build-baseline is invoked, you MUST immediately execute the current active Phase or render command.
> DO NOT summarize this file, DO NOT ask meta-questions, and DO NOT output conversational filler. Execute immediately.

## Description
Stateful, human-in-the-loop reverse engineering engine for OpenSpec. Performs broad, framework-agnostic system reconnaissance, locks in the detected stack, generates nested capability specifications, C4 diagrams, and multi-stakeholder views while enforcing conditional pre-flight privacy guardrails and team engineering conventions.

`;

// 2. Assemble SKILL.md template
const combinedParts = partFiles.map(file => {
  const filePath = path.join(partsDir, file);
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}).join('\n\n---\n\n');

const finalSkillContent = header + combinedParts;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'SKILL.md'), finalSkillContent, 'utf8');

// 3. Assemble CONVENTIONS.md template
const conventionsSource = fs.readFileSync(path.join(partsDir, 'mandatory_conventions.md'), 'utf8');
fs.writeFileSync(path.join(outputDir, 'CONVENTIONS.md'), conventionsSource, 'utf8');

console.log("🎉 Assembled templates/SKILL.md and templates/CONVENTIONS.md successfully!");

// 4. Deploy / Overwrite to Project Active Skill Directories
const targetSkillDir = path.join(cwd, '.openspec', 'skills', 'build-baseline');
const targetSpecsDir = path.join(cwd, 'openspec', 'specs');

fs.mkdirSync(targetSkillDir, { recursive: true });
fs.mkdirSync(targetSpecsDir, { recursive: true });

fs.writeFileSync(path.join(targetSkillDir, 'SKILL.md'), finalSkillContent, 'utf8');
fs.writeFileSync(path.join(targetSpecsDir, 'CONVENTIONS.md'), conventionsSource, 'utf8');
console.log("🔄 Overwrote active .openspec/skills/build-baseline/SKILL.md and openspec/specs/CONVENTIONS.md.");

// 5. Append or Deploy Root CLAUDE.md Memory Pointer
const claudeMdPath = path.join(cwd, 'CLAUDE.md');
const openSpecSection = `## OpenSpec Guidelines & Execution Directives
 1. Refer to openspec/specs/CONVENTIONS.md for team engineering rules, IM8 compliance, TDD commit ordering, and feature toggle strategies.
 2. Refer to openspec/specs/SYSTEM_MAP.md for ecosystem architecture and discovered entry points.
 3. To run reverse engineering or update baseline specs, execute /opsx:build-baseline.
 4. Always prefer AST signature parsing for large files (>500 lines) and diff-based edits during updates.
 5. Render commands render 'view' MUST generate target stakeholder views directly without asking meta-questions.
`;

if (fs.existsSync(claudeMdPath)) {
  const currentContent = fs.readFileSync(claudeMdPath, 'utf-8');
  if (!currentContent.includes('openspec/specs/CONVENTIONS.md')) {
    fs.appendFileSync(claudeMdPath, openSpecSection, 'utf-8');
    console.log('✅ Appended OpenSpec guidelines to existing CLAUDE.md.');
  } else {
    console.log('ℹ️ CLAUDE.md already contains OpenSpec guidelines. If you think they are outdated, ' +
      'please review and update manually or delete CLAUDE.md to regenerate.');
  }
} else {
  const claudeMdHeader = `# Repository Guidelines & Architecture Rules`;
  fs.writeFileSync(claudeMdPath, `${claudeMdHeader}${openSpecSection}`, 'utf-8');
  console.log('✅ Generated new CLAUDE.md at repository root.');
}

// 6. Deploy / Overwrite IDE Bridge Hooks
const bridgeDirs = [
  path.join(cwd, '.claude', 'commands'),
  path.join(cwd, '.cursor', 'rules'),
  path.join(cwd, '.github')
];
bridgeDirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Claude Code CLI command bridge
fs.writeFileSync(
  path.join(cwd, '.claude', 'commands', 'opsx-build-baseline.md'),
  'Read .openspec/skills/build-baseline/SKILL.md and execute the current phase immediately.',
  'utf-8'
);

// GitHub Copilot instructions pointer
const copilotPath = path.join(cwd, '.github', 'copilot-instructions.md');
const copilotPointer = '\n\nWhen the user types `/opsx:build-baseline` or asks to build a baseline, load `.openspec/skills/build-baseline/SKILL.md` and execute the current phase immediately.';
if (fs.existsSync(copilotPath)) {
  const copilotContent = fs.readFileSync(copilotPath, 'utf-8');
  if (!copilotContent.includes('opsx:build-baseline')) {
    fs.appendFileSync(copilotPath, copilotPointer, 'utf-8');
  }
} else {
  fs.writeFileSync(copilotPath, `# GitHub Copilot Custom Instructions${copilotPointer}`, 'utf-8');
}

// Cursor rules pointer
fs.writeFileSync(
  path.join(cwd, '.cursor', 'rules', 'opsx-build-baseline.mdc'),
  `---\ndescription: OpenSpec Build Baseline Skill\nglobs: *\n---\nWhen /opsx:build-baseline is invoked, load .openspec/skills/build-baseline/SKILL.md and run the current phase immediately.`,
  'utf-8'
);

console.log('✅ Configured IDE Bridge hooks for Claude Code, Cursor, and Copilot.');