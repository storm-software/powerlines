---
title: eslint quick start
description: Register the eslint plugin and run a first working config.
documentType: getting-started
---

# eslint quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as eslint } from "@powerlines/plugin-eslint";

export default defineConfig({
  plugins: [
    eslint({
    configFile: "./eslint.config.mjs",
    fix: true
  })
  ]
});
```

Run the Powerlines build for your project. The `eslint` plugin activates through its hooks (`lint`).
