---
title: core API reference
description: Config loader, hooks, contexts, storage, and plugin utilities in @powerlines/core.
documentType: recipe
---

# core API reference

Group imports by subpath. Root `@powerlines/core` re-exports `./lib` and `./types`.

## Config loader (`@powerlines/core/lib/config`)

### `defineConfig(config)`

Returns the input unchanged with `UserConfig` types. Accepts an object, array, promise, or function form.

```ts
import { defineConfig } from "@powerlines/core/lib/config";

export default defineConfig({ input: "src/index.ts" });
```

### `loadUserConfigFile(...)`

Locates and loads the user config with a Jiti resolver. Searches project root and working directory for `powerlines.config.*` and mode variants. Returns an empty object when no file exists.

### `resolvePackageConfigs(...)`, `resolveRoot(...)`, `loadParsedConfig(...)`, `loadWorkspaceConfig(...)`

Use these when you build custom hosts. They resolve package configs, find the project root from config files, parse layers with `c12`, and load workspace config. Read function signatures in `src/lib/config.ts` before use. Exact parameter lists are not frozen in this reference.

## Hooks (`@powerlines/core/lib/hooks`)

### `mergeConfigs(currentResult, previousResults)`

Deep-merges two config results. Use it to combine sequential hook outputs.

### `mergeResults(...)`

Merges generic hook results. Prefer `mergeConfigs` for config objects.

### `callHook(...)`

Invokes a named hook across plugins in order. Handles `pre`, `normal`, and `post` ordering.

### `extractHooks(...)`

Collects hook handlers from a plugin list for one hook name.

## Contexts (`@powerlines/core/context`)

Subpaths: `context/base-context`, `context/context`, `context/environment-context`, `context/execution-context`, `context/plugin-context`. Execution contexts expose `config`, `command`, `inlineConfig`, `callHook`, `loadExecutions`, and `completeExecution`. Environment contexts add per-environment config and paths such as `entryPath`.

## Plugin base (`@powerlines/core/plugin-base`)

Exports a `plugin` factory and `BasePluginOptions`. The base plugin sets `projectType: "library"`, default input globs (`src/index.ts`, `src/types/*.ts`, `src/helpers/*.ts`), `platform: "node"`, and disables `dts` output. Extend it when you scaffold plugins for plugins.

```ts
import { plugin as basePlugin } from "@powerlines/core/plugin-base";

export default basePlugin({ tsdown: {} });
```

## Plugin utilities (`@powerlines/core/plugin-utils`)

| Subpath | Purpose |
| --- | --- |
| `plugin-utils` | Re-export hub. |
| `plugin-utils/combine-plugins` | Merge plugin arrays. |
| `plugin-utils/enable-plugin` | Activate a plugin conditionally. |
| `plugin-utils/extend` | Extend a plugin definition. |
| `plugin-utils/merge` | Merge plugin configs. |
| `plugin-utils/filter` | Filter plugins or hooks. |
| `plugin-utils/modules` | Module helpers. |
| `plugin-utils/paths` | Path helpers for plugins. |
| `plugin-utils/virtual` | Virtual module helpers. |
| `plugin-utils/build-helpers` | Build-phase helpers. |
| `plugin-utils/context-helpers` | `resolvePluginConfig` and context construction. |
| `plugin-utils/docs-helper` | Docs generation helpers. |
| `plugin-utils/get-config-path` | Locate config files. |
| `plugin-utils/helpers` | General helpers. |
| `plugin-utils/install` | Dependency install helpers. |
| `plugin-utils/logging` | `consoleLogger`, `formatExecutionId`, `getName`. |
| `plugin-utils/format` | Formatting helpers. |
| `plugin-utils/format-package-json` | Normalize generated `package.json`. |

## Storage (`@powerlines/core/storage`)

| Export | Subpath | Purpose |
| --- | --- | --- |
| `BaseStorageAdapter` | `storage/base` | Abstract adapter contract. |
| `VirtualStorageAdapter` | `storage/virtual` | In-memory adapter. |
| File-system adapter | `storage/file-system` | Disk-backed adapter. |
| `isFileError`, `ignoreNotfound`, `ignoreExists` | `storage/helpers` | Error guards for missing or duplicate files. |

```ts
import { ignoreNotfound } from "@powerlines/core/storage";

const text = await storage.getItem("output/bundle.js").catch(ignoreNotfound);
```

## Constants (`@powerlines/core/constants`)

Subpaths cover `api`, `commands`, `devtools`, `environments`, `extensions`, `fs`, `hooks`, `log-level`, `meta`, and `plugin`. They define supported command names, execution API method names, file extensions, and log levels. Import a constant instead of hard-coding a command string.

## Types (`@powerlines/core` root)

Key types: `UserConfig`, `ResolvedConfig`, `InlineConfig` and command variants, `ExecutionOptions`, `Plugin`, `PluginConfig`, `Hooks`, `PluginContext`, `ExecutionContext`, `EnvironmentContext`, `StoragePort`, `StoragePreset`, `LogLevelUserConfig`, `BaseCommandType`, `CommandType`, `SupportedCommands`. The `powerlines` package re-exports these types at its root.

## Gaps

- Parameter lists for loader and hook-runner functions are summarized, not quoted in full. Read `src/lib/config.ts` and `src/lib/hooks.ts` for exact signatures.
- `generate-types`, `resolver`, `typescript`, `unplugin`, `utilities`, `vfs`, `events`, `environment`, `meta`, `schemas`, and `install-dependencies` modules exist but lack test-backed usage examples. They are omitted rather than documented from guesses.
