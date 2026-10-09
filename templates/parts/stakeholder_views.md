### OPTIONAL PHASE: Multi-Stakeholder View Generation
**Condition:** User requests **'render <view-type>'** (`client`, `architect`, `developer`, `agent`).

**ZERO-INTERROGATION RULE:**
When invoked, DO NOT ask clarifying questions, request confirmation, or display meta-options. Parse consolidated baseline artifacts immediately and render the requested view directly in your response.

**Condition:** User requests **'render <view-type>'** after baseline aggregation or proposal creation.

**Token & Context Optimization Rules:**
- **Consolidated Spec Querying:** Read strictly from consolidated baseline artifacts (`BASELINE.md`, `CONVENTIONS.md`, `SYSTEM_C4_DIAGRAM.md`, `DEPENDENCY_MAP.md`, `RAID_LOG.md`); DO NOT re-read individual capability specs or raw source files.
- **Audience Context Filtering:** Omit irrelevant technical noise per persona (e.g., strip code line citations for business views; strip prose summaries for agent views) to maximize context token efficiency.

**Action:** Read strictly from consolidated artifacts (`BASELINE.md`, `CONVENTIONS.md`, `SYSTEM_C4_DIAGRAM.md`) and output the target perspective immediately:
- **`render client` / `render ba`:** Business executive summary, user impact, IM8/SGDS rules, domain glossary, and plain-language Gherkin scenarios (hides internal code/file citations).
- **`render architect`:** System boundary map, Master C4 diagram, Mermaid coupling sequence diagrams, cyclic loops, flagged domain leaks (`has_domain_leak: true`), shared `cap-000-*` utility topology, and RAID risks.
- **`render developer`:** Consolidated data schema mutations, ER diagrams, field constraints, test coverage gaps, TDD commit sequencing, dual-state feature toggle testing targets (ON/OFF paths), and exact `file:lines` citations.
- **`render agent`:** Pure machine-readable YAML/JSON frontmatter schemas, deterministic BDD scenarios, and fitness function stubs (ArchUnit / `pytest-archon` rules).


**Action:** Render customized, audience-specific perspectives derived strictly from consolidated baseline artifacts:

| View Command                  | Target Persona                               | Content Scope & Rendering Rules                                                                                                                                                                                                     |
|-------------------------------|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `render client` / `render ba` | Business Analysts & Non-Technical Executives | Executive summary, user journey impacts, domain glossary, regulatory rules (IM8/SGDS), and plain-language Gherkin BDD scenarios. **STRICT RULE:** Hide all `file_path:lines` citations, raw code handlers, and DB schemas.          |
| `render architect`            | System Architects & Tech Leads               | System boundary map, Master C4 diagram, `cap-000-*` utility topology, cyclic dependency loops, flagged domain leaks (`has_domain_leak: true`), fault-tolerance recovery strategies, and high-priority RAID risks.                   |
| `render developer`            | Software Engineers & Testers                 | Data schema mutations, ER diagrams, field constraints, test coverage gaps, local seed requirements, TDD commit order sequencing, dual-state feature toggle paths (Toggle ON vs. Toggle OFF), and exact `file_path:lines` citations. |
| `render agent`                | LLM Sub-Agents & Automated CI Pipelines      | Pure machine-readable YAML/JSON frontmatter schemas, deterministic Gherkin scenarios, and fitness function stubs (ArchUnit / `pytest-archon` rules). **STRICT RULE:** Omit conversational prose and explanatory markdown.           |

**Human Prompt & Continuation Gate:**
> Rendered **<view-type>** View successfully!
> - Type **'render <another-view>'** to switch stakeholder perspectives (`client`, `architect`, `developer`, `agent`).
> - Type **'proposal <feature-name>'** to initiate a change proposal under `openspec/changes/`.