---
title: Style Dictionary plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-style-dictionary.
documentType: recipe
---

# Style Dictionary plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `StyleDictionaryPluginOptions`.
Returns Powerlines plugins named `"style-dictionary"`.

```ts
import { plugin } from "@powerlines/plugin-style-dictionary";
```

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default Style Dictionary configuration. |
| `configResolved` | Resolves token sources and custom extensions. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `StyleDictionaryPluginOptions`, custom builder types, configs, context. |
| `./package.json` | Package metadata. |

## Related types

- `StyleDictionaryPluginOptions` — tokens, `skipBuild`, custom extensions.
- `CustomActionsBuilder`, `CustomTransformsBuilder`, `CustomFormatsBuilder`, `CustomTransformGroupsBuilder`, `CustomFileHeadersBuilder`, `CustomFiltersBuilder`, `CustomParsersBuilder`, `CustomPreprocessorsBuilder` — extension builder functions.
- `StyleDictionaryPluginUserConfig` — adds `styleDictionary` key to `UserConfig`.
- `StyleDictionaryPluginResolvedConfig` — resolved config with `environments`.
