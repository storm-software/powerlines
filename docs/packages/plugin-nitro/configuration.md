---
title: Configure @powerlines/plugin-nitro
description: Options for the nitro config block.
documentType: concept
---

# Configure @powerlines/plugin-nitro

Set options on the `nitro` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  nitro: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `configFile` | `string` | — |
| `(all other fields)` | `Omit<NitroConfig, root/compatibilityDate/logLevel/sourcemap/minify>` | Nitro defaults |

`NitroPluginOptions` extends the Nitro `NitroConfig` type minus `root`, `compatibilityDate`, `logLevel`, `sourcemap`, and `minify`. See the Nitro docs for the full field list. No Powerlines-side defaults are stated in the plugin source.
