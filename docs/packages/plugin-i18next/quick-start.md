---
title: i18next quick start
description: Register the i18next plugin and run a first working config.
documentType: getting-started
---

# i18next quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as i18next } from "@powerlines/plugin-i18next";

export default defineConfig({
  plugins: [
    i18next()
  ]
});
```

Run the Powerlines build for your project. The `i18next` plugin activates through its hooks (Generates i18next TypeScript resources (`Resources` interface and `CustomTypeOptions` declaration) from parsed locale files during the build).
