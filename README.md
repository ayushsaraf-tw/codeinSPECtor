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
- Deploys team engineering standards to `openspec/specs/CONVENTIONS.md` (preserves existing custom conventions if present).
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
Phase 1: Broad System Reconnaissance & Monorepo Scoping (SYSTEM_MAP.md)
│
▼
Phase 2: Capability Slicing, Utilities (cap-000-*) & Nested Contexts (CAPABILITIES_TREE.md)
│
▼
Phase 3: Thin-Slice Analysis & Dynamic Diagramming (Iterative)
│
▼
Phase 4: Master Baseline Consolidation, C4 System Context & RAID Log
```

### 1. Phase 1 — Broad System Reconnaissance (`SYSTEM_MAP.md`)
* **Trigger Condition:** Executes automatically when `openspec/specs/SYSTEM_MAP.md` does not exist.
* **Agnostic Ecosystem & Monorepo Discovery:** Scans manifests (`package.json`, `pom.xml`, `go.mod`, `Cargo.toml`, `pyproject.toml`, etc.), build configurations, ORM migrations, and entry mechanisms without front-loading application code. Automatically detects workspace monorepos and scopes entry points by package boundaries (`[Package: services/auth]`), while categorizing shared helpers for Phase 2 extraction and filtering out non-product verification frameworks (load tests, test runners).
* **Artifact Generated:** Writes `openspec/specs/SYSTEM_MAP.md` and records `.detected_ecosystem` for stack-tailored downstream analysis.
* **Human Gate:** Halts to display the discovered ecosystem, monorepo packages, and entry points before proceeding.

### 2. Phase 2 — Capability Slicing & Nested Bounded Contexts (`CAPABILITIES_TREE.md`)
* **Trigger Condition:** Executes when `SYSTEM_MAP.md` exists but `openspec/specs/CAPABILITIES_TREE.md` does not.
* **Shared Utility Extraction (`cap-000-*`):** Isolates cross-cutting infrastructure, ORM base abstractions, middleware, and shared helpers into dedicated utility capability slices (`cap-000-common-<slug>`).
* **Nested Slicing & Domain Leak Matrix:** Groups entry points into logical business capabilities (`cap-XXX-<short-slug>`). For sprawling domains or legacy modules with **domain leaks** (e.g., Order Processing directly mutating Payment and Inventory DB state), it creates nested sub-bounded contexts:
  - Parent Overview Spec: `openspec/specs/cap-010-order-processing/spec.md`
  - Child Sub-Slice 1: `openspec/specs/cap-010-order-processing/cap-010a-payment-capture/spec.md`
  - Child Sub-Slice 2 (Leak Slice): `openspec/specs/cap-010-order-processing/cap-010b-inventory-mutation/spec.md`
* **Domain Leak Flagging:** Flags any slice that directly mutates database models belonging to another domain as `has_domain_leak: true`.
* **Artifact Generated:** Writes the execution index to `openspec/specs/CAPABILITIES_TREE.md`.

### 3. Phase 3 — Thin-Slice Capability Analysis (`spec.md`)
* **Trigger Condition:** Executes when the user selects a target capability ID from `CAPABILITIES_TREE.md`.
* **State Guard:** Prevents accidental overwrites by checking capability status before execution.
* **Pre-Flight Privacy Gate:** Applies local regex masking to API keys, passwords, connection strings, and PII while preserving exact source code line numbering. Displays a sanitized preview diff for explicit user confirmation.
* **Black-Box Circular Dependency Mocking:** When analyzing `CAP-A` that has a cyclic dependency with `CAP-B`, the agent mocks `CAP-B` as an external boundary call rather than recursing deep into its source code.
* **Dynamic Diagram Selection Rule (Include Diagrams Wherever Required):**
  - **C4 Component Diagrams:** Included if structural component layers, adapters, or system boundaries exist.
  - **Sequence Diagrams:** Included for multi-step API flows, async events, multi-service communication, or 3rd-party handshakes (e.g., Stripe, Plaid).
  - **ER Diagrams:** Included if database tables, ORM schemas, or entity relationships are mutated or queried.
  - **Flowcharts:** Included for complex branching business logic, decision trees, or feature toggle paths.
  - **UI Hierarchy & State Diagrams:** Included for React/Vue component trees, Redux/state flows, or UI screen transitions.
  - **Event Broker Topologies:** Included for Kafka/RabbitMQ topics, queue consumers, and dead-letter pipeline flows.
* **Artifact Generated:** Reads target source files (max 4 per pass) and writes capability specifications adhering to Frontmatter Field Rules (`confidence_score`, `cyclic_dependencies`, `has_domain_leak`, `leaked_domains`, `linked_capabilities`, `stability`).

### 4. Phase 4 — Baseline Consolidation & Master Artifacts
* **Trigger Condition:** Executes when the user requests `'aggregate'` or `'build baseline'`.
* **Master Artifacts Generated:**
  - `openspec/specs/SYSTEM_C4_DIAGRAM.md`: **Mandatory** master system C4 Context/Container architecture diagram synthesizing component interactions across all analyzed capabilities.
  - `openspec/specs/INDEX.md`: Central navigation index with status tables, confidence scores, and diagram links.
  - `openspec/specs/DEPENDENCY_MAP.md`: Cross-capability coupling graphs, `cap-000-*` shared utility links, and visual highlights for cyclic dependency loops.
  - `openspec/specs/RAID_LOG.md`: Aggregated risks, unverified assumptions, technical debt, flagged domain leaks (`has_domain_leak: true`), and cyclic loops with refactoring priorities.
  - `openspec/specs/BASELINE.md`: Merged global system specification including global domain glossary, consolidated Gherkin scenarios, and unified failure/error matrix.

### 5. Optional Phase — Multi-Stakeholder View Generation
* **Trigger Condition:** Executed by typing `render <view-type>` (`client`, `architect`, `developer`, `agent`) after baseline aggregation.
* **Custom Perspectives:** Renders audience-specific summaries:
  - `render client` / `render ba`: Non-technical executive summary, user impact, and plain-language Gherkin scenarios.
  - `render architect`: System boundary maps, Master C4 diagrams, cyclic dependency loops, domain leaks, and shared `cap-000-*` utility topology.
  - `render developer`: Data schema mutations, ER diagrams, test coverage gaps, TDD commit sequencing, dual-state feature toggle testing targets (ON/OFF), and exact `file:lines` citations.
  - `render agent`: Pure machine-readable YAML/JSON frontmatter schemas, deterministic BDD scenarios, and fitness function stubs (e.g., ArchUnit rules) for TDD modernization.

---

## 📋 Shift-Left Engineering Conventions (`openspec/specs/CONVENTIONS.md`)

Once your baseline is generated, day-to-day development transitions seamlessly to standard native OpenSpec CLI commands (`openspec-propose`, `openspec-apply`). `codeinSPECtor` automatically enforces team development practices across these commands:

* **Shift-Left Constraint Discovery & RAIDD:** Capability constraints, breaking changes, and cross-service risks are called out during `proposal.md` drafting—long before writing code.
* **TDD & Trunk-Based Commit Ordering:** Enforces Red-Green-Refactor cycles. Tasks are structured into small, testable commits where tests and core logic land first, followed by the feature flag.
* **Dual-State Feature Toggle Testing:** Requires explicit test coverage verifying that when a toggle is **OFF**, legacy functionality operates 100% regression-free.
* **Output Completeness ("Floor, Not a Ceiling"):** All templates, tables, BDD scenarios, and diagram rules represent the absolute minimum expectation. Truncated or stripped-down outputs are strictly prohibited.
* **Fitness Functions & Clean Code:** Mandates checking or adding architectural fitness function rules (e.g., ArchUnit) and aligning refactoring with *Refactoring.Guru* patterns.

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
├── SYSTEM_MAP.md           <-- Discovered ecosystem entry points & package scopes
├── CAPABILITIES_TREE.md    <-- Capability slicing index & status
├── INDEX.md                <-- Central navigation index & confidence levels
├── BASELINE.md             <-- Merged system specification & domain glossary
├── SYSTEM_C4_DIAGRAM.md    <-- Master system architecture C4 diagram
├── DEPENDENCY_MAP.md       <-- Cross-capability call graph, utilities & cyclic coupling
├── RAID_LOG.md             <-- Consolidated risks, tech debt, domain leaks & cyclic loops
├── cap-000-common-<slug>/  <-- Shared infrastructure & utility specifications
└── cap-XXX-<slug>/
└── spec.md             <-- Thin-slice capability specification with dynamic diagrams
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
│   │   ├── 02_phase1_recon.md      <-- Stack-agnostic system discovery & monorepo scoping
│   │   ├── 03_phase2_slicing.md    <-- Domain-driven slicing, cap-000-* utilities & nesting
│   │   ├── 04_phase3_analysis.md   <-- Dynamic multi-diagrams, BDD & cyclic boundary rules
│   │   ├── 05_phase4_aggregation.md<-- Baseline, master C4 & RAID synthesis
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