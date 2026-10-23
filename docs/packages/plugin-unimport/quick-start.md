---
title: Auto-import with Unimport
description: Register the Unimport plugin and add automatic imports.
documentType: getting-started
---

# Auto-import with Unimport

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as unimport } from "@powerlines/plugin-unimport";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [unimport({ presets: [] })]
});
```

`presets` is required. The plugin adds missing imports to source code
through its `config` and `configResolved` hooks.

## Opt out per file

Add a magic comment to skip a file:

```ts
// @unimport-disable
```
