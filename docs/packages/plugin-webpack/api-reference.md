---
title: Webpack plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-webpack.
documentType: recipe
---

# Webpack plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `WebpackPluginOptions`
(`Partial<WebpackOptions>`). Returns Powerlines plugins named `"webpack"`.

```ts
import { plugin } from "@powerlines/plugin-webpack";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Webpack build configuration. |
| `build` | Runs the Webpack build. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./helpers` | Build helper utilities. |
| `./helpers/resolve-options` | Option resolution helpers. |
| `./helpers/unplugin` | Unplugin integration helpers. |
| `./types` | All public types. |
| `./types/build` | `WebpackOptions` build types. |
| `./types/plugin` | `WebpackPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `WebpackPluginOptions` — plugin options (`Partial<WebpackOptions>`).
- `WebpackPluginUserConfig` — adds optional `webpack` key to `UserConfig`.
- `WebpackPluginResolvedConfig` — resolved config with required `webpack`.
- `WebpackPluginContext` — plugin context for the resolved config.
