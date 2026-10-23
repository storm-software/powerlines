---
title: Configure @powerlines/plugin-rollup
description: Options for the rollup config block.
documentType: concept
---

# Configure @powerlines/plugin-rollup

Set options on the `rollup` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  rollup: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `RollupPluginOptions` | `Partial<RollupOptions> (./types/build)` | Rollup defaults |

`RollupPluginOptions` is `Partial<RollupOptions>` from `./types/build`. Every Rollup build field is valid here. See the Rollup docs and `./types/build` for the full list. The `rollup` config block is required once resolved. No Powerlines-side defaults are stated in the plugin source.
