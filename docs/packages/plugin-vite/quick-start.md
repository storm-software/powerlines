---
title: Build with Vite
description: Register the Vite plugin and run a first build.
documentType: getting-started
---

# Build with Vite

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as vite } from "@powerlines/plugin-vite";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [vite()]
});
```

Run the build with the Powerlines CLI. The plugin supplies default
configuration through its `config` hook and runs the Vite build through
its `build` hook. This is the verified registration pattern: it matches
the `powerlines.config.ts` used by the Vite plugin package itself.

## Pass options

```ts
export default defineConfig({
  plugins: [vite({ singleBuild: true })]
});
```

Options accept `Partial<ViteOptions>`. See [configuration](./configuration.md) for details.
