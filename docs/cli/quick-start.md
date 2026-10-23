---
title: Powerlines CLI Quick Start
description: Create, prepare, lint, and build a project with four Powerlines commands.
documentType: getting-started
---

# Quick Start

This guide runs four commands in order. It assumes you installed the CLI. See [installation](./installation.md) when you have not.

## 1. Create a project

Create a new project at a chosen root:

```bash
powerlines create --root <project-dir>
```

The `root` option is required for `create`. The engine starts and logs its version.

## 2. Prepare artifacts

Generate required build and deployment artifacts:

```bash
powerlines prepare --root <project-dir>
```

Omit `--root` to use the current working directory. All commands except `create` treat `root` as optional.

## 3. Lint the source

Check style and syntax errors:

```bash
powerlines lint --root <project-dir>
```

Fix reported issues. Run the command again.

## 4. Build the project

Build for production deployment:

```bash
powerlines build --root <project-dir>
```

## Full sequence

```bash
powerlines create --root <project-dir>
powerlines prepare --root <project-dir>
powerlines lint --root <project-dir>
powerlines build --root <project-dir>
powerlines deploy --root <project-dir>
```

## Common pitfall

`create` fails without `--root`. The other commands fall back to the current directory. Pass `--root [<path>]` explicitly in scripts so the target stays clear.

## Next steps

- Read each command signature: [api-reference](./api-reference.md).
- Learn what `root` and `type` control: [configuration](./configuration.md).
