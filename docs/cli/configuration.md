---
title: Configure the Powerlines CLI
description: Learn the root and type options, their defaults, and which settings remain undocumented gaps.
documentType: concept
---

# Configuration

The CLI source defines two options only: `root` and `type`. No config file lookup order appears in the CLI source. No environment variables appear in the CLI source.

## `root`

Meaning: the base directory the engine operates on.

- Type: `string`.
- Required: only for `create`. Optional for `build`, `clean`, `deploy`, `docs`, `lint`, `prepare`, and `types`.
- Default: the current working directory when omitted.
- Scope: each command accepts its own `root`. The value does not persist between runs.

Example with an explicit root:

```bash
powerlines build --root <project-dir>
```

Example with the default (current directory):

```bash
powerlines build
```

## `type` (gc only)

Meaning: which environment path group the `gc` command removes.

- Type: union `"data" | "cache" | "logs" | "temp" | "all"`.
- Default: `"all"`.
- Accepted values and their source meaning:
  - `data`: user-specific data files.
  - `cache`: temporary caching files.
  - `logs`: log files from the application.
  - `temp`: other temporary files.
  - `all`: every group above.

Example:

```bash
powerlines gc cache
```

```bash
powerlines gc --type <data|cache|logs|temp|all>
```

The exact directories come from `engine.context.envPaths` (`data`, `cache`, `log`, `temp`). The source notes that available paths vary by project configuration and operating system.

## How the engine starts

Each command calls `createPowerlines(options)` in `packages/devkit/cli/src/utilities/create-powerlines.ts`. That helper wraps `createEngine` from `powerlines/engine`. It forwards the options. It then logs `🔌 Powerlines Engine v<version> is running...` with the CLI `package.json` version.

## Gaps (not in CLI source)

- No global options are defined in the nine command files.
- No configuration file name, format, or lookup order is defined in the CLI source.
- No environment variables are defined in the CLI source. The generated `packages/devkit/cli/docs/reference/env.md` lists no parameters.
- No log-level flags are defined in the command files. The `logLevel` block in `shell-shock.config.ts` sets defaults only.
