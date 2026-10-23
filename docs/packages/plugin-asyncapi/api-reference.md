---
title: asyncapi API reference
description: Exports, hooks, and plugin factory for the Powerlines asyncapi plugin.
documentType: recipe
---

# asyncapi API reference

Package `@powerlines/plugin-asyncapi` v0.1.682.

## Plugin factory

`plugin(options)` requires options and returns `Plugin[]`: the Power Plant generator plus the `asyncapi` plugin object. Throws when `config.asyncapi.schema` is missing at `configResolved`.

## Hooks

`config`, `configResolved`. Delegates generation to the `power-plant` plugin. `configResolved` loads the schema from file or URL into `config.asyncapi.document` and forwards options to `config.powerplant`.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and all types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/plugin`` | `AsyncAPIPluginOptions`, user config, resolved config, context. |
