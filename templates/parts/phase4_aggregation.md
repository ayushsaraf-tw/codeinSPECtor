### PHASE 4: Baseline Consolidation & Master C4
**Condition:** User requests **'aggregate'** or **'build baseline'**.

**Token & Context Optimization Rules:**
- **Frontmatter Index Traversal:** Traverse completed specs by parsing YAML frontmatter headers first; load markdown body sections strictly when compiling `BASELINE.md`.
- **Graph Node Bounding:** Limit Mermaid dependency graphs to primary capability nodes and `cap-000-*` shared infrastructure nodes; group sub-bounded contexts under parent subgraphs.

**Action:**
1. Traverse all `openspec/specs/cap-*` subdirectories and read completed spec frontmatter headers.
2. **Generate Master System C4 Diagram (`openspec/specs/SYSTEM_C4_DIAGRAM.md`):**
   - Synthesize component interactions across completed capabilities into a master system C4 Context/Container diagram.
3. **Generate Central Navigation Index (`openspec/specs/INDEX.md`):**
   - Output summary table mapping IDs, Semantic Names, Completion Status, Confidence Levels, per-capability spec links, and per-capability C4 diagram links.
   - Include direct link to `openspec/specs/SYSTEM_C4_DIAGRAM.md`.
4. **Generate Dependency Map (`openspec/specs/DEPENDENCY_MAP.md`):**
   - Aggregate shared data stores, direct service calls, async events, `cap-000-*` shared utility links, and `cyclic_dependencies` into a Mermaid call graph highlighting circular loops.
5. **Generate RAID Spec (`openspec/specs/RAID_LOG.md`):**
   - Aggregate Risks, Assumptions, Known Issues, Tech Debt, unmasked warnings, flagged `has_domain_leak: true` slices, and circular dependency loops.
6. **Compile Global Baseline (`openspec/specs/BASELINE.md`):**
   - **Global Domain Glossary:** Consolidated business terms.
   - **Consolidated Behavior Scenarios:** All Gherkin BDD scenarios grouped by capability.
   - **Global Failure & Error Matrix:** Merged table of status codes, exceptions, and trigger conditions.

**Human Prompt & Action Routing (STOP HERE):**
> 🎉 **OpenSpec Aggregation Complete!**
> Updated Master Artifacts under `openspec/specs/`:
> - `INDEX.md`, `SYSTEM_C4_DIAGRAM.md`, `BASELINE.md`, `DEPENDENCY_MAP.md`, `RAID_LOG.md`
>
> **Next Steps – Choose an Option:**
> 1. Type a remaining pending capability ID to continue reverse-engineering.
> 2. Type **'render <client | architect | developer | agent>'** to generate a customized stakeholder view.
> 3. Type **'proposal <feature-name>'** to set up a new native OpenSpec change proposal under `openspec/changes/`.