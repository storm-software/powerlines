---
title: Configure @powerlines/plugin-react
description: Options for the react config block.
documentType: concept
---

# Configure @powerlines/plugin-react

Set options on the `react` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  react: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `jsxImportSource` | `string` | — |
| `jsxRuntime` | `'classic' \| 'automatic'` | — |
| `compiler` | `ReactCompilerOptions \| false` | — |
| `reactRefreshHost` | `string` | — |
| `babel` | `Partial<BabelPluginOptions>` | — |
| `env` | `Partial<Omit<EnvPluginOptions, 'babel'>>` | — |

`compiler` accepts React Compiler options or `false` to disable it. See `babel-plugin-react-compiler` for compiler fields. Env values go on the `env` block, not inside `react`. No defaults are stated in the plugin source.
