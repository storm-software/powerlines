---
title: Configure the SWC plugin
description: Options and config keys for the SWC plugin.
documentType: concept
---

# Configure the SWC plugin

The plugin reads options from the `swc` config key.

```ts
export default defineConfig({
  plugins: [swc({ jsc: { target: "es2022" } })],
  swc: {
    // SWC transform options
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any `@swc/core` `Options` field except `filename` | Same as `@swc/core` | SWC defaults |

`SwcPluginOptions` is `Partial<Omit<Options, "filename">>`. Every field is
optional. The `filename` field is omitted because the plugin sets it per
file.
