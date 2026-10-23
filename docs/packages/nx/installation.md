---
title: Install the Powerlines Nx plugin
description: Add @powerlines/nx to an Nx workspace and meet its peer requirements.
documentType: getting-started
---

# Install the Powerlines Nx plugin

Add `@powerlines/nx` as a dev dependency. The package description is "A Nx plugin to support Powerlines development in Nx monorepos."

Install with pnpm:

```bash
pnpm add -D @powerlines/nx
```

Install with npm:

```bash
npm install -D @powerlines/nx
```

Install with yarn:

```bash
yarn add -D @powerlines/nx
```

## Requirements

- Nx `>=23.0.0`. This is a required peer dependency, not an optional one.
- The package ships `executors.json` and `generators.json` at the package root. These files register the executors and generators with Nx.
- Built output lives under `dist/src`. Executor implementations resolve to `./dist/src/executors/<name>/executor`, and the sync generator factory resolves to `./dist/src/generators/sync/generator`.

## Notes

- The package `files` list includes `migrations.json`, but no `migrations.json` file ships in the package root. Do not reference it. See gaps in [api-reference](api-reference.md).
- The README shows `nx build devkit-nx` and `nx test devkit-nx`, but `project.json` names the project `nx`. Use the name from your own workspace configuration. See gaps in [api-reference](api-reference.md).
