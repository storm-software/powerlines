---
title: hey-api API reference
description: Exports, hooks, and plugin factory for the Powerlines hey-api plugin.
documentType: recipe
---

# hey-api API reference

Package `@powerlines/plugin-hey-api` v0.1.632.

## Plugin factory

`plugin(options)` returns `Plugin[]`: the Power Plant generator plus the `hey-api` plugin object. Throws at `configResolved` when the schema cannot be resolved.

## Hooks

`configResolved`. Delegates to the `power-plant` plugin. Resolves the schema (URL fetch or inline document), fills missing `operationId` values from operation summaries, and forwards options to `config.powerplant`. Exact `config`-hook defaults were not confirmed.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, helpers, and types. |
| ``./helpers`` | Helper index. |
| ``./helpers/create-operation-id`` | `createOperationId` derived from operation summaries. |
| ``./package.json`` | Package manifest. |
| ``./types`` | All public option and context types. |

> [!NOTE]
> The `config`-hook defaults and the exact accepted `schema` input shapes were not fully inspected. Confirm against `@hey-api/openapi-ts` input types before documenting further.
