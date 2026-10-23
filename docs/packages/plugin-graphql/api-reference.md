---
title: graphql API reference
description: Exports, hooks, and plugin factory for the Powerlines graphql plugin.
documentType: recipe
---

# graphql API reference

Package `@powerlines/plugin-graphql` v0.1.679.

## Plugin factory

`plugin(options)` returns `Plugin[]`: the Power Plant generator plus the `graphql` plugin object. Resolved `graphql` config carries `schema`, `filename`, and the loaded `document`.

## Hooks

`configResolved`. Delegates to the `power-plant` plugin. Loads SDL from file or URL into a `GraphQLSchema` document, expands `filename` tokens, and forwards codegen options to `config.powerplant`. Exact `config`-hook defaults were not confirmed.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and all types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/plugin`` | `GraphQLPluginOptions`, user config, resolved config, context. |

> [!NOTE]
> The `config`-hook defaults for this plugin were not inspected. Confirm the `schema` default before documenting it as required or optional.
