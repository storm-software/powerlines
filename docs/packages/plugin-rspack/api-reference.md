---
title: Rspack plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-rspack.
documentType: recipe
---

# Rspack plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `RspackPluginOptions`
(`Partial<RspackOptions>`). Returns a Powerlines `Plugin` named `"rspack"`.

```ts
import { plugin } from "@powerlines/plugin-rspack";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Rspack build configuration. |
| `build` | Runs the Rspack build. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./helpers` | Build helper utilities. |
| `./helpers/resolve-options` | Option resolution helpers. |
| `./helpers/unplugin` | Unplugin integration helpers. |
| `./types` | All public types. |
| `./types/build` | `RspackOptions` build types. |
| `./types/plugin` | `RspackPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `RspackPluginOptions` — plugin options (`Partial<RspackOptions>`).
- `RspackPluginUserConfig` — adds optional `rspack` key to `UserConfig`.
- `RspackPluginResolvedConfig` — resolved config with required `rspack`.
- `RspackPluginContext` — plugin context for the resolved config.
