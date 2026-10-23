---
title: alloy quick start
description: Register the alloy plugin and run a first working config.
documentType: getting-started
---

# alloy quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as alloy } from "@powerlines/plugin-alloy";

export default defineConfig({
  plugins: [
    alloy()
  ]
});
```

Run the Powerlines build for your project. The `alloy` plugin activates through its hooks (`config`, `configResolved`).
