---
title: cloudflare API reference
description: Exports, hooks, and plugin factory for the Powerlines cloudflare plugin.
documentType: recipe
---

# cloudflare API reference

Package `@powerlines/plugin-cloudflare` v0.6.324.

## Plugin factory

`plugin(options = {})` returns `Plugin[]`: `unenv`, Pulumi plugins, and the `cloudflare` plugin object. Context exposes `cloudflare.wrangler` and `cloudflare.workers`.

## Hooks

`config`, `configResolved`, `prepare`, `build` (order `pre`). Composes `unenv` and `pulumi` plugins. `prepare` extracts env and renders builtin modules. `build` resolves each entry to a Worker module.

## Export map

| Subpath | Contents |
| --- | --- |
| ``.`` | Main entry. Exports `plugin`, components, and types. |
| ``./components`` | Worker component index. |
| ``./components/cloudflare-builtin`` | Cloudflare builtin module component. |
| ``./components/env-builtin`` | Env builtin module component. |
| `Other component paths` | See the export map for the full list. |

> [!NOTE]
> Exact worker-module metadata fields were not fully inspected. Peer dependencies `wrangler`, `@cloudflare/unenv-preset`, `@cloudflare/workers-types`, and `zod` must be installed by the consumer.
