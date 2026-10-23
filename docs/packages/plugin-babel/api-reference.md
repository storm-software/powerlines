---
title: babel API reference
description: Exports, hooks, and plugin factory for the Powerlines babel plugin.
documentType: recipe
---

# babel API reference

Package `@powerlines/plugin-babel` v0.13.213.

## Plugin factory

`plugin(options = {})` returns a single `Plugin` named `babel`. Helpers `getUniquePlugins`, `getUniquePresets`, `resolveBabelPlugin`, and `resolveBabelPreset` support custom transform wiring.

## Hooks

`config`, `configResolved` (order `pre`), `transform`. Files with `/* @powerlines-ignore */` or `/* @powerlines-disable */` skip transformation. `@babel/plugin-transform-json-modules` is added automatically unless config resolution is skipped.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and helper `filters`. |
| ``./helpers`` | Helper index (filters, options, module helpers). |
| ``./helpers/ast-utils`` | AST utilities. |
| ``./helpers/create-plugin`` | Create-plugin helper. |
| ``./helpers/filters`` | `includesPlugin`, `includesPreset`. |
| ``./helpers/module-helpers`` | Module resolution helpers. |
| ``./helpers/options`` | Unique-plugin/preset resolution. |
| ``./types`` | All public option and context types. |

> [!NOTE]
> Peer dependencies `@babel/plugin-syntax-jsx`, `@babel/plugin-syntax-typescript`, and `@babel/plugin-transform-json-modules` must be installed by the consumer.
