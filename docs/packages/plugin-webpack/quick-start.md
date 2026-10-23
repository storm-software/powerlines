---
title: Build with Webpack
description: Register the Webpack plugin and run a first build.
documentType: getting-started
---

# Build with Webpack

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as webpack } from "@powerlines/plugin-webpack";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [webpack()]
});
```

Run the build with the Powerlines CLI. The plugin supplies default
configuration through its `config` hook and runs the Webpack build through
its `build` hook.

## Pass options

```ts
export default defineConfig({
  plugins: [webpack({ mode: "production" })]
});
```

Options accept `Partial<WebpackOptions>`. See [configuration](./configuration.md) for details.
