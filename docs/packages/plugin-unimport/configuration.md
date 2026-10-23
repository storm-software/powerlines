---
title: Configure the Unimport plugin
description: Options and config keys for the Unimport plugin.
documentType: concept
---

# Configure the Unimport plugin

The plugin reads options from the `unimport` config key. Options extend
`Partial<Omit<UnimportOptions, "presets">>` with required `presets`.

```ts
export default defineConfig({
  plugins: [unimport({ presets: [] })],
  unimport: {
    presets: []
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `presets` | Same as `unimport` | Required |
| `commentsDisable` | `string[]` | `["@unimport-disable", "@unimport-ignore", "@imports-disable", "@imports-ignore", "@powerlines-disable", "@powerlines-ignore"]` |
| `commentsDebug` | `string[]` | Debug magic comments, printed to console. |
| Any other `UnimportOptions` field | Same as `unimport` | unimport defaults |
