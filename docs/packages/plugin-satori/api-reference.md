---
title: Satori plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-satori.
documentType: recipe
---

# Satori plugin API reference

## `plugin(options)`

Creates the plugin. `options` accepts `SatoriPluginOptions` with required
`path`. Returns a Powerlines `Plugin` named `"satori"`.

```ts
import { plugin } from "@powerlines/plugin-satori";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Satori configuration. |
| `configResolved` | Resolves component paths into `inputs`. |
| `prepare` | Generates output images from components. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/module` | Satori component module types. |
| `./types/plugin` | `SatoriPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `SatoriPluginOptions` — `path`, `outputPath`, `defaultOptions`.
- `SatoriPluginUserConfig` — adds `satori` key to `UserConfig`.
- `SatoriPluginResolvedConfig` — resolved config with `inputs: string[]`.
- `SatoriPluginContext` — plugin context for the resolved config.
