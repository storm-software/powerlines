---
title: engine quick start
description: Create an engine, run build and test commands, and shut down cleanly.
documentType: getting-started
---

# engine quick start

This guide starts an engine with default options and runs two commands.

## 1. Create the engine

```ts
import { createEngine } from "@powerlines/engine";

const engine = await createEngine({ cwd: process.cwd() });
```

`createEngine(options, apiPath?)` builds an `EngineContext`, attaches a `ExecutionApiWorker`, and returns a `PowerlinesEngine`. The default `apiPath` is `@powerlines/engine/api`. It picks a random localhost port when `port` is unset.

## 2. Prepare and build

```ts
await engine.prepare({ command: "prepare", root: process.cwd() });
await engine.build({ command: "build", root: process.cwd() });
```

Each call loads executions for the command and runs them through the API worker. Failures log the invocation ID and execution ID, then rethrow.

## 3. Run checks

```ts
await engine.lint({ command: "lint", root: process.cwd() });
await engine.test({ command: "test", root: process.cwd() });
```

Run `lint` and `test` the same way. Every command follows the same `inlineConfig` pattern.

## 4. Shut down

```ts
await engine.finalize();
```

Or use async disposal:

```ts
await using engine = await createEngine({ cwd: process.cwd() });
await engine.build({ command: "build", root: process.cwd() });
```

Disposal calls `finalize` automatically.

## Expected result

Commands run in order. Logs mark each phase. `finalize` releases workers and ports.

## Gaps

- Only `createPowerlines` has a passing smoke test in the inspected repo. `createEngine` behavior above comes from source reads, not test runs.
