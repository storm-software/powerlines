---
title: powerlines quick start
description: Define a config, create an engine, and run a build with the powerlines package.
documentType: getting-started
---

# powerlines quick start

This guide creates a minimal config and runs a command through the engine.

## 1. Define the config

Create `powerlines.config.ts` in the project root:

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  input: "src/index.ts",
  output: {
    path: "dist"
  }
});
```

`defineConfig` accepts a `UserConfig` object, an array, a promise, or a function. It returns the config unchanged and adds type checking.

## 2. Create the engine

```ts
import { createPowerlines } from "powerlines/engine";

const engine = await createPowerlines({ cwd: process.cwd() });
```

`createPowerlines` wraps `createEngine` from `@powerlines/engine`. It logs the engine version on start. Pass `cwd` to set the working directory.

## 3. Run a command

```ts
await engine.prepare({ command: "prepare", root: process.cwd() });
await engine.build({ command: "build", root: process.cwd() });
```

`CreateInlineConfig` requires `root`. Other command configs accept `command`, `root`, and shared execution options. Each engine method loads executions from the context and runs them through the execution API worker.

## 4. Release resources

```ts
await engine.finalize();
```

`finalize` runs cleanup. The engine also supports `AsyncDisposable`, so `await using` disposes it automatically.

## Expected result

`prepare` initializes project resources. `build` generates output in the configured output path. Logs show each phase start and completion.

## Gaps

- Default config file discovery order beyond `powerlines.config.ts` variants is not verified here. Pass `configFile` explicitly when the location matters.
