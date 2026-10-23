---
title: Powerlines Nx plugin API reference
description: Executors, generator, plugin entry, and import paths of @powerlines/nx.
documentType: recipe
---

# Powerlines Nx plugin API reference

Package: `@powerlines/nx`. Source entry: `src/index.ts`, which re-exports `./base`, `./helpers`, and `./types`.

## Executors

Registered in `executors.json`. Each implementation lives at `./dist/src/executors/<name>/executor` with a schema at `./dist/src/executors/<name>/schema.json`.

| Executor | Description |
| --- | --- |
| `clean` | Run the `clean` Powerlines command on the given project. |
| `prepare` | Run the `prepare` Powerlines command on the given project. |
| `lint` | Run the `lint` Powerlines command on the given project. |
| `build` | Run the `build` Powerlines command on the given project. |
| `docs` | Run the `docs` Powerlines command on the given project. |

Run any executor with `nx run my-project:<name>`. Option fields for `build` are listed in [configuration](configuration.md). Option fields for the other four executors were not inspected.

## Generators

Registered in `generators.json`:

| Generator | Factory | Description |
| --- | --- | --- |
| `typescript-sync` (alias `sync`, hidden) | `./dist/src/generators/sync/generator` | Synchronize Powerlines projects based on the project graph. |

The generator schema (`src/generators/sync/schema.json`) was not inspected.

## Plugin entry

`createNodesV2` (from `@powerlines/nx/plugin`) creates the Nx plugin nodes for the `powerlines` framework. Import path: `@powerlines/nx/plugin`.

## Import paths

From the `exports` map in `package.json`:

- `@powerlines/nx` or `@powerlines/nx/index` — package entry.
- `@powerlines/nx/plugin` — the Nx plugin (`createNodesV2`).
- `@powerlines/nx/base/*` — base executor code.
- `@powerlines/nx/types/*` — shared types.
- `@powerlines/nx/helpers/*` — helper utilities, including the plugin utilities.
- `@powerlines/nx/executors/*/executor` and `@powerlines/nx/executors/*/executor.js` (or `.mjs`) — direct executor access.
- `@powerlines/nx/executors/*/untyped` — untyped executor variants.
- `@powerlines/nx/generators/*/generator` and `@powerlines/nx/generators/*/generator.js` (or `.mjs`) — direct generator access.
- `@powerlines/nx/generators/*/untyped` — untyped generator variants.

## Gaps

- No `migrations.json` file exists in the package root, although `package.json` lists it under `files`. Migration steps are unknown.
- Executor schemas for `clean`, `prepare`, `lint`, and `docs` were not inspected. Their options are unknown.
- `src/base`, `src/helpers`, and `src/types` contents were not inspected beyond `index.ts` re-exports and the plugin entry. Exact helper functions and types are unknown.
- The README build and test commands use the project name `devkit-nx` (`nx build devkit-nx`, `nx test devkit-nx`), but `project.json` sets `"name": "nx"`. The correct target name in this repo is unverified.
