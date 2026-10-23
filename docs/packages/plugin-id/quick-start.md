---
title: id quick start
description: Register the id plugin and run a first working config.
documentType: getting-started
---

# id quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as id } from "@powerlines/plugin-id";

export default defineConfig({
  plugins: [
    id({
    type: "nanoid"
  })
  ]
});
```

Run the Powerlines build for your project. The `id` plugin activates through its hooks (`config`, `prepare`).
