---
title: Configure the Tsdown plugin
description: Options and config keys for the Tsdown plugin.
documentType: concept
---

# Configure the Tsdown plugin

The plugin reads options from the `tsdown` config key.

```ts
export default defineConfig({
  plugins: [tsdown({ dts: true })],
  tsdown: {
    // tsdown configuration values
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any tsdown `UserConfig` field | Same as tsdown | tsdown defaults |

`TsdownPluginOptions` is `Partial<TsdownOptions>`. Every field is optional.
The resolved config stores the full `TsdownOptions` under `tsdown`.

> [!NOTE]
> Gap: the exact extra fields of the local `TsdownOptions` type in
> `./types/build` (beyond the wrapped tsdown `UserConfig`) were not
> confirmed. Check `src/types/build.ts` for the full list.
