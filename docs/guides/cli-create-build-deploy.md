---
title: "Walk-through: scaffold, build, and deploy with the Powerlines CLI"
description: Run create, build, and deploy through the CLI and engine, and see how each command reaches the engine.
audience: end user new to Powerlines
perspective: hands-on
---

# Walk-through: scaffold, build, and deploy with the Powerlines CLI

**Audience:** end user new to Powerlines · **Perspective:** hands-on · **Time:** ~15 min

## What you will learn

You run three CLI commands, `create`, `build`, and `deploy`, against a project. You see how each command creates an engine and hands work to it. You finish able to scaffold and ship a Powerlines project from the terminal.

## Before you start

- Node.js and the `powerlines` CLI installed. See [installation](../cli/installation.md) for setup.
- A terminal open in an empty directory.
- These files open for reference: `packages/devkit/cli/src/commands/build/command.ts`, `packages/devkit/cli/src/utilities/create-powerlines.ts`, `packages/base/engine/src/engine.ts`.

## The path at a glance

1. Run `powerlines create` to scaffold a project.
2. Inspect the generated `powerlines.config.ts`.
3. Run `powerlines build` to run the production build.
4. Run `powerlines deploy` to ship the output.
5. Trace one command from the terminal into the engine.

## Step 1 — Scaffold a project

`packages/devkit/cli/src/commands/create/command.ts` — the `create` command takes a `root` directory and calls `engine.create(options)`. Run it:

```bash
powerlines create --root <project-dir>
```

The engine's `create` method (`packages/base/engine/src/engine.ts`) logs "Creating a new project" and delegates to the shared `execute("create", ...)` runner. The create API (`packages/base/engine/src/api/create.ts`) first runs `prepare`, then fires the `create` hook for every configured environment, then renders Handlebars templates (`files/common/**/*.hbs`) from each environment's `powerlinesPath` into the project root. Result: a project directory with a starter `powerlines.config.ts`.

## Step 2 — Read the generated config

Open `<project-dir>/powerlines.config.ts`. It calls `defineConfig` from `powerlines/config` and lists `plugins`. Every later command reads this file. See [CLI configuration](../cli/configuration.md) for the lookup order and the options each command accepts.

## Step 3 — Build the project

`packages/devkit/cli/src/commands/build/command.ts` — the `build` command accepts an optional `--root` (default: current directory) and calls `engine.build(options)`:

```bash
powerlines build --root <project-dir>
```

`PowerlinesEngine.build` (`packages/base/engine/src/engine.ts`) delegates to `execute("build", ...)`, which loads one execution per configured environment via `context.loadExecutions` and runs them concurrently through the execution API worker. Each plugin's `config` hook supplies defaults first; then each plugin's `build` hook runs (for example, the Vite plugin runs the Vite build through its own `build` hook).

## Step 4 — Deploy the output

```bash
powerlines deploy --root <project-dir>
```

`PowerlinesEngine.deploy` follows the same `execute` path with the `"deploy"` command, so deployment plugins (Terraform, Pulumi, Cloudflare, Nitro) run their deploy steps against the built output. See the [CLI API reference](../cli/api-reference.md) for the full command list, including `clean`, `lint`, `types`, `prepare`, `docs`, and `gc`.

## Step 5 — Trace the full path once

Pick `build` and follow it end to end:

1. `packages/devkit/cli/src/commands/build/command.ts` parses `--root` into `BuildOptions`.
2. `packages/devkit/cli/src/utilities/create-powerlines.ts` builds the engine with `createEngine(options)` from `powerlines/engine` and logs the running version.
3. `packages/base/engine/src/engine.ts` — `build()` calls `execute("build", inlineConfig)`, which fans out to `ExecutionApiWorker.execute` per environment and marks each execution complete.

Every CLI command follows this same three-stop shape. Only the command name and its options interface change.

## Recap

`create` scaffolds templates through the `create` hook. `build` runs each environment's executions concurrently. `deploy` ships the result through deploy plugins. All three share the `command → createPowerlines → PowerlinesEngine.execute` path.

## Where to go next

- [CLI API reference](../cli/api-reference.md) for every command synopsis.
- [Configure Powerlines with the Vite plugin](use-powerlines-with-vite.md) to add a real build plugin to the config you just scaffolded.
- Try changing a plugin's options in `powerlines.config.ts` and re-running `powerlines build` to watch the output change.
