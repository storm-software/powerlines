---
title: "Walk-through: configure Powerlines with the Vite plugin"
description: Add the Vite plugin to powerlines.config.ts and run a first build through the engine.
audience: integrator adding Powerlines to a bundler project
perspective: hands-on
---

# Walk-through: configure Powerlines with the Vite plugin

**Audience:** integrator adding Powerlines to a bundler project · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@powerlines/plugin-vite` in `powerlines.config.ts` and run a build. You see how the plugin supplies default config and where its hooks run. You finish able to wire any Powerlines plugin into a project the same way.

## Before you start

- A Powerlines project (see the [CLI create/build/deploy tour](cli-create-build-deploy.md) for scaffolding).
- The Vite plugin installed. See [installation](../packages/plugin-vite/installation.md).
- These files open for reference: `packages/plugins/plugin-vite/src/index.ts`, `packages/plugins/plugin-vite/powerlines.config.ts`.

## The path at a glance

1. Register the plugin in `powerlines.config.ts`.
2. Run `powerlines build`.
3. Watch the `config` hook supply defaults.
4. Watch the `build` hook run Vite.
5. Pass options for a second build.

## Step 1 — Register the plugin

`packages/plugins/plugin-vite/powerlines.config.ts` — the package configures itself this way, so mirror the pattern:

```ts
import { plugin as vite } from "@powerlines/plugin-vite";
import { defineConfig } from "powerlines/config";

export default defineConfig({
  plugins: [vite()]
});
```

Registration is a `plugins` array of plugin factories. This pattern holds for every plugin; only the import path and option names change. See the [Vite plugin quick-start](../packages/plugin-vite/quick-start.md).

## Step 2 — Run the build

```bash
powerlines build
```

The CLI builds an engine and calls `execute("build", ...)`, which loads one execution per environment and runs them through the execution API worker (`packages/base/engine/src/engine.ts`).

## Step 3 — Watch the `config` hook supply defaults

`packages/plugins/plugin-vite/src/index.ts` — the plugin's `config()` hook returns defaults before the build starts:

```ts
return {
  output: { format: ["cjs", "esm"] },
  vite: { ...options },
  singleBuild: true
};
```

The hook also traces a message ("Providing default configuration for the Powerlines `vite` build plugin"), visible at debug log level. Defaults merge under any user values, so explicit config in `powerlines.config.ts` wins.

## Step 4 — Watch the `build` hook run Vite

The same file's `build()` hook starts the Vite build for the resolved configuration. The engine runs each plugin's hooks in order per execution, so combining `vite()` with a lint or env plugin runs all of them in one `powerlines build` pass.

## Step 5 — Pass options

```ts
export default defineConfig({
  plugins: [vite({ singleBuild: true })]
});
```

Options accept `Partial<ViteOptions>`. Full field list: [Vite plugin configuration](../packages/plugin-vite/configuration.md).

## Recap

Import the plugin factory, list it in `plugins`, run `powerlines build`. The `config` hook merges defaults, the `build` hook does the work, and the engine fans the whole sequence out per environment.

## Where to go next

- [Vite plugin API reference](../packages/plugin-vite/api-reference.md) for exports and hooks.
- [Powerlines package map](../packages/overview.md) to find the next plugin your project needs.
- Try adding a second plugin (for example `@powerlines/plugin-env`) to the same `plugins` array and rebuild.
