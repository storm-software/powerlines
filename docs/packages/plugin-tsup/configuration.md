---
title: Configure the Tsup plugin
description: Options and config keys for the Tsup plugin.
documentType: concept
---

# Configure the Tsup plugin

The plugin reads options from the `tsup` config key.

```ts
export default defineConfig({
  plugins: [tsup({ dts: true })],
  tsup: {
    // tsup configuration values
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any tsup build option field | Same as tsup | tsup defaults |

`TsupPluginOptions` is `Partial<TsupOptions>`. Every field is optional.
The resolved config stores the full `TsupOptions` under `tsup`.

> [!NOTE]
> Gap: the exact extra fields of the local `TsupOptions` type in
> `./types/build` (beyond the wrapped tsup `BuildOptions`) were not
> confirmed. Check `src/types/build.ts` for the full list.
