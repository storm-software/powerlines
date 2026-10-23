---
title: TypeDoc plugin API reference
description: Exports, plugin function, and hooks of @powerlines/plugin-typedoc.
documentType: recipe
---

# TypeDoc plugin API reference

## `plugin(options?)`

Creates the plugin. `options` accepts `TypeDocPluginOptions`. Returns a
Powerlines `Plugin` named `"typedoc"`.

```ts
import { plugin } from "@powerlines/plugin-typedoc";
```

## `generateDocs(options)`

Generates documentation pages from a TypeDoc `ProjectReflection`.

| Name | Type | Description |
| ---- | ---- | ----------- |
| `project` | `ProjectReflection` | Required. The reflection to render. |
| `outputPath` | `string` | Output directory. |
| `frontmatter` | `Record<string, any>` | Front matter for generated pages. |

## Hooks

| Hook | Purpose |
| ---- | ------- |
| `config` | Supplies default TypeDoc configuration. |
| `configResolved` | Resolves output path and base URL. |

## Export map

| Subpath | Contents |
| ------- | -------- |
| `.` | `plugin`, all public types. |
| `./types` | All public types. |
| `./types/plugin` | `TypeDocPluginOptions`, `GenerateDocsOptions`, configs, context. |
| `./package.json` | Package metadata. |

## Related types

- `TypeDocPluginOptions` — TypeDoc options plus `outputPath`, `basePath`, `override`.
- `GenerateDocsOptions` — inputs for `generateDocs`.
- `TypeDocPluginUserConfig` — adds `typedoc` key to `UserConfig`.
- `TypeDocPluginResolvedConfig` — resolved config with `outputPath`, `baseUrl`.
- `TypeDocPluginContext` — plugin context with `typedoc: Application`.
