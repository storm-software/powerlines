---
title: env quick start
description: Register the env plugin and run a first working config.
documentType: getting-started
---

# env quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as env } from "@powerlines/plugin-env";

export default defineConfig({
  plugins: [
    env({
    prefix: "APP_",
    inject: true,
    validate: true
  })
  ]
});
```

Run the Powerlines build for your project. The `env` plugin activates through its hooks (`config`, `configResolved`, `prepare`, `docs`, `buildEnd`).
