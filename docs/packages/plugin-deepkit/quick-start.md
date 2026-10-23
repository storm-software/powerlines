---
title: deepkit quick start
description: Register the deepkit plugin and run a first working config.
documentType: getting-started
---

# deepkit quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as deepkit } from "@powerlines/plugin-deepkit";

export default defineConfig({
  plugins: [
    deepkit()
  ]
});
```

Run the Powerlines build for your project. The `deepkit` plugin activates through its hooks (`config`, `configResolved` (order `post`)).
