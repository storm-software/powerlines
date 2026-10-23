---
title: Configure @powerlines/plugin-marked
description: Options for the marked config block.
documentType: concept
---

# Configure @powerlines/plugin-marked

Set options on the `marked` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  marked: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `MarkedPluginOptions` | `MarkedOptions & MarkedExtension (marked)` | marked defaults |

The options type is a direct alias of the `marked` library types (`MarkedOptions & MarkedExtension`). Every field the `marked` package accepts is valid here. See the `marked` docs for the full field list. No Powerlines-side defaults are stated in the plugin source.
