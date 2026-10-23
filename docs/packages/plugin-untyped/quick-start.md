---
title: Generate code with Untyped
description: Register the Untyped plugin and generate from schemas.
documentType: getting-started
---

# Generate code with Untyped

Register the plugin in `powerlines.config.ts`:

```ts
import { plugin as untyped } from "@powerlines/plugin-untyped";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [untyped()]
});
```

By default, the plugin finds schemas matching
`{root}/**/{untyped.ts,*.untyped.ts}`. Generation runs during the
`prepare` command. Output files sit next to each schema file unless
`outputPath` is set.

## Set schema paths

```ts
export default defineConfig({
  plugins: [
    untyped({
      schema: "src/config/*.untyped.ts",
      outputPath: "dist/generated"
    })
  ]
});
```
