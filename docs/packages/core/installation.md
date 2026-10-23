---
title: Install core
description: Add the @powerlines/core package for shared types, config, and storage.
documentType: getting-started
---

# Install core

`@powerlines/core` holds shared types, contexts, config loading, plugin utilities, and storage. The manifest describes it as internal and directs public users to `powerlines`.

Install it directly only when you build engine hosts, bundler adapters, or plugins that need core types without the facade.

```sh
npm install @powerlines/core
```

```sh
pnpm add @powerlines/core
```

```sh
yarn add @powerlines/core
```

Import from focused subpaths:

```ts
import { defineConfig } from "@powerlines/core/lib/config";
import { VirtualStorageAdapter } from "@powerlines/core/storage";
import type { UserConfig, Plugin } from "@powerlines/core";
```

The package ships ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) builds with matching `.d.cts` types.

## Next step

Continue with the [core quick start](./quick-start.md).
