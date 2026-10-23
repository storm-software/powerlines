---
title: i18next API reference
description: Exports, hooks, and plugin factory for the Powerlines i18next plugin.
documentType: recipe
---

# i18next API reference

Package `@powerlines/plugin-i18next` v0.1.575.

## Plugin factory

`plugin(options)` returns the `i18next` plugin object. Supports namespace merging with a warning when top-level keys are not namespaces.

## Hooks

Generates i18next TypeScript resources (`Resources` interface and `CustomTypeOptions` declaration) from parsed locale files during the build. Exact hook names were not confirmed.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, helpers, and types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/i18n`` | i18n resource types. |
| ``./types/plugin`` | `I18NextPluginOptions`, user config, resolved config, context. |

> [!NOTE]
> Hook names and the locale-file discovery rules were not confirmed from source. Confirm them in `src/index.ts` before documenting the workflow step.
