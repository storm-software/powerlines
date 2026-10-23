---
title: Transform code with SWC
description: Register the SWC plugin and transform project code.
documentType: getting-started
---

# Transform code with SWC

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as swc } from "@powerlines/plugin-swc";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [swc()]
});
```

The plugin supplies default configuration through its `config` hook and
transforms code with SWC.

## Pass transform options

```ts
export default defineConfig({
  plugins: [
    swc({
      jsc: { target: "es2022" }
    })
  ]
});
```
