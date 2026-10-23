---
title: Configure @powerlines/plugin-nodejs
description: Options for the env / NodeJsPluginOptions config block.
documentType: concept
---

# Configure @powerlines/plugin-nodejs

Set options on the `env / NodeJsPluginOptions` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  env / NodeJsPluginOptions: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `babel` | `Partial<BabelPluginOptions>` | — |
| `env` | `Partial<Omit<EnvPluginOptions, 'babel'>>` | — |

The plugin reuses the Env plugin types (`EnvPluginUserConfig`). Set runtime values on the `env` config block. Babel fields are partial; see `@powerlines/plugin-babel` types for the full list. No defaults are stated in the plugin source.
