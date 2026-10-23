---
title: Install the Powerlines plugin helper
description: Add @powerlines/plugin-plugin to a Powerlines plugin project.
documentType: getting-started
---

# Install the Powerlines plugin helper

Install the package with pnpm:

```bash
pnpm add @powerlines/plugin-plugin
```

Install with npm:

```bash
npm install @powerlines/plugin-plugin
```

Install with yarn:

```bash
yarn add @powerlines/plugin-plugin
```

## Requirements

- The package depends on `@powerlines/plugin-tsdown` and `powerlines`. Both install automatically as regular dependencies.
- The package ships ESM (`.mjs`) and CJS (`.cjs`) builds with type definitions (`.d.mts`, `.d.cts`) under `dist`.
- The README shows `pnpm add @powerlines/plugin-plugin` without `-D`. Use a dev flag when the plugin is a build-time tool only.
