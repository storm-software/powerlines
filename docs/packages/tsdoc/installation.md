---
title: Install the Powerlines TSDoc configs
description: Add @powerlines/tsdoc and meet its peer requirement.
documentType: getting-started
---

# Install the Powerlines TSDoc configs

Install the package as a dev dependency with pnpm:

```bash
pnpm add -D @powerlines/tsdoc
```

Install with npm:

```bash
npm install -D @powerlines/tsdoc
```

Install with yarn:

```bash
yarn add -D @powerlines/tsdoc
```

## Requirements

- `@storm-software/tsdoc >=0.13.146`. This is a required peer dependency. `recommended.json` extends `@storm-software/tsdoc/recommended.json`.
- The package ships JSON files only. It has no runtime code and no `dist` output. The build copies `src/*.json` to the package root.
