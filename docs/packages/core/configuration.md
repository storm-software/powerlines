---
title: Configure core
description: Core config types, plugin registration shapes, and storage presets.
documentType: concept
---

# Configure core

Core defines the config contract. The engine and the facade consume it. Plugin authors implement against it.

## Config layers

Three types describe one pipeline:

- `UserConfig`: what developers write in `powerlines.config.ts`.
- `ResolvedConfig`: the merged result after plugin `config` hooks run.
- `InlineConfig`: per-command runtime config. Command variants (`BuildInlineConfig`, `TestInlineConfig`, and others) add command-specific fields. `CreateInlineConfig` requires `root`.

`ExecutionOptions` adds `root`, `configFile`, `executionId`, `configIndex`, `name`, and an optional non-serializable `logFn`. Pass `logFn` directly to the execution context. Do not expect it to survive cloning or serialization.

## Plugin registration

`PluginConfig` accepts many shapes:

```ts
import type { PluginConfig } from "@powerlines/core";

const plugins: PluginConfig[] = [
  "my-plugin",
  myPluginFactory,
  myPlugin,
  [myPluginFactory, { verbose: true }],
  { plugin: "my-plugin", options: { verbose: true } },
  { plugin: myPlugin }
];
```

Factories return a plugin or plugin array, synchronously or as a promise.

## Plugin hooks

Key hooks from the `Hooks` interface:

| Hook | Purpose |
| --- | --- |
| `config` | Return partial config to merge. Do not register new plugins here. |
| `configEnvironment` | Adjust one named environment. |
| `configResolved` | Observe the final config. |
| `build` | Run build steps with `pre`, `normal`, or `post` order. |
| `types` | Override the generated `.d.ts` output. |

Hook handlers can be plain functions or `{ order, filter, handler }` objects. Use `filter` to limit `transform` and `resolveId` calls by file pattern.

## Storage presets

`OutputConfig.storage` accepts `"fs"`, `"virtual"`, or a custom `StoragePort`. The default is `"virtual"`. Use `"fs"` when artifacts must reach disk. Set `output.overwrite: false` to skip files that already exist.

## Logging

`logLevel` accepts a label (`"info"`, `"debug"`, `"silent"`, and others) or a per-category object. `EngineOptions.customLogger` replaces the default logger. `ExecutionOptions.logFn` adds a per-execution log function.

## Gaps

- The full hook list in `src/types/plugin.ts` extends beyond this page. Read that file before you implement transform or resolve hooks.
- `compatibilityDate` accepted values come from the `compatx` package. This doc set does not enumerate them.
