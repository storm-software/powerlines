---
title: hey-api quick start
description: Register the hey-api plugin and run a first working config.
documentType: getting-started
---

# hey-api quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as heyApi } from "@powerlines/plugin-hey-api";

export default defineConfig({
  plugins: [
    heyApi({
    schema: "https://api.example.com/openapi.json"
  })
  ]
});
```

Run the Powerlines build for your project. The `hey-api` plugin activates through its hooks (`configResolved`).
