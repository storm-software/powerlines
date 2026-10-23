---
title: Quick start with @powerlines/plugin-image-compression
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-image-compression

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as imageCompression } from "@powerlines/plugin-image-compression";

export default defineConfig({
  plugins: [imageCompression()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as imageCompression } from "@powerlines/plugin-image-compression";

export default defineConfig({
  plugins: [imageCompression()],
  imageCompression: {
    filter: ["assets/**/*"],
    outputPath: "dist/assets",
    webp: {},
    avif: {}
  }
});
```

## Expected result

Image files that match `filter` are re-encoded and written to `outputPath`. No matching files means no output and no error.
