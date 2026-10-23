---
title: Install engine
description: Add the @powerlines/engine package to orchestrate Powerlines commands.
documentType: getting-started
---

# Install engine

`@powerlines/engine` orchestrates commands. It depends on `@powerlines/core`. Most applications should install `powerlines` instead and get the engine transitively.

Install the engine directly only when you build a CLI, dev server, or custom host:

```sh
npm install @powerlines/engine
```

```sh
pnpm add @powerlines/engine
```

```sh
yarn add @powerlines/engine
```

```ts
import { createEngine, PowerlinesEngine } from "@powerlines/engine";
```

The package ships ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) builds. Its `api/*` subpaths expose per-command execution handlers for worker hosts.

## Next step

Continue with the [engine quick start](./quick-start.md).
