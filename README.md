# 🔍 CodeinSPECtor

**CodeinSPECtor** is an OpenSpec-native reverse-engineering engine for legacy codebases. It provides a stateful, human-in-the-loop workflow (`/opsx:build-baseline`) that extracts evidence-grounded specifications into a single source of truth without overflowing LLM context windows.

---

## 🚀 Quick Start for Legacy Repositories

Any team working on a legacy repository can set up `codeinSPECtor` in seconds with **zero configuration**.

### Step 1: Open Your Target Legacy Repository Terminal
Navigate to the root directory of the legacy codebase you want to reverse-engineer:

```bash
cd /path/to/your-legacy-repo
```
### Step 2: Initialize codeinSPECtor
Run this single command in your terminal:

```bash
npx git+https://github.com/ayushsaraf-tw/codeinSPECtor.git init
```
(Note: If the repo is private, ensure your Git SSH credentials are configured).

This command automatically:
  - Initializes OpenSpec in the legacy repository if it isn't already present.
  - Injects the /opsx:build-baseline skill across your local agent directories (.openspec/, .agents/, .claude/, .github/).

### Step 3: Run the Reverse-Engineering Engine
Open your preferred AI Assistant Chat (VS Code Copilot, Cursor, Claude Code, etc.) inside the legacy repository and run:

Plaintext
/opsx:build-baseline
🔄 The 4-Phase Baseline Workflow
codeinSPECtor runs in four interactive, human-in-the-loop phases. It pauses after each phase so you can inspect progress, refine output, or pause work.

```Plaintext
Phase 1: System Map
       │
       ▼
Phase 2: Capability Tree & Slicing
       │
       ▼
Phase 3: Thin-Slice Capability Analysis (Iterative)
       │
       ▼
Phase 4: Baseline, Dependency Map & RAID Consolidation
```

1. **Phase 1** — System Reconnaissance (SYSTEM_MAP.md)
Scans build files, directory structures, and DB migrations to create a lightweight inventory of entry points without loading complex application code.

2. **Phase 2** — Capability Tree (CAPABILITIES_TREE.md)
Groups entry points into logical business capabilities (CAP-001, CAP-002). Large flows (>3 endpoints or >4 source files) are automatically flagged to be decomposed into sub-slices (CAP-001a, CAP-001b) to protect context window limits.

3. **Phase 3** — Thin-Slice Capability Analysis (<capability-slug>.md)
Analyzes source code files for a single capability slice at a time. Generates canonical OpenSpec files containing:
   - Domain Glossaries & Business Purpose 
   - Security Gates & Authentication Logic 
   - Database Schema Mutations & Table Impacts 
   - Behavior Scenarios in Gherkin (Given / When / Then)
   - Failure & Error Matrices with exact source file/line citations

4. **Phase 4** — Master Aggregation (BASELINE.md)
Aggregates all completed thin-slice specs into three master artifacts:
   - openspec/specs/BASELINE.md: Merged system-wide specification. 
   - openspec/specs/DEPENDENCY_MAP.md: Cross-feature call graph and shared database state mutations. 
   - openspec/specs/RAID_LOG.md: Consolidated technical debt, concurrency risks, assumptions, and code smells.
---
## 📂 Generated Workspace Structure
Once executed, specifications are saved under the standard OpenSpec paths in your repository:

```Plaintext
your-legacy-repo/
├── .openspec/
│   └── skills/
│       └── build-baseline/
│           └── SKILL.md            <-- codeinSPECtor skill definition
└── openspec/
    └── specs/
        ├── SYSTEM_MAP.md           <-- Discovered entry points & components
        ├── CAPABILITIES_TREE.md    <-- Capability index & execution status
        ├── BASELINE.md             <-- Consolidated system baseline
        ├── DEPENDENCY_MAP.md       <-- Inter-feature coupling & call graph
        ├── RAID_LOG.md             <-- Aggregated risks, assumptions & tech debt
        └── <capability-slug>.md    <-- Thin-slice capability specifications
```
---     
## 💡Resuming & Updating Work
**CodeinSPECtor is completely stateful:**

**Partial Builds:** You can reverse-engineer 2 out of 5 capabilities today, run Phase 4 aggregation, and have a valid baseline for those 2 capabilities.

**Incremental Continuation:** When you return days later to analyze capability 3, /opsx:build-baseline detects completed capabilities, skips re-analyzing them, and appends new work directly into BASELINE.md, DEPENDENCY_MAP.md, and RAID_LOG.md.