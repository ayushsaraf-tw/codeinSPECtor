## EXECUTION WORKFLOW & STATE MACHINE

Inspect `openspec/specs/INDEX.md` and project state. Execute ONLY the requested routing path.

---

### ⚡ FAST-PATH: Standalone Change Proposal (`proposal <feature-name>`)
**Condition:** User command starts with `proposal <feature-name>` (e.g., `proposal add-mfa`).

**Rule:** THIS IS A TERMINAL PATH. Once executed, HALT ALL PROCESSES. DO NOT proceed to Phase 1, 2, 3, or 4.

**Action (BYPASSES PHASES 1–4 DIRECTLY):**
1. **Normalize Name:** Convert `<feature-name>` to lowercase kebab-case (`openspec/changes/<kebab-name>/`).
2. **Load Baseline Context:** Read `openspec/specs/INDEX.md` (if it exists) to fetch existing capability IDs. If no baseline exists, proceed with an empty baseline reference.
3. **Autonomously Scaffold & Draft Files:**
    - `openspec/changes/<kebab-name>/proposal.md` $\rightarrow$ Auto-draft executive summary, scope, and check off impacted baseline capabilities.
    - `openspec/changes/<kebab-name>/design.md` $\rightarrow$ Auto-draft architectural delta and target schema/API mutations.
    - `openspec/changes/<kebab-name>/tasks.md` $\rightarrow$ Generate step-by-step developer checklist ending in `/opsx:apply`.
    - `openspec/changes/<kebab-name>/specs/<affected-cap>/spec.md` $\rightarrow$ Generate target delta capability spec stubs with proposed BDD scenarios.

**Human Prompt (TERMINAL STOP - HALT HERE):**
> "🎉 OpenSpec Change Proposal Initialized & Auto-Drafted!
> Created proposal under `openspec/changes/<kebab-name>/` linked to existing baseline capabilities.
>
> **Next Steps:**
> 1. Type **'review'** to inspect the auto-drafted `proposal.md` and `design.md`.
> 2. Type **'render <client | architect | developer | agent>'** to view stakeholder perspectives.
> 3. State any specific business rules or requirements to adjust the proposal."