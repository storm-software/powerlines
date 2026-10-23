---
title: Install babel plugin
description: Install the Powerlines babel plugin package.
documentType: getting-started
---

# Install the babel plugin

The `@powerlines/plugin-babel` package (v0.13.213) transform source files with Babel inside the Powerlines build.

```sh
npm install @powerlines/plugin-babel
# pnpm add @powerlines/plugin-babel
# yarn add @powerlines/plugin-babel
```

Also install `@babel/plugin-syntax-jsx`, `@babel/plugin-syntax-typescript`, and `@babel/plugin-transform-json-modules`.

The package ships ESM and CJS builds with types. Import the plugin factory from the package root.
