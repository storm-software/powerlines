---
title: Quick start with @powerlines/plugin-oxlint
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-oxlint

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as oxlint } from "@powerlines/plugin-oxlint";

export default defineConfig({
  plugins: [oxlint()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as oxlint } from "@powerlines/plugin-oxlint";

export default defineConfig({
  plugins: [oxlint({ deny: ["no-debugger"] })],
  oxlint: { deny: ["no-debugger"], warn: ["no-console"] }
});
```

Run `powerlines lint` to lint with these rules.

## Expected result

Oxlint reports findings per the configured rules. Denied rules fail the lint run.
