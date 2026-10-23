---
title: Quick start with @powerlines/plugin-nitro
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-nitro

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as nitro } from "@powerlines/plugin-nitro";

export default defineConfig({
  plugins: [nitro()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as nitro } from "@powerlines/plugin-nitro";

export default defineConfig({
  plugins: [nitro({ preset: "node-server" })],
  nitro: { preset: "node-server" }
});
```

## Expected result

The Nitro server builds from your routes. Start the dev server to serve them locally.
