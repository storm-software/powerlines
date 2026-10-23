---
title: Configure the Unenv plugin
description: Options and config keys for the Unenv plugin.
documentType: concept
---

# Configure the Unenv plugin

The plugin reads options from the `unenv` config key.

```ts
export default defineConfig({
  plugins: [unenv({})],
  unenv: {
    // unenv environment options
  }
});
```

## Options

| Name | Type | Default |
| ---- | ---- | ------- |
| Any `CreateEnvOptions` field | Same as `unenv` | unenv defaults |

`UnenvPluginOptions` is `Partial<CreateEnvOptions>`. Every field is
optional. The resolved config stores the full `CreateEnvOptions` under
`unenv`.
