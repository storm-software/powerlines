---
title: Generate images with Satori
description: Register the Satori plugin and generate SVG images from components.
documentType: getting-started
---

# Generate images with Satori

Register the plugin in `powerlines.config.ts`. Point `path` at files with
a Satori component default export:

```ts
import { plugin as satori } from "@powerlines/plugin-satori";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [satori({ path: "src/og/**/*.tsx" })]
});
```

Run the `prepare` command. The plugin resolves each component file and
generates output images. By default, output files sit next to each
component file.

## Set shared options

```ts
export default defineConfig({
  plugins: [
    satori({
      path: "src/og/**/*.tsx",
      outputPath: "dist/og",
      defaultOptions: { width: 1200, height: 630 }
    })
  ]
});
```

Individual component modules can export their own options. Those options
override `defaultOptions`.
