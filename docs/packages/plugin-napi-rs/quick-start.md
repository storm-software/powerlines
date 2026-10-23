---
title: Quick start with @powerlines/plugin-napi-rs
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-napi-rs

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as napi } from "@powerlines/plugin-napi-rs";

export default defineConfig({
  plugins: [napi()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as napi } from "@powerlines/plugin-napi-rs";

export default defineConfig({
  plugins: [napi({ binaryName: "my-addon", release: true })],
  napi: { binaryName: "my-addon", release: true }
});
```

## Expected result

The Rust crate builds through the N-API CLI and the generated bindings land in the configured output directory.
