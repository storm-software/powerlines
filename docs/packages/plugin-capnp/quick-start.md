---
title: capnp quick start
description: Register the capnp plugin and run a first working config.
documentType: getting-started
---

# capnp quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as capnp } from "@powerlines/plugin-capnp";

export default defineConfig({
  plugins: [
    capnp({
    schema: "./schemas/*.capnp",
    ts: true
  })
  ]
});
```

Run the Powerlines build for your project. The `capnp` plugin activates through its hooks (`config`, `configResolved`, `prepare`).
