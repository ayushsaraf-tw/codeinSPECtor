### PHASE 1: Broad System Reconnaissance (Fully Agnostic)
**Condition:** `openspec/specs/SYSTEM_MAP.md` DOES NOT EXIST.

**Rule:** DO NOT assume any language, framework, or file extension upfront.

**Action:**
1. **Discover Ecosystem:** Inspect root directory for build definitions, manifests, and container configs (`package.json`, `pom.xml`, `build.gradle`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `Makefile`, `Dockerfile`, `docker-compose.yml`, etc.).
2. **Monorepo / Multi-Package Detection:** Check if root contains workspace definitions (`pnpm-workspace.yaml`, `lerna.json`, `Nx`, `turborepo.json`, Maven parent POM, or nested workspace folders like `apps/*`, `packages/*`, `services/*`). If detected, mark `is_monorepo: true`.
3. **Discover Persistence Layer:** Locate migration directories, ORM schemas, SQL scripts, protobufs, or OpenAPI specifications regardless of folder structure.
4. **Discover Entry Points & Scope Packages:** Identify all entry mechanisms (HTTP handlers, RPC methods, event listeners, CLI interfaces, background jobs). For monorepos, explicitly group entry points under their package root (e.g., `[package: services/auth]`).
5. **Discover Shared Utilities & Infrastructure:** Identify shared helpers, base database clients, ORM abstractions, security utilities, and interceptors to catalog for `cap-000-*` extraction in Phase 2.
6. Output the discovered map to `openspec/specs/SYSTEM_MAP.md` and record the **`.detected_ecosystem`**.

**Output Schema (`openspec/specs/SYSTEM_MAP.md`):**
```markdown
---
type: system_map
version: 1.0.0
detected_ecosystem: "<e.g., Node/TypeScript + Go Monorepo | Java/Spring Multi-Module>"
is_monorepo: <true|false>
workspace_packages: ["<pkg_path_1>", "<pkg_path_2>"]
primary_languages: ["<lang_1>", "<lang_2>"]
entry_points_count: <number>
---

# System Map

## Discovered Modules & Infrastructure
- **Manifests & Configs:** `<file-list>`
- **Schemas / Migrations:** `<file-list>`
- **Primary Source Paths:** `<directory-list>`

## Shared Utilities & Infrastructure (`cap-000-*` Candidates)
- **Shared Helpers & Middleware:** `<file-list>`

## Discovered Entry Points

### [Package / Scope: root or services/auth]
- `<protocol/type> <path/event/command>` -> `<Handler/Function>` (`file:lines`)
```

**Human Prompt (STOP HERE):**

> Phase 1 Complete: System Map written to openspec/specs/SYSTEM_MAP.md.
> Identified Ecosystem: <detected_ecosystem> (Monorepo: <is_monorepo>)
> Review entry points and type 'yes' to proceed to Phase 2."