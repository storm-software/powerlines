---
title: Powerlines CLI Overview
description: Meet the Powerlines command-line interface and learn what its nine commands do.
documentType: getting-started
---

# Powerlines CLI Overview

Powerlines is a "framework framework". It simplifies modern dev tool usage. It generates virtual (or actual) code modules. It improves developer experience across the board.

The Powerlines CLI exposes this engine through the `powerlines` binary. Each command builds one engine instance. Each command then runs one engine method. The startup line confirms the run:

```bash
powerlines build
# 🔌 Powerlines Engine v<version> is running...
```

## Commands

The CLI source defines nine commands in `packages/devkit/cli/src/commands`. Each name below matches its source directory.

| Command | Title in source | Purpose |
| --- | --- | --- |
| `build` | Build | Build the project for production deployment. |
| `clean` | Clean | Remove build artifacts and temporary files. |
| `create` | Create Project | Create a new Powerlines project. |
| `deploy` | Deploy | Deploy the project and its generated assets. |
| `docs` | Generate Documentation | Generate documentation for project source code. |
| `gc` | Garbage Collection | Clean unnecessary system files (data, cache, logs, temp). |
| `lint` | Lint Source Code | Lint project source code for style and syntax errors. |
| `prepare` | Prepare Artifacts | Generate required build and deployment artifacts. |
| `types` | Generate Typescript Declarations | Generate a Typescript declaration (dts) file. |

Aliases defined in source: `deploy` also answers to `deployment`. `gc` also answers to `garbage-collection`.

## Typical flow

Run commands in this order for a new change:

```bash
powerlines create --root <project-dir>
powerlines prepare --root <project-dir>
powerlines lint --root <project-dir>
powerlines build --root <project-dir>
powerlines deploy --root <project-dir>
```

Use `clean` or `types` or `docs` when you need them. Use `gc` to free disk space.

## Where to go next

- Install the CLI: [installation](./installation.md).
- Run your first command: [quick-start](./quick-start.md).
- See every command signature: [api-reference](./api-reference.md).
- Configure behavior: [configuration](./configuration.md).
