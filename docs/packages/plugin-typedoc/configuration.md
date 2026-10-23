---
title: Configure the TypeDoc plugin
description: Options and config keys for the TypeDoc plugin.
documentType: concept
---

# Configure the TypeDoc plugin

The plugin reads options from the `typedoc` config key. Options extend
`Partial<Omit<TypeDocOptions, "out">>`.

```ts
export default defineConfig({
  plugins: [typedoc({ outputPath: "docs/api" })],
  typedoc: {
    outputPath: "docs/api",
    basePath: "/docs/"
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `outputPath` | `string` | `"docs/generated/api-reference"` |
| `basePath` | `string` | `"/docs/"` |
| `override` | `Partial<TypeDocOptions>` | None. Overrides all other TypeDoc values. |
| Any `TypeDocOptions` field except `out` | Same as TypeDoc | TypeDoc defaults |

The resolved config renames `basePath` to `baseUrl` and requires both
`outputPath` and `baseUrl`.
