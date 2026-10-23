---
title: Configure the Webpack plugin
description: Options and config keys for the Webpack plugin.
documentType: concept
---

# Configure the Webpack plugin

The plugin reads options from the `webpack` config key.

```ts
export default defineConfig({
  plugins: [webpack({ mode: "production" })],
  webpack: {
    // Webpack configuration values
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any Webpack `Configuration` field | Same as Webpack | Webpack defaults |

`WebpackPluginOptions` is `Partial<WebpackOptions>`. Every field is
optional. The resolved config stores the full `WebpackOptions` under
`webpack`.

> [!NOTE]
> Gap: the exact extra fields of the local `WebpackOptions` type in
> `./types/build` (beyond the wrapped Webpack `Configuration`) were not
> confirmed. Check `src/types/build.ts` for the full list.
