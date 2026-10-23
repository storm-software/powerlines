---
title: Tsdown plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-tsdown.
documentType: recipe
---

# Tsdown plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `TsdownPluginOptions`
(`Partial<TsdownOptions>`). Returns Powerlines plugins named `"tsdown"`.

```ts
import { plugin } from "@powerlines/plugin-tsdown";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default tsdown build configuration. |
| `configResolved` | Resolves entry points and output settings. |
| `build` | Runs the tsdown build. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/build` | `TsdownOptions` build types. |
| `./types/plugin` | `TsdownPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `TsdownPluginOptions` — plugin options (`Partial<TsdownOptions>`).
- `TsdownPluginUserConfig` — adds optional `tsdown` key to `UserConfig`.
- `TsdownPluginResolvedConfig` — resolved config with required `tsdown`.
- `TsdownPluginContext` — plugin context for the resolved config.
