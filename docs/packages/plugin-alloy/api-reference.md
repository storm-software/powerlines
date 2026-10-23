---
title: alloy API reference
description: Exports, hooks, and plugin factory for the Powerlines alloy plugin.
documentType: recipe
---

# alloy API reference

Package `@powerlines/plugin-alloy` v0.26.314.

## Plugin factory

Returns `Plugin[]`. It bundles `babel()` and an `alloy` plugin object. `config` merges user options into `config.alloy`, forces Babel presets for Alloy JSX, and marks Alloy packages external. `configResolved` sets `compilerOptions.jsx` to `preserve` in the project tsconfig.

## Hooks

`config`, `configResolved`. The plugin also registers the `babel` plugin and sets JSX `preserve` in tsdown and tsconfig.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` (default) and all types. |
| ``./core`` | Core Alloy rendering components. |
| ``./core/components`` | Shared Alloy components. |
| ``./core/components/infrastructure-file`` | Infrastructure file component. |

> [!NOTE]
> Exact codegen fields come from `PowerPlantAlloyJsOptions` (`@power-plant/alloy-js`), which this package re-exports as `PowerPlantAlloyOptions` but which was not inspected here. Confirm `template` and `outputPath` names against that package before use.
