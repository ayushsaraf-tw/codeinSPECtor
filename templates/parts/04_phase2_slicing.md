### PHASE 2: Capability Tree & Semantic Nesting (Adaptive)
**Condition:** `SYSTEM_MAP.md` EXISTS, but `openspec/specs/CAPABILITIES_TREE.md` DOES NOT EXIST.

**Action:**
1. Read `SYSTEM_MAP.md` and adopt specific conventions of the **`.detected_ecosystem`**.
2. Group discovered entry points into business capabilities using semantic IDs: `cap-XXX-<short-business-slug>` (e.g., `cap-001-user-auth`).
3. **Nested Slicing Rule:** If a capability touches >4 source files, split it into child sub-slices nested under the parent domain folder:
   - **Parent Overview Spec:** `openspec/specs/cap-001-user-auth/spec.md` (Domain purpose, entry points router, and sub-slice directory index)
   - **Child Sub-Slice 1:** `openspec/specs/cap-001-user-auth/cap-001a-token-validation/spec.md`
   - **Child Sub-Slice 2:** `openspec/specs/cap-001-user-auth/cap-001b-session-persistence/spec.md`
4. If a capability touches $\le$ 4 files, create a single spec at `openspec/specs/cap-XXX-<slug>/spec.md`.
5. Write initial index to `openspec/specs/CAPABILITIES_TREE.md`.

**Human Prompt (STOP HERE):**
> "Phase 2 Complete: Capability Tree written to `openspec/specs/CAPABILITIES_TREE.md`. Which capability ID would you like to analyze first?"