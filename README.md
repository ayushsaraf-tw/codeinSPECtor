# CodeinSPECtor — OpenSpec Baseline Generator

**CodeinSPECtor** is a stateful, human-in-the-loop reverse-engineering skill for OpenSpec. It analyzes legacy codebases (regardless of architecture or stack) and extracts structured, evidence-grounded specifications into a single canonical source-of-truth.

It uses an **"Analyze once, represent once, render many ways"** approach while strictly preserving LLM context windows through recursive capability slicing.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have installed OpenSpec globally:
```bash
npm install -g openspec
openspec init
```

### 2. Run the Baseline Builder
In your AI Assistant Chat (Copilot Chat, Cursor, Claude Code, etc.), run one of the following commands:
```text
/opsx:build-baseline            <-- Run the Comprehensive Baseline Builder
/opsx:build-baseline ignore files and folders with `v1` tag             <-- Run the basic Baseline Builder

```

---

## 🔄 The Interactive 4-Phase Pipeline

CodeinSPECtor works in four stateful, human-in-the-loop phases. Progress is saved after every step so you can pause, review, or resume at any time.

```text
Phase 1: System Map
│
▼
Phase 2: Capabilities Tree Setup
│
▼
Phase 3: Thin-Slice Capability Analysis (Iterative)
│
▼
Phase 4: Baseline, Dependency Map & RAID Aggregation
```

### Phase 1: System Reconnaissance
* **Command:** `/opsx:build-baseline`
* **Output:** `openspec/specs/SYSTEM_MAP.md`
* **What it does:** Scans top-level directory structures, build configs, and DB migrations to build an entry-point inventory without reading deep application logic.

### Phase 2: Capability Slicing
* **Command:** `/opsx:build-baseline`
* **Output:** `openspec/specs/CAPABILITIES_TREE.md`
* **What it does:** Groups discovered routes into logical capabilities (`CAP-001`, `CAP-002`). Large flows (>3 endpoints or >500 LOC) are flagged to be decomposed into sub-slices (`CAP-001a`, `CAP-001b`).

### Phase 3: Thin-Slice Analysis
* **Command:** `/opsx:build-baseline <CAP-ID>`
* **Output:** `openspec/specs/<capability-slug>.md`
* **What it does:** Reads **only** the target source files for a single capability to keep context windows minimal (< 30% utilization). Extracts:
    - Domain Glossaries & Business Impact
    - Entry Points & Security Gates
    - Database Schema Mutations & SQL Changes
    - Gherkin BDD Scenarios (`Given/When/Then`)
    - Error & Failure Matrices with File/Line evidence citations

### Phase 4: Baseline Consolidation
* **Command:** `/opsx:build-baseline aggregate`
* **Outputs:**
    - `openspec/specs/BASELINE.md` (Merged master specification)
    - `openspec/specs/DEPENDENCY_MAP.md` (Cross-feature call graph & shared DB mutations)
    - `openspec/specs/RAID_LOG.md` (Aggregated Risks, Assumptions, Issues & Tech Debt)

---

## 📂 OpenSpec Directory Structure

```text
.
├── .openspec/
│   └── skills/
│       └── build/
│           └── SKILL.md                 <-- Custom /opsx:build-baseline skill file
└── openspec/
    └── specs/
        ├── SYSTEM_MAP.md                <-- Discovered entry points & modules
        ├── CAPABILITIES_TREE.md         <-- Capability index & completion status
        ├── BASELINE.md                  <-- Master consolidated baseline
        ├── DEPENDENCY_MAP.md            <-- Inter-feature coupling & call graph
        ├── RAID_LOG.md                  <-- Technical debt & risk catalog
        └── <capability-slug>.md         <-- Individual thin-slice specifications