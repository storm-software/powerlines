---
title: Configure the Unbuild plugin
description: Options and config keys for the Unbuild plugin.
documentType: concept
---

# Configure the Unbuild plugin

The plugin reads options from the `unbuild` config key.

```ts
export default defineConfig({
  plugins: [unbuild({ clean: true })],
  unbuild: {
    // unbuild configuration values
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any unbuild option field | Same as unbuild | unbuild defaults |

`UnbuildPluginOptions` is `Partial<UnbuildOptions>`. Every field is
optional. The resolved config stores the full `UnbuildOptions` under
`unbuild`.

> [!NOTE]
> Gap: the exact extra fields of the local `UnbuildOptions` type in
> `./types/build` (beyond the wrapped unbuild options) were not confirmed.
> Check `src/types/build.ts` for the full list.
