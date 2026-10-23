---
title: Build with Tamagui
description: Register the Tamagui plugin and compile components.
documentType: getting-started
---

# Build with Tamagui

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as tamagui } from "@powerlines/plugin-tamagui";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [tamagui()]
});
```

The plugin supplies default configuration through its `config` hook and
compiles Tamagui components for the `web` platform by default.

## Target native

```ts
export default defineConfig({
  plugins: [
    tamagui({
      platform: "native",
      components: ["{root}/src/components"]
    })
  ]
});
```
