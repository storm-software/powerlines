---
title: deepkit API reference
description: Exports, hooks, and plugin factory for the Powerlines deepkit plugin.
documentType: recipe
---

# deepkit API reference

Package `@powerlines/plugin-deepkit` v0.11.560.

## Plugin factory

`plugin(options = {})` returns `Plugin[]`: the `tsc` plugin plus the `deepkit` plugin object. Resolved config exposes both `deepkit` and `tsc` sections.

## Hooks

`config`, `configResolved` (order `post`). Composes the `tsc` plugin. Pushes the Deepkit `transformer` to `tsc.transformers.before` and `declarationTransformer` to `after`. Marks `@power-plant/schema/deepkit` external.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and all types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/plugin`` | `DeepkitPluginOptions`, user config, resolved config, context. |

> [!NOTE]
> Individual `TypeScriptCompilerPluginOptions` fields were not inspected here. Confirm them in `@powerlines/plugin-tsc` before documenting further.
