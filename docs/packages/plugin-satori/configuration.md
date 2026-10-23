---
title: Configure the Satori plugin
description: Options and config keys for the Satori plugin.
documentType: concept
---

# Configure the Satori plugin

The plugin reads options from the `satori` config key.

```ts
export default defineConfig({
  plugins: [satori({ path: "src/og/**/*.tsx" })],
  satori: {
    path: "src/og/**/*.tsx",
    outputPath: "dist/og"
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `path` | `string \| string[]` | Required. Path or glob to Satori component files. |
| `outputPath` | `string` | Next to each component file. |
| `defaultOptions` | `Partial<SatoriOptions>` | None. Shared Satori options for all components. |

`path` accepts one path, one glob, or an array of both. The resolved config
adds an `inputs` array with the resolved component file paths.
