---
title: Build with Rspack
description: Register the Rspack plugin and run a first build.
documentType: getting-started
---

# Build with Rspack

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as rspack } from "@powerlines/plugin-rspack";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [rspack()]
});
```

Run the build with the Powerlines CLI. The plugin supplies default
configuration through its `config` hook and runs the Rspack build through
its `build` hook.

## Pass options

```ts
export default defineConfig({
  plugins: [rspack({ mode: "production" })]
});
```

Options accept `Partial<RspackOptions>`, which wraps the Rspack
`Configuration` type. See [configuration](./configuration.md) for details.
