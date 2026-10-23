---
title: Stylelint plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-stylelint.
documentType: recipe
---

# Stylelint plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `StylelintPluginOptions`.
Returns a Powerlines `Plugin` named `"stylelint"`.

```ts
import { plugin } from "@powerlines/plugin-stylelint";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Stylelint configuration. |
| `lint` | Lints the codebase with Stylelint. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `StylelintPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `StylelintPluginOptions` — extends `Partial<LinterOptions>` with `configFile`, `outputFile`, `silent`, `fix`.
- `StylelintPluginUserConfig` — adds `stylelint` key to `UserConfig`.
- `StylelintPluginResolvedConfig` — resolved config with `stylelint`.
- `StylelintPluginContext` — plugin context for the resolved config.
