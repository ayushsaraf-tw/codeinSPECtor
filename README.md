# 🔍 CodeinSPECtor

**CodeinSPECtor** is an OpenSpec-native reverse-engineering engine and engineering convention enforcer for legacy codebases. It provides a stateful, human-in-the-loop workflow (`/opsx:build-baseline`) that extracts evidence-grounded specifications into a single source of truth without overflowing LLM context windows, while enforcing shift-left TDD, trunk-based delivery, and quality guardrails across day-to-day OpenSpec proposals.

---

## 🚀 Quick Start for Legacy Repositories

Set up `codeinSPECtor` in any legacy repository in seconds with **zero configuration**.

### Step 1: Open Your Target Repository Terminal
Navigate to the root directory of the legacy codebase you want to baseline:

```bash
cd /path/to/your-legacy-repo
```

### Step 2: Initialize codeinSPECtor
Run this single command in your terminal:

```bash
npx git+https://github.com/ayushsaraf-tw/codeinSPECtor.git init
```
*(Note: If the repository is private, ensure your Git SSH credentials are configured).*

This command automatically:
- Initializes native OpenSpec (`.openspec/` and `openspec/specs/`) if missing.
- Deploys team engineering standards to `openspec/specs/CONVENTIONS.md`.
- Updates `.gitignore` to exclude temporary analysis artifacts and pre-flight privacy logs.
- Patches existing OpenSpec lifecycle skills (`openspec-propose`, `openspec-apply`) to enforce your engineering conventions.
- Registers the `/opsx:build-baseline` skill across local agent directories (`.openspec/`, `.claude/`, `.agents/`).

---

## 🔄 The 4-Phase Reverse-Engineering Baseline Workflow

Open your preferred AI Assistant Chat (Cursor, Claude Code, GitHub Copilot, etc.) inside the legacy repository and run:

```text
/opsx:build-baseline
```

`codeinSPECtor` runs in four interactive phases, pausing after each phase for human review:

```text
Phase 1: Broad System Reconnaissance (SYSTEM_MAP.md)
│
▼
Phase 2: Capability Slicing & Semantic Nesting (CAPABILITIES_TREE.md)
│
▼
Phase 3: Thin-Slice Analysis & C4 Architecture Diagrams (Iterative)
│
▼
Phase 4: Master Baseline Consolidation & C4 System Diagrams
```

### 1. Phase 1 — Broad System Reconnaissance (`SYSTEM_MAP.md`)
* **Trigger Condition:** Executes automatically when `openspec/specs/SYSTEM_MAP.md` does not exist.
* **Agnostic Ecosystem Discovery:** Scans manifests (`package.json`, `pom.xml`, `go.mod`, `Cargo.toml`, `pyproject.toml`, etc.), build configurations, ORM migrations, SQL schemas, and entry mechanisms without front-loading application code.
* **Artifact Generated:** Writes `openspec/specs/SYSTEM_MAP.md` and records `.detected_ecosystem` for stack-tailored downstream analysis.
* **Human Gate:** Halts to display the discovered ecosystem and entry points before proceeding.

### 2. Phase 2 — Capability Slicing & Semantic Nesting (`CAPABILITIES_TREE.md`)
* **Trigger Condition:** Executes when `SYSTEM_MAP.md` exists but `openspec/specs/CAPABILITIES_TREE.md` does not.
* **Semantic Grouping:** Groups entry points into logical business capabilities using standard IDs (`cap-XXX-<short-slug>`).
* **Nested Slicing Rule:** If a capability touches **>4 source files**, it is automatically split into child sub-slices nested within a parent domain directory:
   - Parent Overview Spec: `openspec/specs/cap-001-user-auth/spec.md`
   - Child Sub-Slice 1: `openspec/specs/cap-001-user-auth/cap-001a-token-validation/spec.md`
   - Child Sub-Slice 2: `openspec/specs/cap-001-user-auth/cap-001b-session-persistence/spec.md`
* **Artifact Generated:** Writes the execution index to `openspec/specs/CAPABILITIES_TREE.md`.

### 3. Phase 3 — Thin-Slice Capability Analysis (`spec.md`)
* **Trigger Condition:** Executes when the user selects a target capability ID from `CAPABILITIES_TREE.md`.
* **State Guard:** Prevents accidental overwrites by checking capability status before execution.
* **Pre-Flight Privacy Gate:** Applies local regex masking to API keys, passwords, connection strings, and PII before displaying a sanitized preview diff for user confirmation.
* **Artifact Generated:** Reads source code (max 4 files per pass) and writes capability specifications adhering to strict Frontmatter Field Rules (`confidence_score`, `unverified_assumptions`, `stability`, `linked_capabilities`) containing:
   - Domain Purpose & Business Intent
   - Technical Entry Points & Security Gates
   - Embedded **Mermaid C4 Component Architecture Diagrams**
   - Database Schema Mutations with exact file:line citations
   - Behavior Scenarios in Gherkin BDD format
   - Failure & Error Matrices with trigger conditions and HTTP/exception status codes

### 4. Phase 4 — Baseline Consolidation & Master Artifacts
* **Trigger Condition:** Executes when the user requests `'aggregate'` or `'build baseline'`.
* **Master Artifacts Generated:**
   - `openspec/specs/INDEX.md`: Central navigation index with status tables, confidence scores, and C4 diagram links.
   - `openspec/specs/SYSTEM_C4_DIAGRAM.md`: Master C4 system architecture diagram synthesizing component interactions across all analyzed capabilities.
   - `openspec/specs/DEPENDENCY_MAP.md`: Cross-capability coupling graphs and shared database state dependencies.
   - `openspec/specs/RAID_LOG.md`: Aggregated risks, assumptions, technical debt, and unmasked legacy code smells.
   - `openspec/specs/BASELINE.md`: Merged global system specification including global domain glossary, consolidated Gherkin scenarios, and unified error matrix.

### 5. Optional Phase — Multi-Stakeholder View Generation
* **Trigger Condition:** Executed by typing `render <view-type>` (`client`, `architect`, `developer`, `agent`) after baseline aggregation.
* **Custom Perspectives:** Renders audience-specific summaries (e.g., non-technical executive summaries for business users, full file:line citations and schema mutations for developers, or machine-readable JSON/YAML stubs for TDD agents).

---

## 📋 Shift-Left Engineering Conventions (`openspec/specs/CONVENTIONS.md`)

Once your baseline is generated, day-to-day development transitions seamlessly to standard native OpenSpec CLI commands (`openspec-propose`, `openspec-apply`). `codeinSPECtor` automatically enforces team development practices across these commands:

* **Shift-Left Constraint Discovery & RAIDD:** Capability constraints, breaking changes, and cross-service risks are called out during `proposal.md` drafting—long before writing code.
* **TDD & Trunk-Based Commit Ordering:** Enforces Red-Green-Refactor cycles. Tasks are structured into small, testable commits where tests and core logic land first, followed by the feature flag.
* **Dual-State Feature Toggle Testing:** Requires explicit test coverage verifying that when a toggle is **OFF**, legacy functionality operates 100% regression-free.
* **Fitness Functions & Clean Code:** Mandates checking or adding architectural fitness function rules (e.g., ArchUnit) and aligning refactoring with *Refactoring.Guru* patterns.
* **Visual Documentation:** Embedded Mermaid sequence diagrams, C4 maps, and ER diagrams for any proposal involving state mutations or multi-service messaging.

---

## 📂 Workspace Directory Layout

After running `npx` and executing the baseline engine, your workspace contains:

```text
your-legacy-repo/
├── .gitignore                      <-- Automatically updated with privacy/cache exclusions
├── .openspec/
│   └── skills/
│       ├── build-baseline/         <-- Installed codeinSPECtor skill definition
│       ├── openspec-propose/       <-- Patched to enforce CONVENTIONS.md
│       └── openspec-apply/         <-- Patched to enforce CONVENTIONS.md
└── openspec/
└── specs/
├── CONVENTIONS.md          <-- Canonical engineering, TDD & feature flag rules
├── SYSTEM_MAP.md           <-- Discovered ecosystem entry points
├── CAPABILITIES_TREE.md    <-- Capability slicing index & status
├── INDEX.md                <-- Central navigation index & confidence levels
├── BASELINE.md             <-- Merged system specification & domain glossary
├── SYSTEM_C4_DIAGRAM.md    <-- Master architecture C4 diagram
├── DEPENDENCY_MAP.md       <-- Cross-capability call graph & database coupling
├── RAID_LOG.md             <-- Consolidated risks, tech debt & unmasked code smells
└── cap-XXX-<slug>/
└── spec.md             <-- Thin-slice capability specification with C4 diagrams
```

---

## 🛠️ Local Development & Prompt Building

For contributors working on `codeinSPECtor` itself, prompt logic is structured modularly under `templates/parts/`:

```text
codeinSPECtor/
├── templates/
│   ├── parts/
│   │   ├── 00_conventions.md       <-- Engineering standards template
│   │   ├── 01_privacy_guardrails.md<-- Pre-flight local regex masking rules
│   │   ├── 02_phase1_recon.md      <-- Stack-agnostic system discovery
│   │   ├── 03_phase2_slicing.md    <-- Semantic nesting rules
│   │   ├── 04_phase3_analysis.md   <-- C4 diagrams & BDD spec generation
│   │   ├── 05_phase4_aggregation.md<-- Baseline & master C4 synthesis
│   │   └── 06_stakeholder_views.md <-- Multi-audience perspective renderings
│   ├── CONVENTIONS.md              <-- Compiled conventions artifact
│   └── SKILL.md                    <-- Compiled single-file skill entrypoint
├── create_template.js              <-- Assembly build script
├── bin/cli.js                      <-- Deployment CLI
└── package.json
```

### Build Command
Compile modular prompt parts into target template artifacts prior to testing or releasing:

```bash
npm run build
```
*(Note: `npm run build` runs automatically via the `prepack` hook when publishing or running via `npx`).*

---

## 💡 Resuming & State Persistence

`codeinSPECtor` is completely stateful:

* **Partial Baseline Execution:** You can reverse-engineer 2 out of 10 capabilities today, run Phase 4 consolidation, and have a fully valid baseline for those 2 capabilities.
* **Incremental Updates:** When returning days later, `/opsx:build-baseline` inspects `CAPABILITIES_TREE.md`, skips already completed slices, and appends new analysis directly into `INDEX.md`, `BASELINE.md`, and `SYSTEM_C4_DIAGRAM.md`.