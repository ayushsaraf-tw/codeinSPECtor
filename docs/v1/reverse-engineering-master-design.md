# Legacy Code Reverse Engineering Engine — Master Design

## Mission

Analyze an existing legacy software system and reconstruct a trustworthy, evidence-backed specification of its current behavior.

The result should support four primary audiences:

- Client / Business stakeholders
- Tech Principal / Architect / Tech Lead
- Developer / Maintainer
- AI coding or analysis agent

The reverse-engineering workflow is intentionally separate from the normal OpenSpec change workflow.

```text
Legacy repository
    -> reverse engineering
    -> canonical OpenSpec
    -> client/stakeholder validation
    -> normal OpenSpec change workflow
    -> implementation
```

## Canonical truth

OpenSpec remains the canonical representation of reconstructed system behavior.

The analyzer may maintain intermediate evidence and indexes, but those are supporting artifacts. Audience-specific documents are derived views and must not become competing sources of truth.

## Analysis model

The engine should progressively build the following understanding:

```text
Repository
  -> Applications / Components
  -> Modules / Boundaries
  -> Domains
  -> Capabilities
  -> Vertical slices
  -> Behavior / Rules / State
  -> Data / Integrations / Security
  -> Evidence / Confidence / Validation
  -> Canonical OpenSpec
```

### Repository reconnaissance

Discover:

- repository layout
- applications, modules and shared libraries
- languages and frameworks
- build and dependency systems
- entry points
- databases and migrations
- APIs
- events and message consumers/producers
- scheduled and batch processing
- frontend applications and routing
- configuration and feature flags
- infrastructure and deployment definitions
- generated code
- tests and test frameworks

Do not assume the repository boundary is the system boundary.

### System boundary discovery

Infer meaningful components and relationships from evidence. A repository may contain one or multiple applications, services, libraries, frontends, data stores or infrastructure components.

Represent relationships where evidence supports them:

- component -> component
- component -> database
- component -> broker/event stream
- component -> external service
- UI -> frontend state/client -> API -> application/domain -> persistence

### Capability discovery

Capabilities are meaningful business or externally observable responsibilities, not merely classes or technical packages.

Examples:

- Order cancellation
- Customer enrollment
- Payment authorization
- Account recovery

Avoid treating `OrderService` or `EnrollmentController` as capabilities unless the repository provides no better behavioral boundary.

For each capability identify:

- business purpose
- actors
- entry points
- user journey where applicable
- inputs and validation
- successful behavior
- failure behavior
- business rules
- state transitions
- data and mutations
- integrations
- security constraints
- CFR/NFR evidence
- tests
- related capabilities
- evidence and confidence

### Vertical slices

When multiple layers exist, trace end-to-end slices where possible:

```text
User
 -> UI interaction
 -> Frontend state/client
 -> API / event / command
 -> Application service
 -> Domain logic
 -> Persistence
 -> Event / external integration
```

If the slice cannot be completed, record the missing link.

### Business language

Maintain a domain glossary that maps technical names to business concepts only when evidence supports the mapping.

Do not silently translate technical labels into invented business terms.

Capture the business consequence of failures when it can be established. Technical status codes are evidence; they are not automatically the business meaning.

### Functional requirements and business rules

Separate:

- implemented behavior
- explicit business requirements
- inferred business intent
- open questions

Never promote inference into requirement without evidence.

### CFR / NFR

Capture observable or explicit constraints such as:

- security controls
- timeouts
- retries
- caching
- rate limiting
- concurrency controls
- availability mechanisms
- logging/metrics/tracing
- regulatory/audit behavior

Do not invent targets. A timeout of 200 ms in configuration is evidence of a 200 ms timeout, not proof of a business SLA.

### State

Reconstruct meaningful state machines only from evidence.

Capture:

- valid states
- entry state
- transitions
- trigger
- guard/condition
- side effects
- invalid transitions
- terminal states where applicable

### Data

Trace business-relevant data across:

```text
Input -> domain/application model -> persistence model -> database / external store
```

Capture relevant entities, tables, fields, relationships, constraints, migrations, stored procedures, triggers, transaction boundaries and mutations.

### Integrations

Capture important interactions with:

- REST/HTTP
- GraphQL
- databases
- brokers/queues
- event buses
- files
- third-party services
- identity providers
- cloud services

Include trigger, direction, purpose, relevant contract, security, retry/timeout behavior and failure handling where evidenced.

### Security and compliance

Analyze:

- authentication
- authorization
- roles/permissions
- resource ownership
- route protection
- service-to-service security
- data protection
- audit behavior
- PII/sensitive data classification where evidence exists

Distinguish backend enforcement from frontend-only checks and from merely declared configuration.

### Tests and verification

Map tests to behavior.

Distinguish:

- test-confirmed behavior
- implementation-confirmed but untested behavior
- partially covered behavior
- contradictory tests
- important behavior without tests

### Contradictions

Actively compare evidence across:

- frontend vs backend
- implementation vs tests
- API contract vs implementation
- documentation vs implementation
- database constraints vs application validation
- duplicate implementations

A contradiction is a finding, not an invitation to guess.

### Technical debt / architecture findings

Keep behavioral truth separate from health assessments.

Findings can include:

- coupling
- shared database dependencies
- duplicated business rules
- circular dependencies
- suspicious query patterns
- fragile integrations
- apparent dead/orphaned functionality
- architectural smells
- technical debt

Every finding should have evidence and an appropriate confidence level.

## Provenance and time

Record the analysis scope and, when possible, Git revision/commit. The system should eventually support stale evidence detection when source changes invalidate prior conclusions.

## Scale

Support hierarchical analysis:

```text
Repository
  -> system map
  -> component/module map
  -> capability map
  -> capability deep dive
  -> vertical slice trace
  -> detailed behavior
```

Large-scale analysis must be resumable, scope-aware and incremental.

Never define completion as "every file was read". Define completion by coverage of meaningful system behavior and explicit recording of incomplete areas.

## Views

From the same canonical OpenSpec, produce derived views:

### Client / Business

- capabilities
- actors
- journeys
- business rules
- functional behavior
- business impact of failures
- CFR/NFR
- open questions
- domain glossary

Evidence should be linked/collapsible rather than displayed as source-code noise.

### Architecture / Lead

- system context
- C4-style context/container/component views where appropriate
- capability map
- vertical slices
- sequence/state diagrams
- dependency graph
- security/compliance boundaries
- ripple/coupling map
- architecture risks and technical debt findings

### Developer

- APIs
- validation
- exceptions
- source symbols
- data mutations
- events
- configuration
- tests
- local setup/seed dependencies where discoverable
- operational quirks

### Debugging

Given an incident or symptom, derive:

- impacted capability
- relevant end-to-end path
- failure points
- preconditions
- dependencies
- evidence
- contradictions
- tests
- likely diagnostic locations

### Change / new feature analysis

Given a proposed change, derive:

- current behavior
- affected capabilities
- affected vertical slices
- impacted APIs/UI/data/integrations/security
- existing requirements and invariants
- tests and gaps
- ripple effects
- risks
- unknowns
- candidate OpenSpec change

## Quality gates

Before marking a capability or system area complete, check:

- coverage
- evidence traceability
- business readability
- technical usefulness
- test coverage awareness
- contradiction detection
- uncertainty disclosure
- scope/provenance
- change readiness
