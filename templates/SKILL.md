---
name: build-baseline
description: Interactive 4-phase OpenSpec baseline engine with adaptive ecosystem detection, nested capability slicing, C4 architecture diagrams, multi-stakeholder views, confidence scoring, line citations, zero-leakage privacy gates and automated change proposals.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering engine for OpenSpec. Performs broad, framework-agnostic system reconnaissance, locks in the detected stack, and generates nested capability specifications with evidence-grounded confidence metrics, line-level code citations, C4 architecture diagrams, central navigation indices, dependency maps, RAID logs, multi-stakeholder view renderings, and native OpenSpec change proposals while enforcing pre-flight privacy guardrails.

---

## 🔒 STRICT PRIVACY, PII & SECRETS PRE-FLIGHT GUARDRAILS

To prevent accidental data exfiltration or sending sensitive enterprise code to external LLM servers:

### 1. In-Memory Local Sanitization & Masking
Before ANY source code, SQL script, schema file, or configuration file is processed or transmitted to an LLM prompt context, the agent MUST locally apply regex masking to sanitize the payload:
- **API Keys & Credentials:** Passwords, private keys, database connection strings, tokens, secrets $\rightarrow$ `<REDACTED_SECRET>`
- **Personal Identifiable Information (PII):**
   - National Identification / SSN / NRIC numbers $\rightarrow$ `S****123A`
   - Real Email addresses $\rightarrow$ `user@example.com`
   - Real Phone numbers $\rightarrow$ `+XX-XXXX-XXXX`
   - Real Names / Physical Addresses $\rightarrow$ Synthetic Mock Placeholders

### 2. Pre-Flight Pause & User Confirmation Gate
Before making any API call or transmitting context to an external LLM server for Phase 3 (Capability Slicing):
1. **List Files to be Sent:** Display the exact list of source files selected for analysis.
2. **Show Sanitized Preview:** Show a brief diff/snippet proving secrets and PII have been masked.
3. **HALT EXECUTION & ASK:**
   > ⚠️ **PRIVACY PRE-FLIGHT CHECK:**
   > I am about to send sanitized snippets of the following files to the LLM server:
   > - `<file_1>`
   > - `<file_2>`
   >
   > All credentials, keys, and PII have been masked locally.
   > Type **'yes'** or **'confirm'** to proceed, or type **'cancel'** to abort the request.

---

## EXECUTION WORKFLOW & STATE MACHINE

Inspect `openspec/specs/CAPABILITIES_TREE.md` to identify project state. Execute ONLY ONE PHASE at a time and **STOP TO ASK FOR HUMAN CONFIRMATION**.

---

### PHASE 1: Broad System Reconnaissance (Fully Agnostic)
**Condition:** `openspec/specs/SYSTEM_MAP.md` DOES NOT EXIST.

**Rule:** DO NOT assume any language, framework, or file extension upfront.

**Action:**
1. **Discover Ecosystem:** Inspect root directory for build definitions, manifests, and container configs (`package.json`, `pom.xml`, `build.gradle`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `Makefile`, `Dockerfile`, `docker-compose.yml`, etc.).
2. **Discover Persistence Layer:** Locate migration directories, ORM schemas, SQL scripts, protobufs, or OpenAPI specifications regardless of folder structure.
3. **Discover Entry Points:** Identify all entry mechanisms (HTTP handlers, RPC methods, event listeners, CLI interfaces, background jobs) purely from structural wiring.
4. Output the discovered map to `openspec/specs/SYSTEM_MAP.md` and record the **`.detected_ecosystem`**.

**Output Schema (`openspec/specs/SYSTEM_MAP.md`):**
```markdown
---
type: system_map
version: 1.0.0
detected_ecosystem: "<e.g., Go/Gin + PostgreSQL | Java/Spring + MySQL | Node/TypeScript + Mongo | Multi-Language>"
primary_languages: ["<lang_1>", "<lang_2>"]
entry_points_count: <number>
---

# System Map

## Discovered Modules & Infrastructure
- **Manifests & Configs:** `<file-list>`
- **Schemas / Migrations:** `<file-list>`
- **Primary Source Paths:** `<directory-list>`

## Discovered Entry Points
- `<protocol/type> <path/event/command>` -> `<Handler/Function>` (`file:lines`)
  ```

**Human Prompt (STOP HERE):**
> "Phase 1 Complete: System Map written to `openspec/specs/SYSTEM_MAP.md`.
> Identified Ecosystem: **<detected_ecosystem>**
> Review entry points and type **'yes'** to proceed to Phase 2."

---

### PHASE 2: Capability Tree & Semantic Nesting (Adaptive)
**Condition:** `SYSTEM_MAP.md` EXISTS, but `openspec/specs/CAPABILITIES_TREE.md` DOES NOT EXIST.

**Action:**
1. Read `SYSTEM_MAP.md` and adopt specific conventions of the **`detected_ecosystem`**.
2. Group discovered entry points into business capabilities using semantic IDs: `cap-XXX-<short-business-slug>` (e.g., `cap-001-user-auth`).
3. **Nested Slicing Rule:** If a capability touches >4 source files, split it into child sub-slices nested under the parent domain folder:
   - **Parent Overview Spec:** `openspec/specs/cap-001-user-auth/spec.md` (Domain purpose, entry points router, and sub-slice directory index)
   - **Child Sub-Slice 1:** `openspec/specs/cap-001-user-auth/cap-001a-token-validation/spec.md`
   - **Child Sub-Slice 2:** `openspec/specs/cap-001-user-auth/cap-001b-session-persistence/spec.md`
4. If a capability touches $\le$ 4 files, create a single spec at `openspec/specs/cap-XXX-<slug>/spec.md`.
5. Write initial index to `openspec/specs/CAPABILITIES_TREE.md`.

**Human Prompt (STOP HERE):**
> "Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`. Which capability ID would you like to analyze first?"

---

### PHASE 3: Thin-Slice Analysis (Stack-Tailored Analysis & C4 Diagrams)
**Condition:** User selects a capability ID from `CAPABILITIES_TREE.md`.

**Action:**
1. **State Guard:** Check selected capability status in `CAPABILITIES_TREE.md`.
   - **IF ALREADY COMPLETED:** HALT EXECUTION AND ASK:
     > 🛑 **STATE GUARD:** Capability `<id>` is currently marked as **Completed**.
     > Do you want to **re-analyze** and overwrite it, or **skip** and choose another capability?
2. **Execute Pre-Flight Privacy Gate:** Display target files and sanitized diff preview. Wait for explicit user confirmation.
3. Upon confirmation, read target source files (max 4 per pass) using framework-appropriate patterns derived from `SYSTEM_MAP.md`.
4. Generate target `spec.md` using exact code line citations and embedded Mermaid C4 diagrams:

**Required Formatting Rules:**
- Ensure all Markdown tables have NO blank lines between header, divider, and data rows (`|---|---|---||`).
- Embed a **Mermaid C4 Component Diagram** tailored to the detected stack architecture.

**Spec Output Template:**
```markdown
---
type: capability_specification
capability_id: cap-001-user-auth
capability_name: User Authentication & Token Validation
version: 1.0.0
status: completed                    # [completed | pending_approval]
confidence_level: confirmed          # [confirmed | needs_confirmation | unverified]
confidence_score: 95%
unverified_assumptions: []
stability: stable                    # [stable | deprecated | flaky]
created_at: 2026-09-21
created_by: codeinSPECtor
linked_capabilities: [cap-002-user-profile]
linked_issues: []
---

# Capability: User Authentication & Token Validation

## 1. Domain Purpose & Business Intent
<High-level business capability summary>

## 2. Technical Entry Points & Security Gates
- **Interface / Route:** `POST /api/v1/auth/login`
- **Handler / Function:** `<file_path:lines>`
- **Middleware / Interceptor:** `<file_path:lines>`

## 3. C4 Component Architecture Diagram
```mermaid
C4Component
title Component Diagram for CAP-001: User Authentication
Container(client, "Inbound Client", "HTTP/RPC/Event", "External trigger source")
Component(entryPoint, "Entry Router / Handler", "Inbound Adapter", "Receives request")
Component(authService, "Domain Logic Engine", "Core Business Logic", "Validates rules")
Component(dataAdapter, "Data Access Layer", "Persistence Adapter", "Mutates database state")
ContainerDb(db, "Data Store", "Database / Storage", "Persists session state")

    Rel(client, entryPoint, "Triggers request")
    Rel(entryPoint, authService, "Delegates logic")
    Rel(authService, dataAdapter, "Requests state mutation")
    Rel(dataAdapter, db, "Reads/Writes state")
mermaid diagram ends here```

## 4. Database Schema & State Mutations

| Entity / Table / Store | Mutation Type | Key Fields Mutated | Source Code Citation |
|---|---|---|---|
| `user_sessions` | INSERT | `session_token`, `expires_at` | `<file_path:lines>` |

## 5. Behavior Scenarios (Gherkin BDD)
#### Scenario: Valid Credentials Submission
- **Given** a registered user with valid credentials (`<file_path:lines>`)
- **When** the login endpoint or function is executed
- **Then** return authorization token with successful status (`<file_path:lines>`)
- **Evidence Citation:** `<file_path:lines>`

## 6. Failure & Error Matrix

| Error Condition | Trigger Rule | Error / Status Code | Evidence Citation |
|---|---|---|---|
| Expired Token / Session | Timestamp exceeds lifetime threshold | 401 Unauthorized / AuthException | `<file_path:lines>` |
```

5. Update status in `openspec/specs/CAPABILITIES_TREE.md` to `Completed` (or `Pending approval` if confidence is low).

**Human Prompt (STOP HERE):**
> "Phase 3 Complete: Written spec to target directory. Type another capability ID to analyze next, or type **'aggregate'** to run Phase 4."

---

### PHASE 4: Baseline Consolidation, Master C4 & Native Change Proposals
**Condition:** User requests **'aggregate'**, **'build baseline'**, or **'proposal <feature-name>'**.

#### Option A: Baseline Aggregation & Master Artifacts
1. Traverse all `openspec/specs/` subdirectories and read completed specs.
2. **Generate Master System C4 Diagram:**
   - Synthesize component interactions across completed capabilities into a master system C4 Context/Container diagram saved at `openspec/specs/SYSTEM_C4_DIAGRAM.md`.
3. **Generate Central Navigation Index (`openspec/specs/INDEX.md`):**
   - Output summary table mapping IDs, Semantic Names, Completion Status, Confidence Levels, per-capability spec links, and per-capability C4 diagram links.
   - Include direct link to `openspec/specs/SYSTEM_C4_DIAGRAM.md`.
4. **Generate Dependency Map (`openspec/specs/DEPENDENCY_MAP.md`):**
   - Aggregate shared data stores, direct service calls, and async events between capabilities into a Mermaid call graph.
5. **Generate RAID Spec (`openspec/specs/RAID_LOG.md`):**
   - Aggregate all Risks, Assumptions, Known Issues, Technical Debt, and any unmasked legacy code warnings.
6. **Compile Global Baseline (`openspec/specs/BASELINE.md`):**
   - **Global Domain Glossary:** Consolidated business terms across all capabilities.
   - **Consolidated Behavior Scenarios:** All Gherkin BDD scenarios grouped by capability.
   - **Global Failure & Error Matrix:** Merged table of all status codes, exceptions, and trigger conditions.

#### Option B: Native Change Proposal Generation (`proposal <feature-name>`)
When user executes `proposal <feature-name>`, the agent MUST:
1. Normalize `<feature-name>` to lowercase kebab-case (e.g., `user-mfa-support`).
2. Create standard OpenSpec change directory structure:
    - `openspec/changes/<kebab-name>/proposal.md`
    - `openspec/changes/<kebab-name>/design.md`
    - `openspec/changes/<kebab-name>/tasks.md`
    - `openspec/changes/<kebab-name>/specs/` (Directory for target capability spec deltas)
3. Auto-populate templates using context from `openspec/specs/INDEX.md` and `SYSTEM_MAP.md`.

**Human Prompt & Action Routing (STOP HERE):**
> "🎉 OpenSpec Execution Complete!
> Updated Master Artifacts / Proposals:
> - `openspec/specs/INDEX.md` (Master navigation index, confidence status & C4 links)
> - `openspec/specs/SYSTEM_C4_DIAGRAM.md` (Master architecture C4 diagram)
> - `openspec/specs/BASELINE.md` (Merged system baseline, global glossary & error matrix)
> - `openspec/specs/DEPENDENCY_MAP.md` (Cross-capability coupling graph)
> - `openspec/specs/RAID_LOG.md` (Aggregated risks, assumptions & tech debt)
>
> **Next Steps - Choose an Option:**
> 1. Type a remaining pending capability ID to continue reverse-engineering.
> 2. Type **'render <client | architect | developer | agent>'** to generate a customized stakeholder view.
> 3. Type **'proposal <feature-name>'** to set up a new native OpenSpec change proposal under `openspec/changes/`."

---

### OPTIONAL PHASE: Multi-Stakeholder View Generation
**Condition:** User requests **'render <view-type>'** after baseline aggregation.

**Action:** Render customized, audience-specific perspectives derived strictly from `BASELINE.md` and `SYSTEM_C4_DIAGRAM.md`:
- **`render client` / `render ba`:** Renders non-technical business executive summary, user impact, compliance rules, and plain-language Gherkin scenarios (hides internal code/file citations).
- **`render architect`:** Renders system boundary map, Master C4 diagrams, Mermaid coupling sequence diagrams, global failure recovery strategies, and high-priority RAID risks.
- **`render developer`:** Renders consolidated data schema mutations, field constraints, test coverage gaps, local seed requirements, and exact file:line citations.
- **`render agent`:** Renders pure machine-readable YAML/JSON frontmatter schemas and deterministic behavior stubs for TDD modernization.