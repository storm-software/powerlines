---
title: Configure @powerlines/plugin-oxlint
description: Options for the oxlint config block.
documentType: concept
---

# Configure @powerlines/plugin-oxlint

Set options on the `oxlint` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  oxlint: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `ignorePatterns` | `string \| string[]` | — |
| `configFile` | `string` | — |
| `deny` | `string[]` | — |
| `allow` | `string[]` | — |
| `warn` | `string[]` | — |
| `params` | `string` | — |
| `oxlintPath` | `string` | — |
| `typeAware` | `boolean` | — |
| `fix` | `boolean \| 'suggestions' \| 'dangerously'` | — |
| `format` | `'stylish' \| 'checkstyle' \| 'github' \| 'gitlab' \| 'json' \| 'junit' \| 'unix'` | — |

The resolved config requires the rule fields after resolution. Extra CLI params pass through `params`. No defaults are stated in the plugin source.
