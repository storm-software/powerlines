---
title: Generate docs with TypeDoc
description: Register the TypeDoc plugin and generate API documentation.
documentType: getting-started
---

# Generate docs with TypeDoc

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as typedoc } from "@powerlines/plugin-typedoc";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [typedoc()]
});
```

Generate documentation with the docs command. Output goes to
`docs/generated/api-reference` by default.

## Change the output path

```ts
export default defineConfig({
  plugins: [
    typedoc({
      outputPath: "docs/api",
      basePath: "/docs/"
    })
  ]
});
```
