---
title: Quick start with @powerlines/plugin-power-plant
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-power-plant

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as powerplant } from "@powerlines/plugin-power-plant";

export default defineConfig({
  plugins: [powerplant()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as powerplant } from "@powerlines/plugin-power-plant";

export default defineConfig({
  plugins: [powerplant()],
  powerplant: {
    // generator config; see @power-plant/core
  }
});
```

## Expected result

The configured generator runs and writes its output files. Check the output directory for fresh files.
