---
title: powerlines API reference
description: Functions and entry points exported by the powerlines package.
documentType: recipe
---

# powerlines API reference

Import from `powerlines` or from a focused subpath. All examples use public export paths.

## Engine

### `createPowerlines(options)`

Creates a running engine and logs its version. Re-exported from `powerlines/engine`.

```ts
import { createPowerlines } from "powerlines/engine";

const engine = await createPowerlines({ cwd: process.cwd() });
await engine.build({ command: "build", root: process.cwd() });
await engine.finalize();
```

- Input: `Omit<EngineOptions, "framework">`. Common fields: `cwd`, `root`, `host`, `port`, `customLogger`.
- Returns: `Promise<PowerlinesEngine>`.
- Side effects: starts the engine context and WebSocket host, logs the framework name and version.

### `PowerlinesEngine` methods

Each method takes an inline config and runs matching executions:

| Method | Config type | Purpose |
| --- | --- | --- |
| `create` | `PartialKeys<CreateInlineConfig, "command">` | Scaffold a project. |
| `types` | `PartialKeys<TypesInlineConfig, "command">` | Generate declaration files. |
| `prepare` | `PartialKeys<PrepareInlineConfig, "command">` | Initialize resources. |
| `clean` | `PartialKeys<CleanInlineConfig, "command">` | Remove artifacts. |
| `lint` | `PartialKeys<LintInlineConfig, "command">` | Lint sources. |
| `test` | `PartialKeys<TestInlineConfig, "command">` | Run tests. |
| `build` | `PartialKeys<BuildInlineConfig, "command">` | Build the project. |
| `docs` | `PartialKeys<DocsInlineConfig, "command">` | Generate docs. |
| `deploy` | `PartialKeys<DeployInlineConfig, "command">` | Prepare and deploy artifacts. |
| `finalize` | none | Run final cleanup. |

`CreateInlineConfig` requires `root`. On failure the engine logs the invocation ID and execution ID, marks the execution complete, and rethrows the error.

## Config

### `defineConfig(config)`

Type-safe config helper from `powerlines/config`.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({ input: "src/index.ts" });
```

Accepts an object, array, promise, or function form. Returns the input unchanged with full types.

## Plugin utilities

`powerlines/plugin-utils` re-exports core plugin helpers: `resolvePluginConfig`, `combinePlugins`, `enablePlugin`, `extend`, `merge`, `filter`, `modules`, `paths`, `virtual`, `build-helpers`, `context-helpers`, `docs-helper`, `get-config-path`, `helpers`, `install`, `logging`, `format`, and `format-package-json`. Use them to compose and inspect plugins instead of writing custom merge logic.

## Storage

`powerlines/storage` re-exports core storage: `BaseStorageAdapter`, `VirtualStorageAdapter`, file-system adapters, and helpers such as `ignoreNotfound` and `ignoreExists`. Use `output.storage: "virtual"` for in-memory builds or `"fs"` for disk writes.

## Types

`powerlines/types` exposes `UserConfig`, `ResolvedConfig`, `InlineConfig` and its command variants, `Plugin`, `Hooks`, context types, and logging types. Import types from this subpath to keep type-only imports separate from runtime code.

## Bundler adapters

Each adapter subpath re-exports `@powerlines/unplugin`: `powerlines/vite`, `powerlines/rollup`, `powerlines/rolldown`, `powerlines/esbuild`, `powerlines/webpack`, `powerlines/rspack`, `powerlines/farm`, `powerlines/tsup`, `powerlines/tsdown`, `powerlines/astro`, `powerlines/nuxt`, `powerlines/next`, and `powerlines/unplugin`. Register the default export with the matching bundler.

## Gaps

- Command-specific option fields beyond `command` and `root` are not enumerated here. Read the `*InlineConfig` types for exact inputs.
- Adapter registration signatures live in `@powerlines/unplugin`, which this doc set does not cover. Treat adapter options as unverified.
