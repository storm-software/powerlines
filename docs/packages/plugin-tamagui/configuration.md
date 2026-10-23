---
title: Configure the Tamagui plugin
description: Options and config keys for the Tamagui plugin.
documentType: concept
---

# Configure the Tamagui plugin

The plugin reads options from the `tamagui` config key. Options extend
`Partial<TamaguiOptions>` from `@tamagui/types`.

```ts
export default defineConfig({
  plugins: [tamagui({ platform: "native" })],
  tamagui: {
    platform: "native",
    components: ["{root}/src/components"]
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `platform` | `"web" \| "native"` | `"web"` |
| `components` | `string[]` | `["{root}/src/components"]` |
| Any `TamaguiOptions` field | Same as `@tamagui/types` | Tamagui defaults |

`components` accepts glob patterns. Path tokens in each entry are resolved
with `replacePathTokens`.
