---
title: babel quick start
description: Register the babel plugin and run a first working config.
documentType: getting-started
---

# babel quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as babel } from "@powerlines/plugin-babel";

export default defineConfig({
  plugins: [
    babel({
    presets: ["@babel/preset-typescript"]
  })
  ]
});
```

Run the Powerlines build for your project. The `babel` plugin activates through its hooks (`config`, `configResolved` (order `pre`), `transform`).
