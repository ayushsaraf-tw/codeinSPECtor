# Reverse Engineering Output Contract

This document defines the intended information contract for the reverse-engineering result. It is deliberately separate from audience-specific presentation.

## 1. System

```yaml
id: SYS-XXX
name: <system-name>
scope:
  repositories: []
  components: []
provenance:
  revision: <git-revision-or-unknown>
  analyzed_at: <timestamp>
```

## 2. Capability

Each capability should conceptually support:

```yaml
id: CAP-XXX
name: <capability-name>
domain: <domain-or-unknown>
purpose: <business-observable-purpose>
status:
  implementation: confirmed | partial | unknown
  tests: confirmed | partial | none-found | unknown
  business_intent: confirmed | unverified | contradictory | unknown
confidence:
  level: high | medium | low
actors: []
entry_points: []
user_journeys: []
requirements: []
business_rules: []
scenarios: []
state_transitions: []
data_entities: []
data_mutations: []
integrations: []
security: []
cfr_nfr: []
dependencies: []
affects: []
findings: []
evidence: []
open_questions: []
```

## 3. Claim

```yaml
id: CLM-XXX
statement: <claim>
evidence_status: test-confirmed | implementation-confirmed | corroborated | inferred | contradictory | unknown
confidence:
  level: high | medium | low
validation:
  status: not-required | recommended | required
  reason: <reason>
evidence: []
```

## 4. Evidence

```yaml
id: EV-XXX
type: implementation | test | schema | migration | api-contract | configuration | documentation | git | runtime
source:
  file: <path>
  symbol: <stable-symbol-or-object>
  lines: <optional-range>
  revision: <optional-revision>
relationship: supports | contradicts | partially-supports
notes: <optional>
```

## 5. Findings

Findings are separate from behavioral truth.

```yaml
id: FIND-XXX
type: contradiction | risk | technical-debt | coupling | suspected-dead-code | missing-test | security | performance | compliance
severity: info | low | medium | high
statement: <finding>
evidence: []
confidence: high | medium | low
recommended_validation: <optional>
```

## 6. Traceability

Important relationships should be representable in both directions:

```text
Requirement <-> Scenario
Scenario <-> Claim
Claim <-> Evidence
Evidence <-> Source symbol
Source symbol <-> Test
Capability <-> Vertical slice
Capability <-> Dependency
```

## 7. Presentation rule

Human-readable outputs are views over this information. Do not duplicate facts manually across client, architecture, developer and investigation documents.

Client views should default to business language and make evidence discoverable through links/collapsible sections.

Technical views should expose implementation evidence, relationships, diagrams and confidence.
