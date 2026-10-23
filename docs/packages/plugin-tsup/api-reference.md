---
title: Tsup plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-tsup.
documentType: recipe
---

# Tsup plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `TsupPluginOptions`
(`Partial<TsupOptions>`). Returns Powerlines plugins named `"tsup"`.

```ts
import { plugin } from "@powerlines/plugin-tsup";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default tsup build configuration. |
| `build` | Runs the tsup build. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/build` | `TsupOptions` build types. |
| `./types/plugin` | `TsupPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `TsupPluginOptions` — plugin options (`Partial<TsupOptions>`).
- `TsupPluginUserConfig` — adds optional `tsup` key to `UserConfig`.
- `TsupPluginResolvedConfig` — resolved config with required `tsup`.
- `TsupPluginContext` — plugin context for the resolved config.
