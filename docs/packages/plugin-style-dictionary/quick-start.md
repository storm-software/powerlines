---
title: Generate tokens with Style Dictionary
description: Register the Style Dictionary plugin and build design tokens.
documentType: getting-started
---

# Generate tokens with Style Dictionary

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as styleDictionary } from "@powerlines/plugin-style-dictionary";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [styleDictionary()]
});
```

When token sources come from `source` / `include` paths in the Style
Dictionary config, no options are needed. To pass tokens directly:

```ts
export default defineConfig({
  plugins: [
    styleDictionary({
      tokens: { color: { brand: { value: "#1fb2a6" } } }
    })
  ]
});
```

The build runs during the `prepare` command. Set `skipBuild: true` to run
it manually instead.
