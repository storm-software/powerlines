---
title: Install the Powerlines TypeScript configs
description: Add @powerlines/tsconfig and meet its peer requirement.
documentType: getting-started
---

# Install the Powerlines TypeScript configs

Install the package as a dev dependency with pnpm:

```bash
pnpm add -D @powerlines/tsconfig
```

Install with npm:

```bash
npm install -D @powerlines/tsconfig
```

Install with yarn:

```bash
yarn add -D @powerlines/tsconfig
```

## Requirements

- `@storm-software/tsconfig >=0.48.2`. This is a required peer dependency. Every shipped config extends a `@storm-software/tsconfig` file.
- The package ships JSON files only. It has no runtime code and no `dist` output. The build copies `src/*.json` to the package root.
