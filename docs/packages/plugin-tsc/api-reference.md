---
title: TSC plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-tsc.
documentType: recipe
---

# TSC plugin API reference

## `plugin(options)`

Creates the plugin. `options` accepts `TypeScriptCompilerPluginOptions`
with required `typeCheck`. Returns a Powerlines `Plugin` named `"tsc"`.

```ts
import { plugin } from "@powerlines/plugin-tsc";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default TypeScript compiler configuration. |
| `lint` | Type-checks the codebase. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./helpers` | Helper utilities. |
| `./helpers/type-check` | Type-check helpers. |
| `./types` | All public types. |
| `./types/plugin` | `TypeScriptCompilerPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `TypeScriptCompilerPluginOptions` — transpile options plus `filter`, `order`, `typeCheck`.
- `TypeScriptCompilerPluginUserConfig` — adds `tsc` key to `UserConfig`.
- `TypeScriptCompilerPluginResolvedConfig` — resolved config with `tsc`.
- `TypeScriptCompilerPluginContext` — plugin context for the resolved config.
