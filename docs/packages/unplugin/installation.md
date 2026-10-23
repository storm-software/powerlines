---
title: Install the Powerlines unplugin
description: Add @powerlines/unplugin and the peer package for your bundler.
documentType: getting-started
---

# Install the Powerlines unplugin

Install the package with pnpm:

```bash
pnpm add @powerlines/unplugin
```

Install with npm:

```bash
npm install @powerlines/unplugin
```

Install with yarn:

```bash
yarn add @powerlines/unplugin
```

## Requirements

- Add the peer package for each builder you use. Every builder peer is optional, so install only what you need.
- Known peer packages and ranges come from `package.json`: `vite >=8.1.0`, `rollup >=4.46.4`, `rolldown >=1.0.1`, `esbuild >=0.28.1`, `tsup >=6.0.0`, `tsdown >=0.21.9`, `rspack >=0.2.1`, `webpack >=5.107.2`, `farm` (`@farmfe/core >=1.7.11`, `@farmfe/cli >=1.0.5`), `astro >=7.0.6`, `next >=16.2.10`, `nuxt` (`@nuxt/kit >=4.1.1`, `@nuxt/schema >=4.1.1`), and `unloader >=0.9.0`.
- The package ships both ESM (`.mjs`) and CJS (`.cjs`) builds under `dist`.
