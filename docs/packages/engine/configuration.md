---
title: Configure engine
description: Engine startup options, execution options, and host settings.
documentType: concept
---

# Configure engine

The engine needs startup options once and execution options per command.

## Startup options (`EngineOptions`)

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `cwd` | string | workspace root or process cwd | Working directory for all commands. |
| `root` | string | current working directory | Project root for config discovery and path resolution. |
| `host` | string | `localhost` | WebSocket host for engine-to-host communication. |
| `port` | number | random | WebSocket port. The engine picks a free port when unset. |
| `customLogger` | `CustomLogger` | default logger | Replaces Powerlines logging. |
| `framework` | `FrameworkOptions` | unset | `name`, `version`, `orgId`. Plugins read it to adapt behavior. |
| `logLevel` | label or object | `info` | Inherited from core `Options`. |

```ts
import { createEngine } from "@powerlines/engine";

const engine = await createEngine({
  cwd: process.cwd(),
  root: process.cwd(),
  host: "localhost",
  logLevel: "debug",
  framework: { name: "my-framework", orgId: "my-org", version: "1.0.0" }
});
```

`createContext` builds an `h3` app with a devtools host and serves static dirs through `sirv`. You rarely call it directly. Use `createEngine`.

## Execution options (`EngineExecutionOptions`)

The engine builds these per execution from your inline config:

| Field | Notes |
| --- | --- |
| `name` | Project name for plugin decisions. |
| `baseURL` | Dev server base URL. Only set in dev mode. |
| `connection` | Connection metadata with backend and WebSocket config. |
| `channel` | `MessagePort` between engine and execution host. Not serializable. |
| `wsOptions` | WebSocket RPC channel tuning. |
| `rpcOptions` | RPC client tuning. |
| `cacheOptions` | `true` or RPC cache config. |

`RpcClientOptions` requires `baseURL` and `connection`. Worker hosts must supply both.

## Dev server behavior

`createContext` mounts a static file server with dev mode and single-page fallback enabled. The engine logs each command (`prepare`, `build`, and others) with timers and completion messages.

## Gaps

- TLS, auth, and multi-host topologies are not described in the inspected source. Treat them as unsupported until confirmed.
- `port` selection uses `get-port-please` with a random flag. Exact retry behavior is unverified.
