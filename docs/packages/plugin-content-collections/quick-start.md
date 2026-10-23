---
title: content-collections quick start
description: Register the content-collections plugin and run a first working config.
documentType: getting-started
---

# content-collections quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as contentCollections } from "@powerlines/plugin-content-collections";

export default defineConfig({
  plugins: [
    contentCollections({
    configFile: "{root}/content-collections.ts",
    collections: []
  })
  ]
});
```

Run the Powerlines build for your project. The `content-collections` plugin activates through its hooks (`config`, `configResolved`, `prepare`).
