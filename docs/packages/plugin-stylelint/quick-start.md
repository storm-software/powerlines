---
title: Lint styles with Stylelint
description: Register the Stylelint plugin and lint the codebase.
documentType: getting-started
---

# Lint styles with Stylelint

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as stylelint } from "@powerlines/plugin-stylelint";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [stylelint()]
});
```

Run the lint command. The plugin lints through its `lint` hook and fixes
problems by default (`fix` is `true`).

## Point at a config file

```ts
export default defineConfig({
  plugins: [stylelint({ configFile: "stylelint.config.mjs" })]
});
```
