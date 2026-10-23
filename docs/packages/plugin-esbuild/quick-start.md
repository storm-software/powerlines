---
title: esbuild quick start
description: Register the esbuild plugin and run a first working config.
documentType: getting-started
---

# esbuild quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as esbuild } from "@powerlines/plugin-esbuild";

export default defineConfig({
  plugins: [
    esbuild()
  ]
});
```

Run the Powerlines build for your project. The `esbuild` plugin activates through its hooks (`config`, `build`).
