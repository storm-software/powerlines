---
title: Vite plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-vite.
documentType: recipe
---

# Vite plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `VitePluginOptions`
(`Partial<ViteOptions>`). Returns a Powerlines `Plugin` named `"vite"`.

```ts
import { plugin } from "@powerlines/plugin-vite";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Vite build configuration. |
| `build` | Runs the Vite build. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/_internal` | Internal types. Not a public API. |
| `./types/build` | `ViteOptions` build types. |
| `./types/plugin` | `VitePluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `VitePluginOptions` — plugin options (`Partial<ViteOptions>`).
- `VitePluginUserConfig` — adds optional `vite` key to `UserConfig`.
- `VitePluginResolvedConfig` — resolved config with required `vite`.
- `VitePluginContext` — plugin context with `dev: boolean`.
