---
title: env API reference
description: Exports, hooks, and plugin factory for the Powerlines env plugin.
documentType: recipe
---

# env API reference

Package `@powerlines/plugin-env` v0.16.425.

## Plugin factory

`plugin(options)` returns `Plugin[]`. Context exposes `env.config`, `env.secrets`, `env.parsed`, and `env.injected`. `extractEnv` runs at `configResolved`.

## Hooks

`config`, `configResolved`, `prepare`, `docs`, `buildEnd`. Registers `env:automd-generator`, `env:vite`, and the `automd` plugin. `docs` renders `env.md`. `buildEnd` writes active variables to disk.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin` and helpers. |
| ``./babel`` | Babel integration for env injection. |
| ``./babel/plugin`` | Env Babel plugin. |
| ``./components`` | Env builtin components. |
| `Other component paths` | See the export map for the full list. |

> [!NOTE]
> Exact `DotenvConfiguration` base fields were not inspected here. Confirm dotenv file-loading fields in `@stryke/env` before documenting further.
