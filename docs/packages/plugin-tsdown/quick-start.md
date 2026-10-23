---
title: Build with Tsdown
description: Register the Tsdown plugin and run a first build.
documentType: getting-started
---

# Build with Tsdown

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as tsdown } from "@powerlines/plugin-tsdown";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [tsdown()]
});
```

Run the build with the Powerlines CLI. The plugin supplies default
configuration through its `config` hook, resolves it through
`configResolved`, and builds through its `build` hook.

## Pass options

```ts
export default defineConfig({
  plugins: [tsdown({ dts: true })]
});
```

Options accept `Partial<TsdownOptions>`. See [configuration](./configuration.md) for details.
