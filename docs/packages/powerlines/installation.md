---
title: Install powerlines
description: Add the powerlines package to a project with npm, pnpm, or yarn.
documentType: getting-started
---

# Install powerlines

`powerlines` is the public package. Install it in application projects.

## Requirements

- Use a TypeScript project with ESM support. The package ships `dist/index.mjs` and `dist/index.cjs` through its `exports` map.
- Check the package manifest for the current version before you pin a range. The inspected version is `0.47.216`.

## Install

Use one command:

```sh
npm install powerlines
```

```sh
pnpm add powerlines
```

```sh
yarn add powerlines
```

## Import

Import from the root entry:

```ts
import { defineConfig } from "powerlines/config";
import { createPowerlines } from "powerlines/engine";
```

Import the full facade:

```ts
import { defineConfig } from "powerlines";
```

Import a bundler adapter. Each adapter re-exports `@powerlines/unplugin`:

```ts
import powerlines from "powerlines/vite";
```

Available adapter subpaths include `powerlines/vite`, `powerlines/rollup`, `powerlines/rolldown`, `powerlines/esbuild`, `powerlines/webpack`, `powerlines/rspack`, `powerlines/farm`, `powerlines/tsup`, `powerlines/tsdown`, `powerlines/astro`, `powerlines/nuxt`, `powerlines/next`, and `powerlines/unplugin`.

## Next step

Continue with the [powerlines quick start](./quick-start.md).
