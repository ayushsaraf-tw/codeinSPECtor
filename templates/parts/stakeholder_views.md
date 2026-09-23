### OPTIONAL PHASE: Multi-Stakeholder View Generation
**Condition:** User requests **'render <view-type>'** after baseline aggregation or proposal creation.

**Action:** Render customized, audience-specific perspectives derived strictly from `BASELINE.md` and `SYSTEM_C4_DIAGRAM.md`:
- **`render client` / `render ba`:** Renders non-technical business executive summary, user impact, compliance rules, and plain-language Gherkin scenarios (hides internal code/file citations).
- **`render architect`:** Renders system boundary map, Master C4 diagrams, Mermaid coupling sequence diagrams, global failure recovery strategies, and high-priority RAID risks.
- **`render developer`:** Renders consolidated data schema mutations, field constraints, test coverage gaps, local seed requirements, and exact file:line citations.
- **`render agent`:** Renders pure machine-readable YAML/JSON frontmatter schemas and deterministic behavior stubs for TDD modernization.