---
title: Configure the Vite plugin
description: Options and config keys for the Vite plugin.
documentType: concept
---

# Configure the Vite plugin

The plugin reads options from the `vite` config key.

```ts
export default defineConfig({
  plugins: [vite({ singleBuild: true })],
  vite: {
    // Vite configuration values
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| `singleBuild` | `boolean` | Set by the plugin default config. |
| `optimizeDeps` | `Omit<DepOptimizationOptions, "extensions">` | Vite defaults. |
| Any Vite `UserConfig` field | Same as Vite | Vite defaults. |

`VitePluginOptions` is `Partial<ViteOptions>`. Every field is optional.
The resolved config stores the full `ViteOptions` under `vite`.

> [!NOTE]
> Gap: the exact extra fields of the local `ViteOptions` type in
> `./types/build` (beyond the wrapped Vite `UserConfig`) were not
> confirmed. Check `src/types/build.ts` for the full list.
