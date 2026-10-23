---
title: Quick start with @powerlines/plugin-react
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-react

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as react } from "@powerlines/plugin-react";

export default defineConfig({
  plugins: [react()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as react } from "@powerlines/plugin-react";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  react: { jsxRuntime: "automatic", compiler: {} },
  env: { mode: "development" }
});
```

## Expected result

The React app builds with the chosen JSX runtime. Open the dev server to view it.
