---
name: build-baseline
description: Interactive 4-phase OpenSpec baseline reverse-engineering engine with zero-leakage PII/Secrets privacy gates and capability indexing.
command: /opsx:build-baseline
---

# OpenSpec Custom Skill: /opsx:build-baseline

## Description
Stateful, human-in-the-loop reverse engineering skill for OpenSpec. Generates folder-based capability specifications, central indices, dependency graphs, and RAID logs while enforcing pre-flight privacy guardrails to prevent sending PII or secrets to external LLM servers.

---

## 🔒 STRICT PRIVACY, PII & SECRETS PRE-FLIGHT GUARDRAILS

To prevent accidental data exfiltration or sending sensitive enterprise code to external servers (e.g., Anthropic, OpenAI, GitHub Copilot servers):

### 1. In-Memory Local Sanitization & Masking
Before ANY source code, SQL script, or configuration file is processed or transmitted to an LLM prompt context, the agent MUST locally apply regex masking to sanitize the payload:
- **API Keys & Credentials:** Passwords, private keys, database URLs, JWT tokens, AWS keys $\rightarrow$ \`<REDACTED_SECRET>\`
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

**Human Prompt (STOP HERE):**
> "Phase 1 Complete: System Map written to `openspec/specs/SYSTEM_MAP.md`. Review entry points and type **'yes'** to proceed to Phase 2."

---

### PHASE 2: Capability Tree Setup & Folder Structuring
**Condition:** `SYSTEM_MAP.md` EXISTS, but `openspec/specs/CAPABILITIES_TREE.md` DOES NOT EXIST.

**Action:**
1. Read `SYSTEM_MAP.md`.
2. Group entry points into logical business capabilities (`CAP-001`, `CAP-002`, etc.).
3. Assign target spec folder paths as `openspec/specs/cap-XXX/spec.md`.
4. **File Threshold Guardrail:** Mark any capability touching >4 source files to be decomposed into thin child slices (`CAP-001a`, `CAP-001b`).
5. Output index to `openspec/specs/CAPABILITIES_TREE.md`.

**Human Prompt (STOP HERE):**
> "Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`. Which capability ID would you like to analyze first?"

---

### PHASE 3: Thin-Slice Capability Analysis (With Privacy Gate)
**Condition:** User selects a capability ID from `CAPABILITIES_TREE.md`.

**Action:**
1. **Pre-Flight Check:** Identify target source files for this capability (max 4 files).
2. **Sanitize Payload:** Apply PII/Secrets masking to file contents locally.
3. **Execute Pre-Flight Pause:** Display file list and request explicit user confirmation to proceed.
4. Upon user confirmation:
   - Create folder `openspec/specs/<cap-id>/` and generate `openspec/specs/<cap-id>/spec.md`.
   - Add frontmatter header:
```markdown
---
type: capability_specification
capability_id: <CAP-ID>
capability_name: <Capability Name>
version: 1.0.0
status: completed
created_at: 2026-09-11
created_by: codeinSPECtor
stability: stable
linked_capabilities: []
linked_issues: []
last_reviewed: 2026-09-11
---
```
- Include Domain Purpose, Entry Points, DB Mutations, Gherkin Scenarios, and Failure Matrices with file/line evidence citations.
5. Update \`CAPABILITIES_TREE.md\` status to \`Completed\`.

**Human Prompt (STOP HERE):**
> "Phase 3 Complete: Generated \`openspec/specs/<cap-id>/spec.md\`. Type another capability ID or type **'aggregate'** to run Phase 4."

---

### PHASE 4: Baseline, Index & RAID Consolidation
**Condition:** User requests **'aggregate'** or **'build baseline'**.

**Action:**
1. Read all completed \`openspec/specs/cap-XXX/spec.md\` files.
2. Write/Update central navigation index at \`openspec/specs/INDEX.md\`.
3. Write/Update master baseline specification at \`openspec/specs/BASELINE.md\`.
4. Write/Update cross-capability coupling graph at \`openspec/specs/DEPENDENCY_MAP.md\`.
5. Write/Update risks, tech debt, and unmasked legacy code warnings at \`openspec/specs/RAID_LOG.md\`.

**Human Prompt:**
> 🎉 OpenSpec Aggregation Complete!
> Updated Artifacts:
> - \`openspec/specs/INDEX.md\`
> - \`openspec/specs/BASELINE.md\`
> - \`openspec/specs/DEPENDENCY_MAP.md\`
> - \`openspec/specs/RAID_LOG.md\`"