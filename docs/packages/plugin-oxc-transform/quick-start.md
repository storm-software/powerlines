---
title: Quick start with @powerlines/plugin-oxc-transform
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-oxc-transform

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as oxcTransform } from "@powerlines/plugin-oxc-transform";

export default defineConfig({
  plugins: [oxcTransform()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as oxcTransform } from "@powerlines/plugin-oxc-transform";

export default defineConfig({
  plugins: [oxcTransform({ target: "es2022" })],
  oxcTransform: { target: "es2022" }
});
```

## Expected result

Source files are transformed per the Oxc options. Check build output for syntax errors.
