### PHASE 2: Capability Slicing & Nested Bounded Contexts
**Condition:** `SYSTEM_MAP.md` EXISTS, but `openspec/specs/CAPABILITIES_TREE.md` DOES NOT EXIST.

**Token & Context Optimization Rules:**
- **Lazy Spec Querying:** Query YAML frontmatter headers (`linked_capabilities`, `has_domain_leak`) when checking dependencies; DO NOT read full spec bodies.
- **Tree Depth Guard:** Cap nested bounded contexts at a maximum depth of 2 levels (Parent → Sub-slice) to prevent token window explosion during Phase 3.

**Action:**
1. Read `SYSTEM_MAP.md` frontmatter and identify primary business domains using semantic IDs: `cap-XXX-<short-business-slug>` (e.g., `cap-001-user-auth`).
2. **Extract Infrastructure Capabilities (`cap-000-*`):** Group shared database clients, middleware, ORM base abstractions, and logging helpers identified in Phase 1 into dedicated utility slices (`cap-000-common-<slug>`).
3. **Slicing & Nesting Decision Matrix:**
    - **Flat Capability (Standard):** If an entry point group represents a self-contained, single business context, create a single spec at `openspec/specs/cap-XXX-<slug>/spec.md`.
    - **Nested Bounded Context (Complex / Leaky):** If a business domain contains multiple distinct sub-responsibilities, sprawling workflows, or **domain leaks** (e.g., Order Processing directly mutating Inventory and Payment state), decompose it into nested sub-bounded contexts:
        - **Parent Context Overview:** `openspec/specs/cap-010-order-processing/spec.md` (Domain boundary overview, sub-slice index, and high-level routing).
        - **Sub-Bounded Context 1:** `openspec/specs/cap-010-order-processing/cap-010a-payment-capture/spec.md`
        - **Sub-Bounded Context 2 (Domain Leak Slice):** `openspec/specs/cap-010-order-processing/cap-010b-inventory-mutation/spec.md`
4. **Domain Leak Identification:** For any sub-slice that directly accesses or mutates database tables, models, or state belonging to another domain, flag it as `has_domain_leak: true` in `CAPABILITIES_TREE.md`.
5. Output the execution index to `openspec/specs/CAPABILITIES_TREE.md`.

**Output Schema (`openspec/specs/CAPABILITIES_TREE.md`):**
```markdown
---
type: capabilities_tree
version: 1.0.0
total_capabilities: <number>
pending_count: <number>
completed_count: <number>
has_flagged_domain_leaks: <true|false>
---

# Capabilities Tree

## Shared Infrastructure Utilities (`cap-000-*`)
- [ ] `cap-000-common-db` - Database Client & ORM Abstractions
- [ ] `cap-000-common-auth` - JWT & Interceptor Utilities

## Domain Bounded Contexts
- [ ] `cap-001-user-auth` - User Authentication & Session Management
- [ ] `cap-010-order-processing` - Order Processing Engine (Parent Overview)
    - [ ] `cap-010a-payment-capture` - Payment Gateway Integration
    - [ ] ⚠️ `cap-010b-inventory-mutation` - Direct Inventory State Mutation [has_domain_leak: true]
```

**Human Prompt (STOP HERE):**
> Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`.
> Identified Bounded Contexts & Sub-Slices (including flagged domain leaks).
> Which capability ID would you like to analyze first?