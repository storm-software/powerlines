---
title: Configure the Style Dictionary plugin
description: Options and config keys for the Style Dictionary plugin.
documentType: concept
---

# Configure the Style Dictionary plugin

The plugin reads options from the `styleDictionary` config key. It extends
the power-plant Style Dictionary options with the fields below.

```ts
export default defineConfig({
  plugins: [styleDictionary({ skipBuild: false })],
  styleDictionary: {
    tokens: {
      /* design tokens */
    }
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `tokens` | `DesignTokens` | Loaded from `source` / `include` paths. |
| `skipBuild` | `boolean` | `false` |
| `customActions` | `FileReferenceInput \| CustomActionsBuilder` | None |
| `customFileHeaders` | `FileReferenceInput \| CustomFileHeadersBuilder` | None |
| `customFilters` | `FileReferenceInput \| CustomFiltersBuilder` | None |
| `customFormats` | `FileReferenceInput \| CustomFormatsBuilder` | None |
| `customPreprocessors` | `FileReferenceInput \| CustomPreprocessorsBuilder` | None |
| `customParsers` | `FileReferenceInput \| CustomParsersBuilder` | None |
| `customTransformGroups` | `FileReferenceInput \| CustomTransformGroupsBuilder` | None |
| `customTransforms` | `FileReferenceInput \| CustomTransformsBuilder` | None |
| `environments` | `Record<string, StyleDictionaryPluginEnvironmentConfig>` | None |

Each `custom*` value is either a file reference to a module export or a
builder function that receives the plugin context.

> [!NOTE]
> Gap: the base power-plant Style Dictionary options fields were not
> enumerated here. Check `@power-plant/style-dictionary` for the full list.
