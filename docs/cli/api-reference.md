---
title: Powerlines CLI API Reference
description: Run each of the nine Powerlines commands with the correct synopsis, options, and examples.
documentType: recipe
---

# API Reference

Binary: `powerlines`. Every example uses `npx`-style execution from the generated reference docs. Replace with `pnpm exec`, `yarn exec`, or `bun x` as needed.

Option syntax below follows the source interfaces. `<placeholder>` means required. `[<optional>]` means optional. The CLI source defines no short aliases (such as `-r`) for any option.

## build

Builds the project for production deployment.

Synopsis:

```bash
powerlines build [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for the build. |

Example:

```bash
powerlines build --root <project-dir>
```

## clean

Cleans the project by removing build artifacts and temporary files.

Synopsis:

```bash
powerlines clean [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for the clean. |

Example:

```bash
powerlines clean --root <project-dir>
```

## create

Create a new Powerlines project.

Synopsis:

```bash
powerlines create --root <path>
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | Yes | None | Base directory for the new project. |

Example:

```bash
powerlines create --root <new-project-dir>
```

## deploy

Deploys the project and its generated assets/artifacts. Alias: `deployment`.

Synopsis:

```bash
powerlines deploy [--root <path>]
```

```bash
powerlines deployment [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for the deploy. |

Example:

```bash
powerlines deploy --root <project-dir>
```

## docs

Generate documentation for the project's source code.

Synopsis:

```bash
powerlines docs [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for doc generation. |

Example:

```bash
powerlines docs --root <project-dir>
```

## gc

Perform garbage collection to clean up unnecessary system files. Alias: `garbage-collection`.

Synopsis (both orders appear in the generated reference):

```bash
powerlines gc [<data|cache|logs|temp|all>] [--type <value>]
```

```bash
powerlines gc [--type <value>] [<data|cache|logs|temp|all>]
```

Options and positional input:

| Input | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `type` positional | `"data" \| "cache" \| "logs" \| "temp" \| "all"` | No | `"all"` | Path group to clean. |
| `--type` | `"data" \| "cache" \| "logs" \| "temp" \| "all"` | No | `"all"` | Same groups as the positional. |

The handler reads `engine.context.envPaths` (`data`, `cache`, `log`, `temp`). It removes each selected directory with `removeDirectory` from `@stryke/fs`. It always uses `process.cwd()` merged with options as the engine root.

Examples:

```bash
powerlines gc all
```

```bash
powerlines gc cache
```

```bash
powerlines garbage-collection --type <logs>
```

## lint

Lint the project's source code for style and syntax errors.

Synopsis:

```bash
powerlines lint [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for linting. |

Example:

```bash
powerlines lint --root <project-dir>
```

## prepare

Generate the project's required build and deployment artifacts.

Synopsis:

```bash
powerlines prepare [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for preparation. |

Example:

```bash
powerlines prepare --root <project-dir>
```

## types

Generate a Typescript declaration (dts) file for the project.

Synopsis:

```bash
powerlines types [--root <path>]
```

Options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `--root` | `string` | No | Current working directory | Base directory for type generation. |

Example:

```bash
powerlines types --root <project-dir>
```

## Source notes

- Each command file exports `metadata` (`title`, `description`, `icon`) plus optional `alias` and `tags`. Only `deploy` and `gc` define aliases. Only `gc` defines a tag (`Utility`).
- Each handler except `gc` calls `createPowerlines(options)` then one engine method (`build`, `clean`, `create`, `deploy`, `docs`, `lint`, `prepare`, `types`).
- Per-command online help lives at `https://docs.stormsoftware.com/projects/powerlines/reference/cli/{command}`. That URL template comes from the `docs` field in `shell-shock.config.ts`.
