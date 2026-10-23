---
title: Quick start with @powerlines/plugin-pulumi
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-pulumi

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as pulumi } from "@powerlines/plugin-pulumi";

export default defineConfig({
  plugins: [pulumi()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as pulumi } from "@powerlines/plugin-pulumi";

export default defineConfig({
  plugins: [pulumi({ stackSettings: {} })],
  pulumi: { stackSettings: {} }
});
```

## Expected result

The Pulumi stack deploys with the given settings. Check the Pulumi console for stack state.
