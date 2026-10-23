---
title: crypto quick start
description: Register the crypto plugin and run a first working config.
documentType: getting-started
---

# crypto quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as crypto } from "@powerlines/plugin-crypto";

export default defineConfig({
  plugins: [
    crypto({
    salt: process.env.SALT,
    encryptionKey: process.env.ENCRYPTION_KEY
  })
  ]
});
```

Run the Powerlines build for your project. The `crypto` plugin activates through its hooks (`config`, `configResolved`, `prepare`).
