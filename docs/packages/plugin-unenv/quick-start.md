---
title: Shims with Unenv
description: Register the Unenv plugin and make code platform agnostic.
documentType: getting-started
---

# Shims with Unenv

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as unenv } from "@powerlines/plugin-unenv";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [unenv()]
});
```

The plugin supplies default configuration through its `config` hook and
resolves the environment through `configResolved`. Source code uses
platform-agnostic shims from `unenv`.

## Pass options

```ts
export default defineConfig({
  plugins: [unenv({ presets: [] })]
});
```

Options accept `Partial<CreateEnvOptions>` from `unenv`.
