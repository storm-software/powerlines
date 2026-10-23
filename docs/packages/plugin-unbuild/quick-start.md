---
title: Build with Unbuild
description: Register the Unbuild plugin and run a first build.
documentType: getting-started
---

# Build with Unbuild

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as unbuild } from "@powerlines/plugin-unbuild";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [unbuild()]
});
```

Run the build with the Powerlines CLI. The plugin supplies default
configuration through its `config` hook and builds through its `build`
hook.

## Pass options

```ts
export default defineConfig({
  plugins: [unbuild({ clean: true })]
});
```

Options accept `Partial<UnbuildOptions>`. See [configuration](./configuration.md) for details.
