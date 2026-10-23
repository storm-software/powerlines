---
title: SWC plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-swc.
documentType: recipe
---

# SWC plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `SwcPluginOptions`
(`Partial<Omit<Options, "filename">>` from `@swc/core`). Returns a
Powerlines `Plugin` named `"swc"`.

```ts
import { plugin } from "@powerlines/plugin-swc";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default SWC transform configuration. |

> [!NOTE]
> Gap: the exact transform hook the plugin uses to apply SWC was not
> confirmed from the inspected surface. Check `src/index.ts` for details.

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `SwcPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `SwcPluginOptions` — SWC transform options without `filename`.
- `SwcPluginUserConfig` — adds optional `swc` key to `UserConfig`.
- `SwcPluginResolvedConfig` — resolved config with optional `swc`.
- `SwcPluginContext` — plugin context for the resolved config.
