---
title: Configure @powerlines/plugin-oxc-transform
description: Options for the oxcTransform config block.
documentType: concept
---

# Configure @powerlines/plugin-oxc-transform

Set options on the `oxcTransform` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  oxcTransform: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `OxcTransformPluginOptions` | `Partial<TransformOptions> (oxc-transform)` | oxc defaults |

The options type is a direct alias of the `oxc-transform` `TransformOptions` type. Every field that package accepts is valid here. See the Oxc docs for the full field list. No Powerlines-side defaults are stated in the plugin source.
