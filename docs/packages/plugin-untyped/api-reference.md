---
title: Untyped plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-untyped.
documentType: recipe
---

# Untyped plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `UntypedPluginOptions` with optional
`schema` and `outputPath`. Returns a Powerlines `Plugin` named `"untyped"`.

```ts
import { plugin } from "@powerlines/plugin-untyped";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Untyped configuration. |
| `configResolved` | Resolves schema paths. |
| `prepare` | Generates output files from schemas. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `UntypedPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `UntypedPluginOptions` — `schema`, `outputPath`.
- `UntypedPluginUserConfig` — adds `untyped` key to `UserConfig`.
- `UntypedPluginResolvedConfig` — resolved config with `untyped`.
- `UntypedPluginContext` — plugin context with `untyped` generate action.
