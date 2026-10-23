---
title: Process content with Unified
description: Register the Unified plugin and add a processing rule.
documentType: getting-started
---

# Process content with Unified

Register the plugin in `powerlines.config.ts` with one rule:

```ts
import { plugin as unified } from "@powerlines/plugin-unified";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [
    unified({
      rules: [
        {
          include: /\.md$/,
          setup: processor => {
            // Add remark or rehype plugins here
            return processor;
          }
        }
      ]
    })
  ]
});
```

Each rule matches files with `include` / `exclude` and builds a Unified
`Processor` in `setup`. Optional `transform.pre` and `transform.post`
steps wrap the processor output.
