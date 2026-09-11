# Code2Spec / Legacy Reverse Engineering

This repository uses a separate reverse-engineering workflow to reconstruct the current behavior of legacy software and record it in OpenSpec.

## Core principles

- Document what the system currently does, not what it ideally should do.
- Treat source code as primary evidence for implemented behavior, not automatic proof of business intent.
- Never invent business requirements.
- Preserve uncertainty. Distinguish test-confirmed, implementation-confirmed, inferred, contradictory, and unknown behavior.
- Important claims must be traceable to evidence using stable source identifiers such as file + symbol; line ranges may supplement them.
- Do not modify application source code during reverse engineering unless explicitly instructed.
- Do not assume repository = system, backend = whole system, one language = whole codebase, or REST = sole integration style.
- Discover architecture, languages, frameworks, applications, modules, databases, events, UI and external dependencies from the repository itself.
- When frontend and backend coexist, trace end-to-end vertical slices where evidence permits.
- Treat business intent, implemented behavior, and inferred intent as different concepts.
- Flag contradictions instead of silently choosing one interpretation.
- Keep client-facing language business-oriented and hide technical evidence behind traceable links/sections.

## Canonical output

OpenSpec is the canonical representation of reconstructed system behavior. Audience-specific documentation is a derived view and must not become an independent source of truth.

The reverse-engineering workflow is separate from OpenSpec's normal change workflow:

Legacy repository -> reverse engineering -> canonical OpenSpec -> client validation -> normal OpenSpec change workflow -> implementation.

## Evidence and confidence

For significant claims capture:

- claim ID
- evidence type
- file/module
- stable symbol or database/API identifier
- optional line range
- test coverage status
- confidence level
- validation status

Use evidence language such as:

- Confirmed by tests
- Confirmed by implementation
- Corroborated by multiple sources
- Inferred
- Contradictory
- Unknown

## Audience views

When generating views from the canonical specification, optimize for:

- Client/business: capabilities, actors, user journeys, business rules, functional requirements, CFR/NFR, business impact and open questions.
- Tech Principal/Lead: boundaries, dependencies, C4/context/container views, vertical slices, sequence/state diagrams, security/compliance, architectural risks and ripple effects.
- Developer: APIs, validation, exceptions, state/data mutations, events, configuration, tests, source references, local setup and operational quirks where discoverable.
- Debugging: relevant flow, evidence, failure points, contradictions, tests and diagnostic context.
- Change analysis: current behavior, impact surface, affected capabilities, risks, tests, unknowns and candidate OpenSpec changes.

## Scale

Analyze hierarchically and incrementally. Do not assume the entire repository fits into a single context window. Persist intermediate discoveries and record analysis scope, exclusions and stale/invalidated evidence.

## Quality bar

A useful reverse-engineered result must make it possible to answer:

1. What does the system do?
2. Why do we believe that?
3. Where is it implemented?
4. What are the business implications?
5. What depends on it?
6. What is uncertain or contradictory?
7. What would likely be affected by a change?
