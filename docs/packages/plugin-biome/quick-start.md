---
title: biome quick start
description: Register the biome plugin and run a first working config.
documentType: getting-started
---

# biome quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as biome } from "@powerlines/plugin-biome";

export default defineConfig({
  plugins: [
    biome({
    configFile: "./biome.json",
    fix: true
  })
  ]
});
```

Run the Powerlines build for your project. The `biome` plugin activates through its hooks (`config`, `lint`).
