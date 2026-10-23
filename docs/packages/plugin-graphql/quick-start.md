---
title: graphql quick start
description: Register the graphql plugin and run a first working config.
documentType: getting-started
---

# graphql quick start

Add the plugin to the `plugins` array in your Powerlines config. Powerlines resolves `plugins?: PluginConfig[]` from `defineConfig`.

```ts
import { defineConfig } from "powerlines";
import { plugin as graphql } from "@powerlines/plugin-graphql";

export default defineConfig({
  plugins: [
    graphql({
    schema: "./schema.graphql",
    filename: "{builtinPath}/graphql/schema.ts"
  })
  ]
});
```

Run the Powerlines build for your project. The `graphql` plugin activates through its hooks (`configResolved`).
