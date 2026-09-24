### PHASE 1: Broad System Reconnaissance (Fully Agnostic)
**Condition:** `openspec/specs/SYSTEM_MAP.md` DOES NOT EXIST.

**Rule:** DO NOT assume any language, framework, or file extension upfront.

**Action:**
1. **Discover Ecosystem:** Inspect root directory for build definitions, manifests, and container configs (`package.json`, `pom.xml`, `build.gradle`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `Makefile`, `Dockerfile`, `docker-compose.yml`, etc.).
2. **Discover Persistence Layer:** Locate migration directories, ORM schemas, SQL scripts, protobufs, or OpenAPI specifications regardless of folder structure.
3. **Discover Entry Points:** Identify all entry mechanisms (HTTP handlers, RPC methods, event listeners, CLI interfaces, background jobs) purely from structural wiring.
4. **Discover Shared Utilities & Infrastructure:** Identify shared helpers, base database clients, ORM abstractions, security utilities, and interceptors to catalog for `cap-000-*` extraction in Phase 2.
5. Output the discovered map to `openspec/specs/SYSTEM_MAP.md` and record the **`.detected_ecosystem`**.

**Output Schema (`openspec/specs/SYSTEM_MAP.md`):**
```markdown
---
type: system_map
version: 1.0.0
detected_ecosystem: "<e.g., Go/Gin + PostgreSQL | Java/Spring + MySQL | Node/TypeScript + Mongo | Multi-Language>"
primary_languages: ["<lang_1>", "<lang_2>"]
entry_points_count: <number>
---

# System Map

## Discovered Modules & Infrastructure
- **Manifests & Configs:** `<file-list>`
- **Schemas / Migrations:** `<file-list>`
- **Primary Source Paths:** `<directory-list>`

## Shared Utilities & Infrastructure
- **Shared Helpers & Middleware:** `<file-list>`

## Discovered Entry Points
- `<protocol/type> <path/event/command>` -> `<Handler/Function>` (`file:lines`)
```

**Human Prompt (STOP HERE):**
> "Phase 1 Complete: System Map written to openspec/specs/SYSTEM_MAP.md.
> Identified Ecosystem: <detected_ecosystem>
> Review entry points and type 'yes' to proceed to Phase 2."