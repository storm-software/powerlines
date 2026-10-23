---
title: Configure the Powerlines unplugin factory
description: Set the factory variant, virtual module prefix, and logger.
documentType: concept
---

# Configure the Powerlines unplugin factory

`createUnpluginFactory` accepts `UnpluginFactoryOptions`. It extends the base `Options` type from `@powerlines/core`. Only the fields declared in `src/unplugin.ts` are listed here.

## Options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `variant` | builder variant string | required | Selects the build tool or framework adapter. Must be a valid unplugin builder variant. |
| `virtualModulePrefix` | string or `false` | `"\0"` | Prefix for virtual module IDs. Set to `false` to disable prefixing. |
| `customLogger` | `CustomLogger` | — | Custom logger for build output. Falls back to the default Powerlines logger. |

The remaining fields come from the base `Options` type in `@powerlines/core`. That type was not inspected. See gaps in [api-reference](api-reference.md).

## Execution options

Each factory call accepts `UnpluginExecutionOptions`: the build inline config minus `command`, plus optional `cwd`, `configFile`, `framework`, `root`, and `configIndex`. `executionId` is omitted. The `-framework` and `orgId` fall back to `"powerlines"` and `"storm-software"` when neither the call params nor the factory options set them.

## Adapter behavior

Adapter modules (for example `src/vite.ts`) resolve host-specific options from the execution context with `resolveOptions`. The inspected Vite adapter maps Powerlines config to host settings: `define`, `root`, `platform`, `mode`, `cacheDir`, and build fields such as `minify`, `metafile`, `sourcemap`, `outDir`, and `tsconfig`. Other adapters follow the same pattern but were not inspected.
