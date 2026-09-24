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