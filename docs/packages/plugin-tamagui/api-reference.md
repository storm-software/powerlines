---
title: Tamagui plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-tamagui.
documentType: recipe
---

# Tamagui plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `TamaguiPluginOptions`
(`Partial<TamaguiOptions>` plus `platform` and `components`). Returns a
Powerlines `Plugin` named `"tamagui"`.

```ts
import { plugin } from "@powerlines/plugin-tamagui";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Tamagui configuration. |
| `configResolved` | Resolves platform and component paths. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `TamaguiPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `TamaguiPluginOptions` — Tamagui options plus `platform`, `components`.
- `TamaguiPluginUserConfig` — adds `tamagui` key to `UserConfig`.
- `TamaguiPluginResolvedConfig` — resolved config with required `platform`.
- `TamaguiPluginContext` — plugin context for the resolved config.
