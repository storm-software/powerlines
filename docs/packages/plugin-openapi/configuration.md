---
title: Configure @powerlines/plugin-openapi
description: Options for the openapi config block.
documentType: concept
---

# Configure @powerlines/plugin-openapi

Set options on the `openapi` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  openapi: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `schema` | `string \| URL \| OpenAPISchema` | — (required in resolved config) |
| `outputPath` | `string` | — (required in resolved config) |
| `(other fields)` | `Partial<Omit<PowerPlantOpenAPITypeScriptOptions, 'output'>>` | generator defaults |

`schema` accepts a file path, URL, or parsed `OpenAPISchema` object. Generation options come from `@power-plant/openapi-typescript`; see that package for the full list. `schema` and `outputPath` are required once resolved. No defaults are stated in the plugin source.
