---
title: date API reference
description: Exports, hooks, and plugin factory for the Powerlines date plugin.
documentType: recipe
---

# date API reference

Package `@powerlines/plugin-date` v0.12.769.

## Plugin factory

`plugin(options = {})` returns `Plugin[]`: the `env` plugin plus the `date` plugin object. Resolved `date` config requires `type` and `defaultLocale`.

## Hooks

`config`, `configResolved`, `prepare`. Composes the `env` plugin. `configResolved` pins the selected date library as a dependency. `prepare` emits the matching date module as the `date` builtin.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, components, schemas, and types. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |
| ``./types/env`` | Env-related types. |
| ``./types/plugin`` | `DatePluginOptions`, user config, resolved config, context. |
