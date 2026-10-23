---
title: Configure @powerlines/plugin-rolldown
description: Options for the rolldown config block.
documentType: concept
---

# Configure @powerlines/plugin-rolldown

Set options on the `rolldown` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  rolldown: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `RolldownPluginOptions` | `Partial<RolldownOptions> (./types/build)` | Rolldown defaults |

`RolldownPluginOptions` is `Partial<RolldownOptions>` from `./types/build`. Every Rolldown build field is valid here. See the Rolldown docs and `./types/build` for the full list. The `rolldown` config block is required once resolved. No Powerlines-side defaults are stated in the plugin source.
