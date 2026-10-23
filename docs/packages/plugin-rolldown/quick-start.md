---
title: Quick start with @powerlines/plugin-rolldown
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-rolldown

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as rolldown } from "@powerlines/plugin-rolldown";

export default defineConfig({
  plugins: [rolldown()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as rolldown } from "@powerlines/plugin-rolldown";

export default defineConfig({
  plugins: [rolldown()],
  rolldown: {}
});
```

## Expected result

The project bundles with Rolldown. Check the output directory for the bundle.
