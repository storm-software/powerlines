# Powerlines - Core

This is an internal package used by various other Powerlines packages. Please use the `powerlines` package instead.

## Quick Features

- Shared types, contexts, and config loading used by the engine, bundler adapters, and plugins.
- Type-safe config helpers (`@powerlines/core/lib/config`) and plugin hook utilities (`mergeConfigs` in `@powerlines/core/lib/hooks`).
- Storage adapters: in-memory virtual storage (`VirtualStorageAdapter` in `@powerlines/core/storage`) and file-system storage.
- Focused subpath exports (for example `@powerlines/core/lib/config`, `@powerlines/core/storage`) with ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) builds.

## Installation

Install it directly only when building engine hosts, bundler adapters, or plugins that need core types without the `powerlines` facade. Most projects should install `powerlines` instead.

Using [pnpm](http://pnpm.io):

```bash
pnpm add @powerlines/core
```

<details>
  <summary>Using npm</summary>

```bash
npm install @powerlines/core
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add @powerlines/core
```

</details>

## Usage

Define a typed config:

```ts
import { defineConfig } from "@powerlines/core/lib/config";
import type { UserConfig } from "@powerlines/core";

const config: UserConfig = defineConfig({
  input: "src/index.ts",
  output: { path: "dist", storage: "virtual" }
});
```

Write to virtual storage:

```ts
import { VirtualStorageAdapter } from "@powerlines/core/storage";

const storage = new VirtualStorageAdapter();
await storage.setItem("output/bundle.js", "console.log(1);");
const code = await storage.getItem("output/bundle.js");
```

Merge plugin hook results when implementing custom hook pipelines:

```ts
import { mergeConfigs } from "@powerlines/core/lib/hooks";

const merged = mergeConfigs(baseConfig, pluginConfig);
```

Core provides primitives only — it never executes commands on its own. The engine (`@powerlines/engine`) runs commands.

## Development

This project is built using [Nx](https://nx.dev). As a result, many of the usual
commands are available to assist in development.

### Building

Run `nx build core` to build the library.

### Running unit tests

Run `nx test core` to execute the unit tests via [Vitest](https://vitest.dev).

### Linting

Run `nx lint core` to run [ESLint](https://eslint.org/) on the package.
