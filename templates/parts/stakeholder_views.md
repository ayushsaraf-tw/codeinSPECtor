### OPTIONAL PHASE: Multi-Stakeholder View Generation
**Condition:** User requests **'render <view-type>'** after baseline aggregation or proposal creation.

**Action:** Render customized, audience-specific perspectives derived strictly from `BASELINE.md`, `CONVENTIONS.md`, and `SYSTEM_C4_DIAGRAM.md`:
- **`render client` / `render ba`:** Renders non-technical business executive summary, user impact, compliance rules, domain glossary, and plain-language Gherkin scenarios (hides internal code/file citations).
- **`render architect`:** Renders system boundary map, Master C4 diagrams, Mermaid coupling sequence diagrams, cyclic dependency loops, flagged domain leaks (`has_domain_leak: true`), shared `cap-000-*` utility topology, global failure recovery strategies, and high-priority RAID risks.
- **`render developer`:** Renders consolidated data schema mutations, ER diagrams, field constraints, test coverage gaps, local seed requirements, TDD commit sequencing, dual-state feature toggle testing targets (ON/OFF paths), and exact `file:lines` citations.
- **`render agent`:** Renders pure machine-readable YAML/JSON frontmatter schemas, deterministic BDD scenarios, and fitness function stubs (e.g., ArchUnit rules) for TDD modernization and automated prompt execution.