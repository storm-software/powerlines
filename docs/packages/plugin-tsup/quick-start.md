---
title: Build with Tsup
description: Register the Tsup plugin and run a first build.
documentType: getting-started
---

# Build with Tsup

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as tsup } from "@powerlines/plugin-tsup";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [tsup()]
});
```

Run the build with the Powerlines CLI. The plugin supplies default
configuration through its `config` hook and builds through its `build`
hook.

## Pass options

```ts
export default defineConfig({
  plugins: [tsup({ dts: true })]
});
```

Options accept `Partial<TsupOptions>`. See [configuration](./configuration.md) for details.
