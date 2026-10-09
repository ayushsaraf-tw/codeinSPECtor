# OpenSpec Engineering & Architecture Conventions

## 1. Shift-Left Mindset & Early Constraint Discovery (RAIDD)
- **Early Warning:** Identify capability constraints, breaking changes, and cross-service impacts during **Proposal Stage** (`proposal.md`).
- **Mandatory RAIDD:** Every proposal MUST include a RAIDD section (Risks, Assumptions, Issues, Dependencies, Decisions).
- **Multi-Env Release:** Detail CI → UAT → Production deployment steps, DB lock risks, migration order, and 3rd-party API dependencies.

## 2. Test-Driven Development (TDD) & Pipeline-Safe Commit Delivery
- **Red-Green-Refactor Cycle:** Write failing unit, integration, and smoke tests before implementation code. Update existing tests first; add new suites if missing.
- **Pipeline-Safe Atomic Commit Ordering:**
  - *Rule:* Every individual git commit MUST pass CI/CD pipeline builds and tests before being pushed. Never commit standalone failing test stubs that break pipeline runs.
  - *Logical Unit Ordering:* Group logically coupled tasks (e.g., Task 1 + Task 2) into atomic commits containing **both** their test suite and corresponding domain logic/schemas.
  - *Feature-Garded Inactive State:* New capability logic remains dormant ("dead code" path) until final entry-point wiring commits activate it via feature toggle.

## 3. Interface-Level Feature Toggle Strategy
- **Interface Abstraction:** Feature toggles MUST be implemented at the interface boundary using **Strategy** or **Factory** design patterns.
- **Provider-Agnostic Toggle Interface:** Fetching toggle state MUST go through an abstract interface (e.g., `FeatureToggleProvider`). Domain logic must never depend directly on specific vendor SDKs (LaunchDarkly, Unleash, Redis, Env vars).
- **Dual-State Testing (Mandatory):**
  - **Toggle OFF:** Prove legacy behavior remains 100% regression-free.
  - **Toggle ON:** Prove new strategy implementation functions as expected.
- **Toggle Lifecycle:** Reuse existing flags where possible. Log a task in `tasks.md` for toggle cleanup post-rollout.

## 4. Evolutionary Architecture & Fitness Functions
- **Fitness Functions:** Integrate rules into existing tools (ArchUnit, `pytest-archon`, Dependency Cruiser) or introduce a lightweight suite.
- **Refactoring & Drift Prevention:** Apply Refactoring.Guru patterns. Decouple overly complex controllers into use-case services or async messaging.
- **Dependency Hygiene:** Audit new packages for vulnerabilities and active maintenance before adopting.

## 5. Visual Documentation & Diagrams
- **System Level (Phase 4):** Master C4 System Context/Container diagram required (`SYSTEM_C4_DIAGRAM.md`).
- **Thin-Slice Level (Phase 3 & Proposals):** Generate contextual diagrams as needed:
  - **C4 Component:** Structural boundaries & adapters.
  - **Sequence:** API flows, 3rd-party handshakes, async events.
  - **ER Diagram:** DB mutations & ORM schemas.
  - **Flowchart:** Decision trees & feature flag paths.
  - **UI State Hierarchy:** Component trees & store flows.
  - **Event Topology:** Kafka/RabbitMQ topics & DLQs.

## 6. Architectural Dependencies & Cyclic Coupling
- **Shared Utilities (`cap-000-*`):** Extract common helpers, middleware, and ORM bases into `cap-000-common-<slug>`. Reference via `linked_capabilities`.
- **Cyclic Boundaries:** Treat cross-dependent capability calls as black-box boundaries. Record `cyclic_dependencies: ["cap-XXX-slug"]` in frontmatter and log in `RAID_LOG.md`.

## 7. Output Completeness Principle
- **Floor, Not a Ceiling:** Templates, tables, BDD scenarios, and diagrams represent the **STRICT MINIMUM** output expectation. Proactively generate multi-diagram baselines for complex logic. Zero detail reduction or truncation permitted.

## 8. Agent Memory & Anti-Drift Standards
- **Memory Hook:** `CONVENTIONS.md` is the primary rulebook across all IDE agents (Cursor, Claude Code, Gemini CLI).
- **Fresh Session Protocol:** Re-read `SYSTEM_MAP.md` and `CONVENTIONS.md` at the start of each capability pass to eliminate context degradation.
- **Evidence Self-Critique:** Verify all cited file paths, line ranges, and table names against the current code snapshot before marking `Completed`.

## 9. Interface-First & SOLID Architecture
- **Program to Interfaces:** Depend on abstract interfaces/protocols (e.g., `PaymentGateway`), not concrete classes. Wire via Inversion of Control / DI.
- **Boundary Abstractions:** Wrap 3rd-party APIs, DB adapters, and messaging brokers behind Hexagonal Ports & Adapters. Keep domain logic framework-free.
- **SOLID Core:** Enforce SRP, OCP, LSP, and ISP (favor small, role-specific interfaces over god interfaces).

## 10. Security, Zero-Trust & Async Resilience
- **Input Validation:** Enforce schema validation (Zod, Pydantic, Bean Validation) at all entry boundaries.
- **Fail-Secure Masking:** Log diagnostic traces internally; return sanitized error contracts externally. Never leak stack traces.
- **Least Privilege:** Query explicit fields only (`SELECT *` prohibited).
- **Resilience Controls:** Mandate `X-Idempotency-Key` headers for mutations. Enforce exponential backoff, retries, and circuit breakers on external calls.
- **Async Queues & Telemetry:** Offload heavy work (>500ms) to task queues with DLQs. Output structured JSON logs with propagated `trace_id` and `span_id`.

## 11. Modern UI & Frontend Practices
| Area | Constraint / Rule |
| :--- | :--- |
| **Hierarchy** | Atomic structure (Atoms → Molecules → Organisms → Pages). Max 200 lines/file. |
| **Logic Separation** | Presentational components only. Extract state and API calls into custom hooks/stores. |
| **Styling** | Centralized design tokens only (Tailwind/CSS Variables). No inline hex/pixel offsets. |
| **4-State UI Pattern** | Mandatory async handling: **Idle**, **Loading (Skeletons)**, **Success**, **Error/Empty (Retry)**. |
| **Cache & State** | Optimistic updates must include rollback rules. Define explicit cache invalidation. |
| **a11y & SGDS** | Semantic HTML, `aria-*` tags, keyboard focus, WCAG 2.1 AA, and SGDS design alignment. |

## 12. Proposal Sizing & Fast-Track Protocol
- **Scope Categorization:** Declare scope in `proposal.md` frontmatter: `major_feature`, `minor_feature`, or `refactor_internal`.
- **Fast-Track Rules (`scope: refactor_internal`):**
  - Omit UI, DB, and Infra sections from `design.md`.
  - No feature toggle required if existing test contracts are preserved.
  - Streamlined 2-step TDD plan: (1) Verify existing tests (Red), (2) Refactor internal logic (Green).

## 13. Regulatory Compliance (IM8, ShipHATS, GCC)
- **IM8 Safeguards:** Sanitize inputs at boundaries. Never pass PII/NRIC or secrets into context windows. Enforce AES-256 at rest and TLS 1.3 in transit.
- **Data Classification & GCC Isolation:** Declare `data_classification: [Unclassified | Restricted | Confidential]`. If `Restricted`+, enforce zero public egress, private VPC endpoints, and CLM log streaming.
- **ShipHATS & DevSecOps:** Ensure compatibility with GitLab CI/CD SAST, DAST, Secret Detection, and Trivy scanning. Zero Critical/High CVEs permitted.
- **RTO/RPO Safeguards:** DB schema mutations must declare RTO/RPO targets and PITR snapshot policies.

## 14. Thoughtworks Tech Radar Protocol
- **Exploration Trigger:** Permitted ONLY IF existing stack libraries are EOL/deprecated or requirements cannot be met with existing `cap-000-*` utilities.
- **Radar Rings:** Cross-reference against Thoughtworks Tech Radar (https://www.thoughtworks.com/en-sg/radar).
  - **Adopt / Trial:** Preferred defaults.
  - **Assess:** Permitted with trade-off spike matrix in `design.md`.
  - **Hold / Caution:** Strictly prohibited without Tech Lead sign-off.
- **Approval Gate:** External package installation requires explicit human sign-off in `proposal.md`.

## 15. Living ADR Automation
- **ADR Trigger:** Changes with `scope: major_feature`, new frameworks, DB migrations, or security boundary shifts MUST draft an ADR in `openspec/adrs/ADR-XXXX-<title>.md` (MADR format).
- **Lifecycle:** `openspec-propose` creates `Status: Proposed`. `openspec-apply` updates to `Status: Accepted` post-merge and updates `openspec/adrs/README.md`.

## 16. Agent Model Routing Standards
- **Planning & System Maps (`/opsx:build-baseline` Phase 1 & 4):** Route to `frontier-reasoning` models (Claude Opus / GPT-o3).
- **Code Generation (`openspec-apply`):** Route to `balanced-coder` models (Claude Sonnet / GPT-5-Codex).
- **File Exploration & Scanning:** Route to `fast-lightweight` models (Claude Haiku / GPT-4o-mini).

## 17. Token Budget & Context Window Optimization
- **AST Skeleton Parsing:** For files >500 lines, extract AST method signatures first; fetch implementation bodies only for target execution paths.
- **Diff-Based Generation:** Code updates in `openspec-apply` MUST output search-and-replace blocks or Unified Git Diffs instead of rewriting full files.
- **Lazy Spec Loading:** Query YAML frontmatter headers before reading full capability specification markdown files.
- **Diagram Bounding:** Mermaid diagrams MUST NOT exceed 25 sequence steps or 30 flowchart nodes per block; split complex flows into modular sub-diagrams.

## 18. Claude Code & IDE Best Practices (Cost & Token Efficiency)
- **CLAUDE.md Integration:** `CLAUDE.md` at project root MUST point directly to `openspec/specs/CONVENTIONS.md` and `openspec/specs/SYSTEM_MAP.md`.
- **Session Hygiene:** Start fresh chat sessions for unrelated capabilities to eliminate context history bloat. Use `/compact` to condense long chat threads.
- **Multi-File Batch Slicing (Rule for >4 Files):** If a capability slice spans many files (e.g., 10 files across multi-layer stacks), DO NOT dump all files into prompt memory at once. Process in **chained 4-file batch passes**:
  1. *Pass 1:* Parse AST skeletons of all 10 files to map call trees.
  2. *Pass 2..N:* Read full code bodies strictly in 4-file chunks along target execution branches, carrying forward only key interface signatures.
- **Suppress Conversational Fillers:** Avoid robotic summaries, intros, and conversational fluff. Output structured markdown deliverables directly.
- **Plan Mode & Human Gates:** Use Plan Mode before executing file edits. Require explicit human confirmation before writing baseline files.