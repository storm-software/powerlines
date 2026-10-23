---
title: Configure the Rspack plugin
description: Options and config keys for the Rspack plugin.
documentType: concept
---

# Configure the Rspack plugin

The plugin reads options from the `rspack` config key.

```ts
export default defineConfig({
  plugins: [rspack({ mode: "production" })],
  rspack: {
    // Rspack configuration values
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any Rspack `Configuration` field | Same as `@rspack/core` | Rspack defaults |

`RspackPluginOptions` is `Partial<RspackOptions>`. Every field is optional.
The resolved config stores the full `RspackOptions` under `rspack`.

> [!NOTE]
> Gap: the exact extra fields of the local `RspackOptions` type in
> `./types/build` (beyond the wrapped `@rspack/core` configuration) were
> not confirmed. Check `src/types/build.ts` for the full list.
