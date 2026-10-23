---
title: Powerlines plugin helper API reference
description: Plugin factory, option types, and import paths of @powerlines/plugin-plugin.
documentType: recipe
---

# Powerlines plugin helper API reference

Package: `@powerlines/plugin-plugin`. The package description is "A package containing a Powerlines plugin to assist in developing other Powerlines plugins."

## Functions

### `plugin<TContext>(options?)`

Creates the plugin array for a Powerlines plugin project. Defined in `src/index.ts`.

- `options: PluginPluginOptions = {}` — tsdown options plus the optional `types` field. See [configuration](configuration.md).
- Returns `Plugin<TContext>[]` with two entries: the tsdown plugin and the `"plugin"` defaults plugin.
- The defaults plugin defines a `config()` hook (supplies the default config) and a `configResolved` hook with order `"pre"` (resolves the default entry input).

## Types

From `src/types/plugin.ts`, re-exported through the entry (`export type * from "./types"`):

| Type | Shape |
| --- | --- |
| `PluginPluginOptions` | Extends `TsdownPluginOptions`. Adds optional `types?: PluginPluginTypesOptions`. |
| `PluginPluginTypesOptions` | Optional `options` and `userConfig` file references (`FileReferenceInput` from `@stryke/types/configuration`). |
| `PluginPluginUserConfig` | Extends `TsdownPluginUserConfig`. Adds optional `plugin?: PluginPluginOptions`. |
| `PluginPluginResolvedConfig` | Extends `TsdownPluginResolvedConfig`. Adds required `plugin: PluginPluginOptions`. |
| `PluginPluginContext` | `TsdownPluginContext<TResolvedConfig>` over the resolved config. Defaults to `PluginPluginResolvedConfig`. |

## Import paths

From the `exports` map in `package.json`:

- `@powerlines/plugin-plugin` — the `plugin` factory and all re-exported types.
- `@powerlines/plugin-plugin/types` — the types entry.
- `@powerlines/plugin-plugin/types/plugin` — the plugin option and config types.

## Gaps

- `TsdownPluginOptions`, `TsdownPluginUserConfig`, `TsdownPluginResolvedConfig`, and `TsdownPluginContext` come from `@powerlines/plugin-tsdown`. That package is outside this task. Their fields are unknown.
- No tests or config examples for this package were inspected. The quick-start config shape is illustrative, not verified.
- The README build and test commands (`nx build plugin-plugin`, `nx test plugin-plugin`) were not verified against runnable targets. `project.json` defines only `nx-release-publish`.
