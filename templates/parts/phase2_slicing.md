### PHASE 2: Capability Slicing & Nested Bounded Contexts
**Condition:** `SYSTEM_MAP.md` EXISTS, but `openspec/specs/CAPABILITIES_TREE.md` DOES NOT EXIST.

**Action:**
1. Read `SYSTEM_MAP.md` and identify primary business domains using semantic IDs: `cap-XXX-<short-business-slug>` (e.g., `cap-001-user-management`).
2. **Slicing & Nesting Decision Matrix:**
   - **Flat Capability (Standard):** If an entry point group represents a self-contained, single business context, create a single spec at `openspec/specs/cap-XXX-<slug>/spec.md`.
   - **Nested Bounded Context (Complex / Leaky):** If a business domain contains multiple distinct sub-responsibilities, sprawling workflows, or **domain leaks** (e.g., Order Processing directly mutating Inventory and Payment state), decompose it into nested sub-bounded contexts:
      - **Parent Context Overview:** `openspec/specs/cap-010-order-processing/spec.md` (Domain boundary overview, sub-slice index, and high-level routing).
      - **Sub-Bounded Context 1:** `openspec/specs/cap-010-order-processing/cap-010a-payment-capture/spec.md`
      - **Sub-Bounded Context 2 (Domain Leak Slice):** `openspec/specs/cap-010-order-processing/cap-010b-inventory-mutation/spec.md`

3. **Domain Leak Identification:**
   - For any sub-slice that directly accesses or mutates database tables, models, or state belonging to another domain, flag it as `has_domain_leak: true` in `CAPABILITIES_TREE.md`.

4. Output the execution index to `openspec/specs/CAPABILITIES_TREE.md`.

**Human Prompt (STOP HERE):**
> "Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`.
> Identified Bounded Contexts & Sub-Slices (including flagged domain leaks).
> Which capability ID would you like to analyze first?"