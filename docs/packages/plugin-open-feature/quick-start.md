---
title: Quick start with @powerlines/plugin-open-feature
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-open-feature

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as openFeature } from "@powerlines/plugin-open-feature";

export default defineConfig({
  plugins: [openFeature()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as openFeature } from "@powerlines/plugin-open-feature";

export default defineConfig({
  plugins: [openFeature()],
  openFeature: {
    providers: new Map()
  }
});
```

## Expected result

The OpenFeature provider map is registered. Evaluate flags through the OpenFeature SDK at runtime.
