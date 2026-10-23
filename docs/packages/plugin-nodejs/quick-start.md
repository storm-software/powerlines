---
title: Quick start with @powerlines/plugin-nodejs
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-nodejs

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as nodejs } from "@powerlines/plugin-nodejs";

export default defineConfig({
  plugins: [nodejs()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as nodejs } from "@powerlines/plugin-nodejs";

export default defineConfig({
  plugins: [nodejs()],
  env: { mode: "production" }
});
```

Options split across two blocks: `babel` for transform settings and `env` for environment settings.

## Expected result

The project builds for Node.js with env files loaded and Babel transforms applied.
