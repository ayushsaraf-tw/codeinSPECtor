# OpenSpec Engineering & Architecture Conventions

## 1. Shift-Left Mindset & Early Constraint Discovery (RAIDD)
- **Early Warning:** All capability-level constraints, breaking changes, and cross-service impacts MUST be identified during the **Proposal Stage** (`proposal.md`), long before writing code.
- **RAIDD Log Mandatory:** Every proposal MUST contain a RAIDD section (Risks, Assumptions, Issues, Dependencies, Decisions).
- **Multi-Environment Release Strategy:** Detail deployment steps across environments (CI $\rightarrow$ UAT $\rightarrow$ Production), explicitly specifying migration sequencing, database lock risks, and third-party API dependencies.

## 2. Test-Driven Development (TDD) & Trunk-Based Delivery
- **Pure TDD Cycle:** Strictly follow Red $\rightarrow$ Green $\rightarrow$ Refactor. Write failing unit, integration, and functional/smoke tests before touching implementation code.
- **Modifying Existing vs. New Tests:** If tests exist for the target capability, update them first. If no tests exist, write a new comprehensive test suite.
- **Trunk-Based Commit Ordering:** Structure commits as small, independent, testable units that can safely be deployed to main:
    1. *Commit 1 (TDD & Fitness Rules):* Failing test stubs and fitness functions.
    2. *Commit 2..N (Infrastructural & Core Logic):* Domain changes, schemas, and helper utilities.
    3. *Final Commit (Feature Toggle):* The entry point wiring controlled by the feature toggle.
- **Dual-State Testing (Toggle ON & Toggle OFF):**
    - **Toggle OFF (Mandatory):** Tests MUST prove that when the toggle is OFF, legacy behavior remains 100% regression-free and untouched.
    - **Toggle ON:** Tests MUST prove that the new behavior functions correctly.

## 3. Feature Toggle Strategy
- **Framework Agnostic:** Detect existing feature flag tools in the codebase (e.g., LaunchDarkly, Unleash, Flipt, custom DB/env flags). If none exist, implement a simple, environment-driven toggle abstraction.
- **Reusability:** Always check if an existing feature toggle can be reused before creating a new one.
- **Clean Up Plan:** Every proposal adding a feature toggle must include a task in `tasks.md` to log technical debt for future toggle removal once fully rolled out.

## 4. Architecture, Fitness Functions & Evolutionary Design
- **Fitness Functions:** Check if fitness test frameworks exist in the repository (e.g., ArchUnit, `pytest-archon`, Dependency Cruiser).
    - *If existing:* Add new architecture rules to the existing suite.
    - *If non-existent:* Introduce a lightweight fitness function test suite as part of the proposal.
- **Refactoring & Clean Code:** Continuously look for macro and micro refactoring opportunities following **Refactoring.Guru** patterns (e.g., replacing switch statements with strategy patterns, extracting domain services).
- **Macro Design Drift at Feature Level:** During proposals, evaluate if business requirements have outgrown the current structure. If a controller/service has grown too complex, propose splitting it into an independent use-case package, changing synchronous calls to async messaging, or decoupling module boundaries.
- **Library & Dependency Hygiene:**
    - Audit libraries for security vulnerabilities before adding dependencies.
    - Evaluate well-maintained alternatives (high commit frequency, active issue resolution) before selecting a library.

## 5. Visual Documentation & Diagrams
- **System-Level Architecture (Phase 4):** A C4 System Context/Container diagram is MANDATORY at the master system level (`SYSTEM_C4_DIAGRAM.md`).
- **Contextual Thin-Slice Diagrams (Phase 3 & Proposals):** Generate diagrams **wherever required** based on capability complexity:
  - **C4 Component Diagrams:** Structural boundaries, adapters, or multi-component modules.
  - **Sequence Diagrams:** Multi-step API flows, 3rd-party integrations, or async event handshakes.
  - **ER Diagrams:** Database mutations, ORM schemas, or entity relationships.
  - **Flowcharts:** Branching business logic, decision trees, or feature toggle paths.
  - **UI State & Hierarchy Diagrams:** Frontend component hierarchies, React/Redux store flows, or UI state transitions.
  - **Event Broker Topologies:** Kafka/RabbitMQ topics, queue consumers, and dead-letter pipeline flows.

## 6. Architectural Dependencies, Utilities & Cyclic Coupling
- **Infrastructure / Shared Utilities (`cap-000-*`):** Common helpers, ORM base models, middleware, and shared utility modules MUST be extracted as `cap-000-common-<slug>` capabilities. Domain capabilities reference them via frontmatter (`linked_capabilities`) rather than re-analyzing their internal code.
- **Cyclic Dependency Boundaries:** When two domain capabilities depend on each other, treat the external call as a black-box boundary. Record `cyclic_dependencies: ["cap-XXX-slug"]` in frontmatter and log the coupling risk in `RAID_LOG.md`.

## 7. Output Completeness & Additional Value Principle
- **Floor, Not a Ceiling:** All templates, tables, BDD scenarios, and diagram requirements represent the **STRICT MINIMUM** output expectation.
- **Proactive Multi-Diagram Baseline Generation:** Never restrict output to high-level summaries or single C4 diagrams. If a capability slice involves database persistence, multi-service communication, state changes, or branching decisions, the agent MUST proactively generate additional diagrams (ER, Sequence, Flowchart) directly into the baseline `spec.md`.
- **Zero Detail Reduction:** Additional relevant technical information, security constraints, performance notes, or edge cases are always welcomed; truncated or stripped-down outputs are strictly prohibited.

## 8. Agent Memory, Context Windows & Anti-Drift Standards
- **Standardized Memory Hook (`agents.md` / `CONVENTIONS.md` Alignment):** `codeinSPECtor` uses `openspec/specs/CONVENTIONS.md` as its primary system rulebook. When running under tools that support project-level instruction files (Cursor, Claude Code, Gemini CLI), the agent MUST treat `CONVENTIONS.md` as the authoritative source of engineering standards.
- **Context Compacting & Fresh Session Protocol:** To avoid context degradation ("context drift") during long multi-capability analysis runs, the agent MUST explicitly re-read `SYSTEM_MAP.md` and `CONVENTIONS.md` at the start of each new Phase 3 capability slice rather than relying on compressed conversation history.
- **Evidence-Based Self-Critique Audit:** Before marking any capability as `Completed` in `CAPABILITIES_TREE.md`, the agent MUST verify that every cited file path, line range, and database table name directly exists in the current source code snapshot.

## 9. Interface-First & Architectural Quality Standards
- **Program to Interfaces, Not Implementations:**
  - Every business domain service MUST depend on abstract interfaces, contracts, or protocols rather than concrete implementation classes (e.g., depend on `PaymentGateway` interface, not `StripePaymentClient` concrete class).
  - Concrete implementations MUST be wired via Dependency Injection (DI) or inversion of control frameworks.
- **Explicit Boundary Abstractions:**
  - All external 3rd-party APIs, database adapters, and messaging brokers MUST be wrapped behind boundary interfaces (Ports & Adapters / Hexagonal Architecture).
  - Domain logic MUST remain pure and independent of database or HTTP frameworks.
- **SOLID Design Principles:**
  - **Single Responsibility (SRP):** Classes and modules MUST have only one reason to change.
  - **Open/Closed (OCP):** Software entities MUST be open for extension but closed for modification (enforced via Strategy patterns or plugin interfaces).
  - **Liskov Substitution (LSP) & Interface Segregation (ISP):** Prefer small, role-specific interfaces over massive "god interfaces".

## 10. Security, Defensive Programming & Zero-Trust Boundaries
- **Boundary Schema Validation:** All public entry points (HTTP/RPC/UI forms) MUST enforce strict schema validation (Zod/Pydantic/Bean Validation).
- **Fail-Secure Error Masking:** Catch blocks MUST log detailed diagnostic traces internally while returning sanitized error contracts externally. Never leak internal stack traces.
- **Least-Privilege Field Queries:** Database interactions and API client fetches MUST query explicit fields; `SELECT *` or wildcard payload extractions are prohibited.

## 11. Async Resilience, Idempotency & Observability
- **Idempotency Safeguards:** Non-idempotent mutations (example: payments, orders) MUST require and enforce `X-Idempotency-Key` headers.
- **Outbound Fault Tolerance:** Cross-service and 3rd-party API integrations MUST implement exponential backoff, jittered retries, and circuit breakers.
- **Asynchronous Task Offloading:** Heavy processing operations (>500ms) MUST acknowledge immediately and delegate processing to async task queues equipped with Dead Letter Queues (DLQ).
- **Structured Telemetry & Trace Context:** All logging MUST output as structured JSON containing propagated `trace_id` and `span_id` context headers across client/server request boundaries.

## 12. Advanced UI State & Micro-Frontend Patterns
- **Optimistic UI & Rollback Handlers:** Optimistic state updates MUST include explicit state rollback logic upon network or server validation failure.
- **Explicit Cache Invalidation:** Data-fetching layers MUST define explicit cache key invalidation rules upon state mutations.
- **Micro-Frontend Event Isolation:** Cross-module UI communication MUST use standard Event Bus payloads rather than direct store or DOM mutation coupling.

## 13. Modern UI & Frontend Engineering Practices
- **Atomic & Modular Component Hierarchy:**
  - Structure UI components hierarchically: **Atoms** (buttons, inputs), **Molecules** (form groups, search bars), **Organisms** (navigation headers, data tables), and **Pages/Views**.
  - Components MUST be small, single-purpose, and limited to $\le 200$ lines of code per file.
- **Strict Separation of UI & Business Logic:**
  - Components MUST handle display logic only. State management, API calls, and domain formatting MUST be extracted into custom hooks (React), composables (Vue), or selector/store middleware (Redux/Zustand).
- **Design System & Styling Consistency:**
  - Use centralized design tokens (Tailwind CSS, CSS Variables, or UI kit themes) for spacing, colors, typography, and breakpoints. NO hardcoded inline hex colors or arbitrary pixel offsets.
- **Defensive UI States (Mandatory 4-State UI Pattern):**
  - Every async UI component MUST explicitly implement and test four states:
    1. **Idle / Initial State**
    2. **Loading State** (Skeletons or spinners—prevent layout shifts)
    3. **Success State** (Rendered data)
    4. **Error / Empty State** (User-friendly error messages with retry actions)
- **Accessibility (a11y) & Responsiveness:**
  - All interactive elements MUST have semantic HTML tag usage (`<button>`, `<nav>`, `<main>`), proper `aria-*` attributes, keyboard navigation support, and responsive layout scaling across mobile, tablet, and desktop breakpoints.

## 14. Proposal Sizing & Fast-Track Execution Protocol
- **Categorize Proposal Scope:** Every `proposal.md` MUST designate its change scope in frontmatter:
  - `scope: major_feature` (Full-stack: UI, Backend, DB, Infra, Feature Toggle)
  - `scope: minor_feature` (Single stack/component extension)
  - `scope: refactor_internal` (Zero external contract changes, zero schema migrations)

- **Fast-Track Rules for Internal Refactoring (`scope: refactor_internal`):**
  - **Omit N/A Sections:** Omit UI, Database, and Infra sections completely from `design.md` and `spec.md` deltas.
  - **No Feature Toggle Required:** Internal refactors that preserve existing unit test contracts DO NOT require feature flags.
  - **Streamlined TDD Cycle:** Require only a 2-step task plan: (1) Verify/add unit tests covering existing behavior, (2) Perform internal refactor until tests pass.

## 15. Singapore Government Regulatory Compliance (IM8, ShipHATS, GCC)
- **IM8 Data & Security Safeguards:**
  - All public boundaries MUST enforce input sanitization and schema validation (Zod/Pydantic/Bean Validation).
  - PII, NRIC, financial data, and credentials MUST NEVER be logged or passed into unmasked context windows.
  - Data at rest MUST use AES-256 encryption; data in transit MUST enforce TLS 1.3.
- **ShipHATS & DevSecOps Integration:**
  - All proposals MUST generate CI/CD-compatible deployment steps passing SAST/DAST/Dependency scans.
  - Container images MUST NOT introduce Critical or High CVEs and MUST comply with ShipHATS pipeline standards.
- **GCC (Government Commercial Cloud) Infrastructure:**
  - Terraform/Cloud specs MUST align with GCC landing zone policies, VPC internet/intranet tiering, and Central Log Management (CLM) output formats.

## 16. Technology Radar & Library Exploration Protocol (Thoughtworks Integration)
- **Controlled Innovation Trigger:** The agent MAY explore new libraries, tools, or architectural patterns ONLY IF:
  1. Existing stack libraries are End-Of-Life (EOL), deprecated, or introduce security vulnerabilities.
  2. New feature requirements cannot be satisfied cleanly using existing `cap-000-*` utilities.
- **Thoughtworks Tech Radar Cross-Reference:**
  - Proposed libraries/tools MUST be evaluated against the latest [Thoughtworks Technology Radar](https://www.thoughtworks.com/en-sg/radar).
  - **Adopt / Trial:** Preferred defaults for new tech stack introductions.
  - **Assess:** Permitted with an explicit mini-spike trade-off analysis in `design.md`.
  - **Hold:** STRICTLY PROHIBITED unless an explicit architectural override is granted by the Tech Lead.
- **Evaluation Spike Matrix:** When proposing new technology, `design.md` MUST include a trade-off evaluation matrix covering:
  - **Radar Status:** (Thoughtworks Radar Ring + License type).
  - **Compliance Check:** IM8 data security & ShipHATS pipeline compatibility.
  - **Alternative Comparison:** Existing stack vs. proposed package (bundle size, maintainability, CVE history).
- **Human Approval Gate:** New external packages CANNOT be installed without explicit human sign-off in `proposal.md`.

## 17. Living ADR (Architecture Decision Record) Automation
- **ADR Generation Trigger:** Any change involving new frameworks, database schema mutations, security boundary changes, or major refactoring MUST automatically draft an ADR in `openspec/adrs/ADR-XXXX-<title>.md`.
- **ADR Structure:** MUST follow MADR format (Context, Decision Drivers, Considered Options, Decision Outcome, Pros/Cons, IM8/GCC Compliance Impact).
- **Lifecycle Linking:**
  - `openspec-propose` creates `Status: Proposed`.
  - `openspec-apply` updates status to `Status: Accepted` upon successful deployment and updates `openspec/adrs/README.md` index.

## 18. Data Classification, GCC Landing Zones & DR Rules
- **Data Classification Tagging:** Every proposal MUST declare \`data_classification: [Unclassified | Restricted | Confidential]\`.
- **GCC Network Lockdown:** If \`Restricted\` or higher, \`design.md\` MUST enforce zero-internet egress, VPC private endpoints, and Central Log Management (CLM) streaming.
- **RTO/RPO Safeguards:** Persistence schema mutations MUST declare RTO/RPO targets and PITR snapshot policies.

## 19. ShipHATS DevSecOps & SGDS UI Standards
- **ShipHATS Pipeline Compliance:** All proposals MUST ensure compatibility with ShipHATS GitLab CI/CD SAST, DAST, Secret Detection, and Trivy container scanning gates.
- **SGDS & WCAG 2.1 AA Accessibility:** Frontend components MUST adhere to Singapore Government Design System (SGDS) patterns and WCAG 2.1 AA accessibility (keyboard focus, screen reader tags, contrast ratios).