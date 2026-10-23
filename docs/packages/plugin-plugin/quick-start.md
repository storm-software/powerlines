---
title: Scaffold a Powerlines plugin with defaults
description: Add the plugin helper and get library output defaults.
documentType: getting-started
---

# Scaffold a Powerlines plugin with defaults

Import `plugin` from the package entry and add it to your Powerlines configuration:

```ts
import { plugin as pluginPlugin } from "@powerlines/plugin-plugin";

export default {
  plugins: [pluginPlugin()]
};
```

The exact configuration shape depends on your Powerlines setup. The helper returns an array of plugins, so spread or nest it as your config format requires.

## Result

Your plugin project builds as a library for Node with these defaults:

- Output formats `cjs` and `esm`, with type definitions on and minification off.
- External packages: `powerlines`, `@powerlines/*`, and `@power-plant/*`.
- Entry input defaults to `src/index.tsx`, then `src/index.ts`, when the config sets no input.

## Notes

- The helper composes the tsdown plugin (`@powerlines/plugin-tsdown`) with its own defaults. Pass shared tsdown options through the single `options` argument.
- The config file shape above is illustrative. It was not verified against a Powerlines config example. See gaps in [api-reference](api-reference.md).
