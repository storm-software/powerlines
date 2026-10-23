---
title: date quick start
description: Register the date plugin and run a first working config.
documentType: getting-started
---

# date quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as date } from "@powerlines/plugin-date";

export default defineConfig({
  plugins: [
    date({
    type: "date-fns",
    defaultLocale: "en-US"
  })
  ]
});
```

Run the Powerlines build for your project. The `date` plugin activates through its hooks (`config`, `configResolved`, `prepare`).
