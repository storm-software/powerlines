---
title: Powerlines packages overview
description: Map of the powerlines, core, and engine packages, their consumers, and their relationships.
documentType: concept
---

# Powerlines packages overview

Powerlines is a build toolkit and runtime for TypeScript applications. It executes build tasks through an engine, extends behavior through plugins, and generates code modules for bundlers.

Three packages form the core stack. Each page below covers one package in depth.

| Package | npm name | Entry point | Role |
| --- | --- | --- | --- |
| powerlines | `powerlines` | `powerlines` | Public facade. Re-exports core, config, plugin utilities, storage, and engine helpers. |
| core | `@powerlines/core` | `@powerlines/core` | Shared types, contexts, config loader, plugin utilities, and storage adapters. |
| engine | `@powerlines/engine` | `@powerlines/engine` | Command orchestration. Runs `create`, `types`, `prepare`, `clean`, `lint`, `test`, `build`, `docs`, and `deploy`. |

## powerlines

The `powerlines` package is the public entry point. Use it in application code.

It re-exports `@powerlines/core` from its root entry (`src/index.ts`). It also exposes focused subpaths: `powerlines/config`, `powerlines/engine`, `powerlines/plugin-utils`, `powerlines/storage`, `powerlines/types`, `powerlines/utils`, `powerlines/helpers`, `powerlines/constants`, `powerlines/schema`, and bundler adapters (`powerlines/vite`, `powerlines/rollup`, `powerlines/rolldown`, `powerlines/esbuild`, `powerlines/webpack`, `powerlines/rspack`, `powerlines/farm`, `powerlines/tsup`, `powerlines/tsdown`, `powerlines/astro`, `powerlines/nuxt`, `powerlines/next`, `powerlines/unplugin`). These adapter subpaths re-export the `@powerlines/unplugin` package, which the `powerlines` package depends on.

Intended consumers: application developers and plugin authors who want one stable import surface.

Start with [powerlines installation](./powerlines/installation.md) and [powerlines quick start](./powerlines/quick-start.md).

## core

The `@powerlines/core` package holds shared building blocks. The manifest marks it as internal and points public users to `powerlines`.

It provides `UserConfig`, `ResolvedConfig`, `InlineConfig` variants, plugin and hook types, context classes, the `defineConfig` helper (`@powerlines/core/lib/config`), storage adapters (`@powerlines/core/storage`), and plugin utilities (`@powerlines/core/plugin-utils`).

Intended consumers: the engine, the `powerlines` facade, bundler adapters, and advanced plugin authors who need context or storage types.

Start with [core installation](./core/installation.md) and [core quick start](./core/quick-start.md).

## engine

The `@powerlines/engine` package runs commands. It depends on `@powerlines/core` (`workspace:*` in its manifest).

Its main export is `PowerlinesEngine`, with one method per command: `create`, `types`, `prepare`, `clean`, `lint`, `test`, `build`, `docs`, `deploy`, plus `finalize`. Use `createEngine(options)` to build an engine, or `createPowerlines(options)` from `powerlines/engine` for the facade wrapper. Execution workers run each command through `createApi` handlers with `EngineExecutionOptions`.

Intended consumers: CLIs, dev servers, and hosts that orchestrate Powerlines commands.

Start with [engine installation](./engine/installation.md) and [engine quick start](./engine/quick-start.md).

## Dependency relationships

```text
powerlines ──depends on──> @powerlines/core
powerlines ──depends on──> @powerlines/engine
powerlines ──depends on──> @powerlines/unplugin
@powerlines/engine ──depends on──> @powerlines/core
```

`powerlines` re-exports `@powerlines/core` at its root. The engine imports command config types (`BuildInlineConfig`, `CleanInlineConfig`, and others) from `@powerlines/core`. Plugin packages consume core types and run inside engine execution contexts.

## Gaps

- Published version numbers and peer dependency ranges are not verified here. Check each `package.json` at install time.
- Runtime requirements (Node.js version, ESM/CJS interop) are not stated in the inspected manifests. Treat them as unverified.
