---
title: eslint API reference
description: Exports, hooks, and plugin factory for the Powerlines eslint plugin.
documentType: recipe
---

# eslint API reference

Package `@powerlines/plugin-eslint` v0.8.682.

## Plugin factory

`plugin(options)` returns the `eslint` plugin object. Results are formatted per file and either written to `outputFile` or logged.

## Hooks

`lint`. Lints project TypeScript files excluding artifacts and `node_modules`. Supports flat and legacy ESLint via `loadESLint`. Context exposes `this.eslint`.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and helpers. |
| ``./helpers`` | Helper index. |
| ``./helpers/format-message`` | Lint-message formatter. |
| ``./package.json`` | Package manifest. |
| ``./types`` | Type index (resolved from export map). |

> [!NOTE]
> The `config`/`configResolved` hook that stores the ESLint instance was not fully inspected. The `./types` subpath contents were inferred from the export map, not read.
