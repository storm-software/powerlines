---
title: asyncapi quick start
description: Register the asyncapi plugin and run a first working config.
documentType: getting-started
---

# asyncapi quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as asyncapi } from "@powerlines/plugin-asyncapi";

export default defineConfig({
  plugins: [
    asyncapi({
    schema: "./schema.yaml",
    templateName: "@asyncapi/html-template",
    outputPath: "{builtinPath}/asyncapi"
  })
  ]
});
```

Run the Powerlines build for your project. The `asyncapi` plugin activates through its hooks (`config`, `configResolved`).
