---
title: Unbuild plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-unbuild.
documentType: recipe
---

# Unbuild plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `UnbuildPluginOptions`
(`Partial<UnbuildOptions>`). Returns a Powerlines `Plugin` named
`"unbuild"`.

```ts
import { plugin } from "@powerlines/plugin-unbuild";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default unbuild configuration. |
| `build` | Runs the unbuild build. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./helpers` | Build helper utilities. |
| `./helpers/resolve-options` | Option resolution helpers. |
| `./types` | All public types. |
| `./types/build` | `UnbuildOptions` build types. |
| `./types/plugin` | `UnbuildPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `UnbuildPluginOptions` — plugin options (`Partial<UnbuildOptions>`).
- `UnbuildPluginUserConfig` — adds optional `unbuild` key to `UserConfig`.
- `UnbuildPluginResolvedConfig` — resolved config with required `unbuild`.
- `UnbuildPluginContext` — plugin context for the resolved config.
