---
name: build-baseline
description: Interactive 4-phase OpenSpec baseline engine with nested capability slicing, C4 architecture diagrams, multi-stakeholder views, confidence scoring, line citations, and zero-leakage privacy gates.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering engine for OpenSpec. Generates nested, semantically-named capability specifications with evidence-grounded confidence metrics, line-level code citations, per-capability and master C4 architecture diagrams, central navigation indices, dependency maps, RAID logs, and multi-stakeholder view renderings while enforcing pre-flight privacy guardrails.

---

## 🔒 STRICT PRIVACY, PII & SECRETS PRE-FLIGHT GUARDRAILS

To prevent accidental data exfiltration or sending sensitive enterprise code to external LLM servers:

### 1. In-Memory Local Sanitization & Masking
Before ANY source code, SQL script, or configuration file is processed or transmitted to an LLM prompt context, the agent MUST locally apply regex masking to sanitize the payload:
- **API Keys & Credentials:** Passwords, private keys, database URLs, JWT tokens, AWS keys $\rightarrow$ `<REDACTED_SECRET>`
- **Personal Identifiable Information (PII):**
    - NRIC/SSN numbers $\rightarrow$ `S****123A`
    - Real Email addresses $\rightarrow$ `user@example.com`
    - Real Phone numbers $\rightarrow$ `+XX-XXXX-XXXX`
    - Real Names/Addresses $\rightarrow$ Synthetic Mock Placeholders

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

### PHASE 1: System Reconnaissance
**Condition:** `openspec/specs/SYSTEM_MAP.md` DOES NOT EXIST.

**Action:**
1. Scan repository structure, build scripts (`pom.xml`, `package.json`, etc.), and DB migrations.
2. Identify entry points (controllers, API routes, background workers, event consumers).
3. Output the map to `openspec/specs/SYSTEM_MAP.md`.

**Output Schema (`openspec/specs/SYSTEM_MAP.md`):**
```markdown
---
type: system_map
version: 1.0.0
entry_points_count: <number>
---

# System Map

## Components & Modules
- **Controllers:** `<file-list>`
- **Database Migrations:** `<file-list>`

## Discovered Entry Points
- `<method> <path>` -> `<Class.method>` (`file:lines`)
  ```

**Human Prompt (STOP HERE):**
> "Phase 1 Complete: System Map written to `openspec/specs/SYSTEM_MAP.md`. Review entry points and type **'yes'** to proceed to Phase 2."

---

### PHASE 2: Capability Tree & Semantic Nesting
**Condition:** `SYSTEM_MAP.md` EXISTS, but `openspec/specs/CAPABILITIES_TREE.md` DOES NOT EXIST.

**Action:**
1. Read `SYSTEM_MAP.md`.
2. Group entry points into logical business capabilities using semantic names: `cap-XXX-<short-business-slug>` (e.g., `cap-001-user-auth`).
3. **Nested Slicing Rule:** If a capability touches >4 source files, split it into child sub-slices nested under the parent domain folder:
    - **Parent Overview Spec:** `openspec/specs/cap-001-user-auth/spec.md` (Domain purpose, overarching entry points router, and child sub-slice index)
    - **Child Sub-Slice 1:** `openspec/specs/cap-001-user-auth/cap-001a-jwt-validation/spec.md`
    - **Child Sub-Slice 2:** `openspec/specs/cap-001-user-auth/cap-001b-session-store/spec.md`
4. If a capability touches $\le$ 4 files, create a single spec at `openspec/specs/cap-XXX-<slug>/spec.md`.
5. Write the initial capability index to `openspec/specs/CAPABILITIES_TREE.md`.

**Human Prompt (STOP HERE):**
> "Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`. Which capability ID would you like to analyze first?"

---

### PHASE 3: Thin-Slice Capability Analysis (With Confidence, Citations & C4 Diagramming)
**Condition:** User selects a capability ID from `CAPABILITIES_TREE.md`.

**Action:**
1. **State Guard:** Check selected capability status in `CAPABILITIES_TREE.md`.
    - **IF ALREADY COMPLETED:** HALT EXECUTION AND ASK:
      > 🛑 **STATE GUARD:** Capability `<id>` is currently marked as **Completed**.
      > Do you want to **re-analyze** and overwrite it, or **skip** and choose another capability?
2. **Execute Pre-Flight Privacy Gate:** Display target files and sanitized diff preview. Wait for explicit user confirmation.
3. Upon confirmation, read target source files (max 4 per pass) and generate target `spec.md`.
4. Include full metadata, evidence confidence metrics, and required spec sections:

**Required Formatting Rules:**
- Ensure all Markdown tables have NO blank lines between header, divider, and data rows (`|---|---|---||`).
- Embed a **Mermaid C4 Component/Container Diagram** in Section 3 showing component boundaries for this capability.

**Spec Output Template:**
```markdown
---
type: capability_specification
capability_id: cap-001-user-auth
capability_name: User Authentication & JWT Validation
version: 1.0.0                       # Semantic versioning of this capability spec
status: completed                    # [completed | pending_approval]
confidence_level: confirmed          # [confirmed | needs_confirmation | unverified]
confidence_score: 95%                # [0-100%]
unverified_assumptions: []           # Explain any assumptions that are not yet verified
stability: stable                    # [stable | deprecated | flaky]
created_at: 2026-09-21               # created date in YYYY-MM-DD
created_by: codeinSPECtor
linked_capabilities: [cap-002-user-profile]    # List of related capabilities that this capability depends on or interacts with
linked_issues: []                    # List of known issues or tickets related to this capability
---

# Capability: User Authentication & JWT Validation

## 1. Domain Purpose & Business Intent
<High-level business goal of this capability>

## 2. Technical Entry Points & Security Gates
- **Route:** `POST /api/v1/auth/login`
- **Handler:** `AuthController.java:45-60`
- **Security Interceptor:** `JwtAuthenticationFilter.java:30-80`

## 3. C4 Component Architecture Diagram

```mermaid
C4Component
title Component Diagram for CAP-001: User Authentication
Container(api, "API Gateway / Router", "HTTPS", "Routes external requests")
Component(authController, "AuthController", "Spring MVC Controller", "Handles login & auth requests")
Component(jwtFilter, "JwtAuthenticationFilter", "Filter", "Validates JWT tokens")
Component(userRepo, "SessionRepository", "JPA Repository", "Manages user session mutations")
ContainerDb(db, "Database", "PostgreSQL", "Stores user_sessions table")

    Rel(api, authController, "Forwards POST /api/v1/auth/login")
    Rel(authController, jwtFilter, "Authenticates request")
    Rel(authController, userRepo, "Persists session state")
    Rel(userRepo, db, "Writes to user_sessions")
mermaid diagram ends```

## 4. Database Schema & State Mutations

| Entity / Table | Mutation Type | Key Fields Mutated | Source Code Citation |
|---|---|---|---|
| `user_sessions` | INSERT | `session_token`, `expires_at` | `SessionRepository.java:112` |

## 5. Behavior Scenarios (Gherkin BDD)
#### Scenario: Valid Credentials Submission
- **Given** a registered user with valid email and password (`UserDetailsService.java:34`)
- **When** `POST /api/v1/auth/login` is called
- **Then** return HTTP 200 with JWT Bearer Token (`AuthController.java:55`)
- **Evidence Citation:** `AuthController.java:45-60`, `JwtTokenProvider.java:88-105`

## 6. Failure & Error Matrix

| Error Condition | Trigger Rule | HTTP / Exception Code | Evidence Citation |
|---|---|---|---|
| Expired JWT Token | `claims.getExpiration().before(now)` | HTTP 401 Unauthorized | `JwtAuthenticationFilter.java:94` |
```

5. Update status in `openspec/specs/CAPABILITIES_TREE.md` to `Completed` (or `Pending approval` if confidence is low).

**Human Prompt (STOP HERE):**
> "Phase 3 Complete: Written spec to target directory. Type another capability ID to analyze next, or type **'aggregate'** to run Phase 4."

### PHASE 4: Baseline Consolidation, Master C4 & Multi-View Rendering
**Condition:** User requests **'aggregate'** or **'build baseline'**.

**Action:**
1. Traverse all `openspec/specs/` subdirectories and read completed specs.
2. **Generate Master System C4 Diagram:**
    - Synthesize all component interactions across completed capabilities into a master system-wide C4 Container/Context diagram written to `openspec/specs/SYSTEM_C4_DIAGRAM.md`.
3. **Generate Central Navigation Index (`openspec/specs/INDEX.md`):**
    - Output summary table mapping IDs, Semantic Names, Completion Status, Confidence Levels, per-capability spec links, and per-capability C4 diagram links.
    - Include direct link to `openspec/specs/SYSTEM_C4_DIAGRAM.md`.
4. **Generate Dependency Map (`openspec/specs/DEPENDENCY_MAP.md`):**
    - Aggregate shared DB tables, direct RPC/service calls, and async events between capabilities into a Mermaid call graph.
5. **Generate RAID Spec (`openspec/specs/RAID_LOG.md`):**
    - Aggregate all Risks, Assumptions, Known Issues, Technical Debt, and any unmasked legacy code warnings.
6. **Compile Global Baseline (`openspec/specs/BASELINE.md`):**
    - **Global Domain Glossary:** Consolidated business terms across all capabilities.
    - **Consolidated Behavior Scenarios:** All Gherkin BDD scenarios grouped by capability.
    - **Global Failure & Error Matrix:** Merged table of all HTTP/Exception codes and trigger conditions.

**Human Prompt & Action Routing (STOP HERE):**
> "🎉 OpenSpec Aggregation Complete!
> Updated Master Artifacts:
> - `openspec/specs/INDEX.md` (Master navigation index, confidence status & C4 links)
> - `openspec/specs/SYSTEM_C4_DIAGRAM.md` (Master architecture C4 diagram)
> - `openspec/specs/BASELINE.md` (Merged system baseline, global glossary & error matrix)
> - `openspec/specs/DEPENDENCY_MAP.md` (Cross-capability coupling graph)
> - `openspec/specs/RAID_LOG.md` (Aggregated risks, assumptions & tech debt)
>
> **Next Steps - Choose an Option:**
> 1. Type a remaining pending capability ID to continue reverse-engineering.
> 2. Type **'render <client | architect | developer | agent>'** to generate a customized stakeholder view.
> 3. Type **'proposal <feature-name>'** to set up a new change proposal template under `openspec/changes/`."

---

### OPTIONAL PHASE: Multi-Stakeholder View Generation
**Condition:** User requests **'render <view-type>'** after baseline aggregation.

**Action:** Render customized, audience-specific perspectives derived strictly from `BASELINE.md` and `SYSTEM_C4_DIAGRAM.md`:
- **`render client` / `render ba`:** Renders non-technical business executive summary, user impact, compliance rules, and plain-language Gherkin scenarios (hides internal Java/DB class citations).
- **`render architect`:** Renders system boundary map, Master C4 diagrams, Mermaid coupling sequence diagrams, global failure recovery strategies, and high-priority RAID risks.
- **`render developer`:** Renders consolidated DB schema mutations, field constraints, test coverage gaps, local seed requirements, and exact file:line citations.
- **`render agent`:** Renders pure machine-readable YAML/JSON frontmatter schemas and deterministic behavior stubs for TDD modernization.