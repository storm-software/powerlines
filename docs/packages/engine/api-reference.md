---
title: engine API reference
description: PowerlinesEngine methods, context factories, and execution API helpers.
documentType: recipe
---

# engine API reference

Import from `@powerlines/engine` or from a focused subpath. All paths below come from the package `exports` map.

## `createEngine(options, apiPath?)`

Builds an engine with an execution worker.

```ts
import { createEngine } from "@powerlines/engine";

const engine = await createEngine({ cwd: process.cwd() });
```

- `options`: `EngineOptions` (`cwd`, `root`, `host`, `port`, `customLogger`, `framework`, `logLevel`).
- `apiPath`: worker module path. Defaults to `@powerlines/engine/api`.
- Returns: `Promise<PowerlinesEngine>`.
- Side effects: sets unlimited event listeners, creates the engine context, starts the API worker.

## `createContext(options)`

Builds a `PowerlinesEngineContext` with an `h3` app and devtools host. Prefers an explicit `port`, else picks a free localhost port. Most callers should use `createEngine` instead.

## `PowerlinesEngine`

Implements the `Engine` interface and `AsyncDisposable`.

| Member | Signature | Notes |
| --- | --- | --- |
| `context` | `EngineContext` getter | Shared engine context. |
| `api` | `ExecutionApiWorker` getter | Worker proxy for execution calls. |
| `create` | `(inlineConfig: PartialKeys<CreateInlineConfig, "command">)` | Scaffolds a project. |
| `types` | `(inlineConfig: PartialKeys<TypesInlineConfig, "command">)` | Generates declarations. |
| `prepare` | `(inlineConfig: PartialKeys<PrepareInlineConfig, "command">)` | Initializes resources. |
| `clean` | `(inlineConfig: PartialKeys<CleanInlineConfig, "command">)` | Removes artifacts. |
| `lint` | `(inlineConfig: PartialKeys<LintInlineConfig, "command">)` | Lints sources. |
| `test` | `(inlineConfig: PartialKeys<TestInlineConfig, "command">)` | Runs tests. |
| `build` | `(inlineConfig: PartialKeys<BuildInlineConfig, "command">)` | Builds the project. |
| `docs` | `(inlineConfig: PartialKeys<DocsInlineConfig, "command">)` | Generates docs. |
| `deploy` | `(inlineConfig: PartialKeys<DeployInlineConfig, "command">)` | Deploys artifacts. |
| `finalize` | `() => Promise<void>` | Final cleanup. Called by disposal. |
| `[Symbol.asyncDispose]` | `() => Promise<void>` | Calls `finalize`. |

Error handling: `execute` loads executions via `context.loadExecutions`, runs each through `api.execute`, logs failures with invocation and execution IDs, marks the execution complete, and rethrows.

## Execution API (`@powerlines/engine/api`)

The `api` subpath aggregates per-command handlers: `api/build`, `api/clean`, `api/create`, `api/deploy`, `api/docs`, `api/lint`, `api/prepare`, `api/test`, `api/types`. Each handler receives an `ExecutionContext` and runs environment-scoped work, including `config`, `build`, and copy steps where applicable. Worker hosts load these through `createApi`.

### `createApi(handlers, inlineConfig?)`

Wraps command handlers so each call gets a fresh `ExecutionContext` with merged config and error handling. From `@powerlines/engine/helpers/create-api`.

```ts
import { createApi } from "@powerlines/engine/helpers/create-api";

export default createApi({
  build: async context => {
    context.debug("building");
  }
});
```

## Helpers (`@powerlines/engine/helpers`)

| Subpath | Purpose |
| --- | --- |
| `helpers/create-api` | `createApi` factory for execution handlers. |
| `helpers/finalize` | Finalization routine used by `finalize`. |
| `helpers/rpc` | `createRpcClient` for engine-to-worker calls. |
| `helpers/stream` | `MessagePortDuplex` transport. |
| `helpers/type-checks` | `isEngineExecutionOptions` guard. |

## Context (`@powerlines/engine/context`)

`context/engine-context` exports `PowerlinesEngineContext` with `from`, `loadExecutions`, `completeExecution`, `timer`, and log methods. The root `@powerlines/engine` re-exports context, engine, and types.

## Types (`@powerlines/engine` root)

Key types: `Engine`, `ExecutionInterface`, `ExecutionApi`, `ExecutionApiParams`, `ExecutionApiWorkerInterface`, `EngineOptions`, `EngineExecutionOptions`, `EngineResolvedConfig`, `RpcClientOptions`, plus RPC and context types. Command inline config types come from `@powerlines/core`.

## Gaps

- Per-command handler inputs and outputs beyond the `ExecutionContext` pattern are not enumerated. Read `src/api/*.ts` for exact behavior.
- RPC timeout, retry, and cache defaults are not verified. Read `src/helpers/rpc.ts` before tuning them.
