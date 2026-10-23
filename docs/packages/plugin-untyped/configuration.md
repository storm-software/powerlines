---
title: Configure the Untyped plugin
description: Options and config keys for the Untyped plugin.
documentType: concept
---

# Configure the Untyped plugin

The plugin reads options from the `untyped` config key.

```ts
export default defineConfig({
  plugins: [untyped({ outputPath: "dist/generated" })],
  untyped: {
    schema: "src/config/*.untyped.ts",
    outputPath: "dist/generated"
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `schema` | `string \| string[]` | `"{root}/**/{untyped.ts,*.untyped.ts}"` |
| `outputPath` | `string` | Next to each schema file. |

`schema` accepts one path, one glob, or an array of both.
