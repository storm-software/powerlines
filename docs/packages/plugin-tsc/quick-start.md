---
title: Type-check with TSC
description: Register the TSC plugin and type-check the codebase.
documentType: getting-started
---

# Type-check with TSC

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as tsc } from "@powerlines/plugin-tsc";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [tsc({ typeCheck: true })]
});
```

`typeCheck` is required. The plugin transpiles TypeScript through its
`config` hook and type-checks through its `lint` hook.

## Limit processed files

```ts
export default defineConfig({
  plugins: [
    tsc({
      typeCheck: true,
      filter: { id: /\.ts$/ }
    })
  ]
});
```
