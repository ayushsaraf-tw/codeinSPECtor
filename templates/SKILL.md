---
name: build-baseline
description: Interactive 4-phase OpenSpec baseline engine with nested capability slicing, evidence-grounded confidence scoring, line citations, and zero-leakage privacy gates.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering skill for OpenSpec. Generates nested, semantically-named capability specifications with evidence-grounded confidence metrics, line-level code citations, central navigation indices, dependency maps, and RAID logs while enforcing pre-flight privacy guardrails.

---

## 🔒 STRICT PRIVACY, PII & SECRETS PRE-FLIGHT GUARDRAILS

To prevent accidental data exfiltration or sending sensitive enterprise code to external servers (e.g., Anthropic, OpenAI, GitHub Copilot servers):

### 1. In-Memory Local Sanitization & Masking
Before ANY source code, SQL script, or configuration file is processed or transmitted to an LLM prompt context, the agent MUST locally apply regex masking to sanitize the payload:
- **API Keys & Credentials:** Passwords, private keys, database URLs, JWT tokens, AWS keys $\rightarrow$ `<REDACTED_SECRET>`
- **Personal Identifiable Information (PII):**
   - NRIC/SSN numbers $\rightarrow$ `S****123A`
   - Real Email addresses $\rightarrow$ `user@example.com`
   - Real Phone numbers $\rightarrow$ `+XX-XXXX-XXXX`
   - Real Names/Addresses $\Rightarrow$ Synthetic Mock Placeholders

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
   - **Parent Overview Spec:** `openspec/specs/cap-001-user-auth/spec.md` (Domain summary, entry points router, and sub-slice directory)
   - **Child Sub-Slice 1:** `openspec/specs/cap-001-user-auth/cap-001a-jwt-validation/spec.md`
   - **Child Sub-Slice 2:** `openspec/specs/cap-001-user-auth/cap-001b-session-store/spec.md`
4. If a capability touches $\le$ 4 files, create a single spec at `openspec/specs/cap-XXX-<slug>/spec.md`.
5. Write the initial capability index to `openspec/specs/CAPABILITIES_TREE.md`.

**Human Prompt (STOP HERE):**
> "Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`. Which capability ID would you like to analyze first?"

---

### PHASE 3: Thin-Slice Capability Analysis (With Confidence & Line Citations)
**Condition:** User selects a capability ID from `CAPABILITIES_TREE.md`.

**Action:**
1. **State Guard:** Check selected capability status in `CAPABILITIES_TREE.md`. If marked `Completed`, STOP AND ASK: *"Capability `<id>` is already completed. Do you want to **re-analyze** and overwrite it, or **skip**?"*
2. **Execute Pre-Flight Privacy Gate:** Display target files and sanitized diff preview. Wait for explicit user confirmation.
3. Upon confirmation, read target source files (max 4 per pass) and generate target `spec.md`.
4. Include full metadata, evidence confidence metrics, and required spec sections:

```markdown
---
type: capability_specification
capability_id: cap-001-user-auth
capability_name: User Authentication & JWT Validation
version: 1.0.0
status: completed
confidence_level: confirmed          # [confirmed | needs_confirmation | unverified]
confidence_score: 95%
unverified_assumptions: []
stability: stable                    # [stable | deprecated | flaky]
created_at: 2026-09-21
created_by: codeinSPECtor
linked_capabilities: [cap-002-user-profile]
linked_issues: []
---

# Capability: User Authentication & JWT Validation

## 1. Domain Purpose & Business Intent
<High-level summary of business capability>

## 2. Technical Entry Points & Security Gates
- **Route:** `POST /api/v1/auth/login`
- **Handler:** `AuthController.java:45-60`
- **Security Interceptor:** `JwtAuthenticationFilter.java:30-80`

## 3. Database Schema & State Mutations
| Entity / Table | Mutation Type (Insert/Update/Delete) | Key Fields Mutated | Source Code Citation |
| :--- | :--- | :--- | :--- |
| `user_sessions` | INSERT | `session_token`, `expires_at` | `SessionRepository.java:112` |

## 4. Behavior Scenarios (Gherkin BDD)
#### Scenario: Valid Credentials Submission
- **Given** a registered user with valid email and password (`UserDetailsService.java:34`)
- **When** `POST /api/v1/auth/login` is called
- **Then** return HTTP 200 with JWT Bearer Token (`AuthController.java:55`)
- **Evidence Citation:** `AuthController.java:45-60`, `JwtTokenProvider.java:88-105`

## 5. Failure & Error Matrix
| Error Condition | Trigger Rule | HTTP / Exception Code | Evidence Citation |
| :--- | :--- | :--- | :--- |
| Expired JWT Token | `claims.getExpiration().before(now)` | HTTP 401 Unauthorized | `JwtAuthenticationFilter.java:94` |
```

5. Update status in `openspec/specs/CAPABILITIES_TREE.md` to `Completed` or `Pending approval` (if confidence is low).

**Human Prompt (STOP HERE):**
> "Phase 3 Complete: Written spec to target directory. Type another capability ID to analyze next, or type **'aggregate'** to run Phase 4."

---

### PHASE 4: Baseline, Index & RAID Consolidation
**Condition:** User requests **'aggregate'** or **'build baseline'**.

**Action:**
1. Traverse all `openspec/specs/` subdirectories and read completed specs.
2. **Generate Central Navigation Index (`openspec/specs/INDEX.md`):**
   - Output summary table with IDs, Semantic Names, Status, Confidence Levels, and relative file links (`cap-001-user-auth/spec.md`).
3. **Generate Dependency Map (`openspec/specs/DEPENDENCY_MAP.md`):**
   - Aggregate shared DB tables, synchronous service calls, and asynchronous events between capabilities into a Mermaid call graph.
4. **Generate RAID Spec (`openspec/specs/RAID_LOG.md`):**
   - Aggregate all Risks, Assumptions, Issues, Technical Debt, and any legacy unmasked code warnings cataloged in thin-slice specs.
5. **Compile/Update Baseline (`openspec/specs/BASELINE.md`):**
   - Consolidate all Glossaries, Gherkin Scenarios, and Failure Matrices across completed capabilities.
6. **Generate C4 diagrams using the above generated files** for each capability and link them in the index.
7. **Generate a master C4 diagram using the above generated files** that represents the whole architecture.

**Human Prompt:**
> "🎉 OpenSpec Aggregation Complete!
> Updated Master Artifacts:
> - `openspec/specs/INDEX.md` (Master navigation index & confidence status)
> - `openspec/specs/BASELINE.md` (Merged system baseline)
> - `openspec/specs/DEPENDENCY_MAP.md` (Cross-capability coupling graph)
> - `openspec/specs/RAID_LOG.md` (Aggregated risks, assumptions & tech debt)"