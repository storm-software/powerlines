---
title: Unified plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-unified.
documentType: recipe
---

# Unified plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `UnifiedPluginOptions` with optional
`rules`. Returns a Powerlines `Plugin` named `"unified:config"`.

```ts
import { plugin } from "@powerlines/plugin-unified";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Registers Unified transform rules. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `UnifiedPluginOptions`, `UnifiedRule`, configs, context. |
| `./package.json` | Package metadata. |

## Related types

- `UnifiedRule` — `include`, `exclude`, `enforce`, `setup`, `transform`.
- `ResolvedUnifiedRule` — rule with `filter` and `processor` promise.
- `UnifiedPluginOptions` — optional `rules` array.
- `UnifiedPluginUserConfig` — adds `unified` key to `UserConfig`.
- `UnifiedPluginResolvedConfig` — resolved config with resolved `rules`.
- `UnifiedPluginContext` — plugin context for the resolved config.
