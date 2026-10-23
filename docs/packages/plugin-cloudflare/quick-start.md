---
title: cloudflare quick start
description: Register the cloudflare plugin and run a first working config.
documentType: getting-started
---

# cloudflare quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as cloudflare } from "@powerlines/plugin-cloudflare";

export default defineConfig({
  plugins: [
    cloudflare({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    configPath: "./wrangler.toml"
  })
  ]
});
```

Run the Powerlines build for your project. The `cloudflare` plugin activates through its hooks (`config`, `configResolved`, `prepare`, `build` (order `pre`)).
