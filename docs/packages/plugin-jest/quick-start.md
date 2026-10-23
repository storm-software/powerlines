---
title: Quick start with @powerlines/plugin-jest
description: Register the plugin and run a first build.
documentType: getting-started
---

# Quick start with @powerlines/plugin-jest

Register the plugin in your Powerlines config. Every Powerlines plugin follows the same pattern: import its `plugin` factory, call it, and list it in the `plugins` array.

```ts
import { defineConfig } from "powerlines/config";
import { plugin as jest } from "@powerlines/plugin-jest";

export default defineConfig({
  plugins: [jest()]
});
```

```ts
import { defineConfig } from "powerlines/config";
import { plugin as jest } from "@powerlines/plugin-jest";

export default defineConfig({
  plugins: [jest({ testFile: "src/index.test.ts" })],
  test: {
    jest: { runInBand: true }
  }
});
```

Pass `test.jest` fields through to the Jest CLI. Run `powerlines test` to execute.

## Expected result

Jest runs against your project with the resolved `test.jest` arguments. Check the terminal for pass or fail output.
