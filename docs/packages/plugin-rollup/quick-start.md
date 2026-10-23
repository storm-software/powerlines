---
title: Quick start with @powerlines/plugin-rollup
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-rollup

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as rollup } from "@powerlines/plugin-rollup";

export default defineConfig({
  plugins: [rollup()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as rollup } from "@powerlines/plugin-rollup";

export default defineConfig({
  plugins: [rollup()],
  rollup: {}
});
```

## Expected result

The project bundles with Rollup. Check the output directory for the bundle.
