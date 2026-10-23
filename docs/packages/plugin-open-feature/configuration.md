---
title: Configure @powerlines/plugin-open-feature
description: Options for the openFeature config block.
documentType: concept
---

# Configure @powerlines/plugin-open-feature

Set options on the `openFeature` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  openFeature: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `providers` | `Map<string, ProviderWrapper<Provider, ServerProviderStatus>>` | — |
| `automd` | `AutoMDPluginOptions` | — |
| `alloy` | `AlloyPluginOptions` | — |

`providers` is required in the resolved config but optional at input. Provider types come from `@openfeature/server-sdk`. The `automd` and `alloy` blocks configure composed doc and alloy handling. No defaults are stated in the plugin source.
