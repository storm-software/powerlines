---
title: Unenv plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-unenv.
documentType: recipe
---

# Unenv plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `UnenvPluginOptions`
(`Partial<CreateEnvOptions>` from `unenv`). Returns a Powerlines `Plugin`
named `"unenv"`.

```ts
import { plugin } from "@powerlines/plugin-unenv";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default unenv environment configuration. |
| `configResolved` | Resolves the platform-agnostic environment. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `UnenvPluginOptions`, user config, resolved config, context. |
| `./package.json` | Package metadata. |

## Related types

- `UnenvPluginOptions` — plugin options (`Partial<CreateEnvOptions>`).
- `UnenvPluginUserConfig` — adds `unenv` key to `UserConfig`.
- `UnenvPluginResolvedConfig` — resolved config with `unenv: CreateEnvOptions`.
- `UnenvPluginContext` — plugin context with `unenv: ReturnType<typeof defineEnv>`.
