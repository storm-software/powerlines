---
title: Unimport plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-unimport.
documentType: recipe
---

# Unimport plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `UnimportPluginOptions` with
required `presets`. Returns a Powerlines `Plugin` named `"unimport"`.

```ts
import { plugin } from "@powerlines/plugin-unimport";
```

## `dumpImports`

The plugin context exposes `dumpImports()`, which writes the current
import dump. `lastImportsDump` holds the last dump string.

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default auto-import configuration. |
| `configResolved` | Resolves presets and import scanning. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `UnimportPluginOptions`, `UnimportContext`, configs. |
| `./package.json` | Package metadata. |

## Related types

- `UnimportPluginOptions` — unimport options with required `presets`, plus `commentsDisable`, `commentsDebug`.
- `UnimportContext` — `Unimport` instance plus `dumpImports` and `lastImportsDump`.
- `UnimportPluginUserConfig` — adds `unimport` key to `UserConfig`.
- `UnimportPluginResolvedConfig` — resolved config with `unimport`.
- `UnimportPluginContext` — plugin context with `unimport: UnimportContext`.
