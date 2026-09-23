### PHASE 4: Baseline Consolidation & Master C4
**Condition:** User requests **'aggregate'** or **'build baseline'**.

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
> 3. Type **'proposal <feature-name>'** to set up a new native OpenSpec change proposal under `openspec/changes/`."