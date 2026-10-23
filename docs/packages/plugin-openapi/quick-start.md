---
title: Quick start with @powerlines/plugin-openapi
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-openapi

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as openapi } from "@powerlines/plugin-openapi";

export default defineConfig({
  plugins: [openapi()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as openapi } from "@powerlines/plugin-openapi";

export default defineConfig({
  plugins: [openapi({ schema: "./openapi.yml", outputPath: "src/generated" })],
  openapi: { schema: "./openapi.yml", outputPath: "src/generated" }
});
```

## Expected result

Client code is generated from the schema into `outputPath`. Regenerate after the spec changes.
