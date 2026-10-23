---
title: automd quick start
description: Register the automd plugin and run a first working config.
documentType: getting-started
---

# automd quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as automd } from "@powerlines/plugin-automd";

export default defineConfig({
  plugins: [
    automd({
    input: "README.md"
  })
  ]
});
```

Run the Powerlines build for your project. The `automd` plugin activates through its hooks (`config`, `configResolved`).
