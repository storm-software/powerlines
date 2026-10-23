---
title: core quick start
description: Load a config, merge plugin config, and use virtual storage with @powerlines/core.
documentType: getting-started
---

# core quick start

Core provides primitives. Most applications should use `powerlines` instead. Use core directly when you write a host, adapter, or plugin.

## 1. Define a typed config

```ts
import { defineConfig } from "@powerlines/core/lib/config";
import type { UserConfig } from "@powerlines/core";

const config: UserConfig = defineConfig({
  input: "src/index.ts",
  output: { path: "dist", storage: "virtual" }
});
```

## 2. Write to virtual storage

```ts
import { VirtualStorageAdapter } from "@powerlines/core/storage";

const storage = new VirtualStorageAdapter();
await storage.setItem("output/bundle.js", "console.log(1);");
const code = await storage.getItem("output/bundle.js");
```

`VirtualStorageAdapter` extends `BaseStorageAdapter`. Use `"virtual"` during generation and `"fs"` when you need disk output.

## 3. Merge hook results

```ts
import { mergeConfigs } from "@powerlines/core/lib/hooks";

const merged = mergeConfigs(baseConfig, pluginConfig);
```

`mergeConfigs` combines a current hook result with previous results. Use it when you implement custom hook pipelines.

## Expected result

You hold a typed config, an in-memory file, and a merged config object. No build runs. Core never executes commands on its own. The engine does that.

## Gaps

- Storage method names beyond `setItem` and `getItem` are not verified against tests here. Read `src/storage/base.ts` before you rely on more methods.
