---
title: Configure @powerlines/plugin-power-plant
description: Options for the powerplant config block.
documentType: concept
---

# Configure @powerlines/plugin-power-plant

Set options on the `powerplant` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  powerplant: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `PowerPlantPluginOptions<TSpec, TOptions>` | `GeneratorConfig<TSpec, TOptions> (@power-plant/core)` | generator defaults |

`PowerPlantPluginOptions` is a generic alias of `GeneratorConfig` from `@power-plant/core`. Valid fields depend on the chosen generator. The plugin name becomes `power-plant:<name>` when a name is given. See `@power-plant/core` for the full field list. Generator-specific defaults live in that package.
