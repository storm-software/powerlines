---
title: "Walk-through: how a plugin is defined and executed"
description: Follow a plugin factory from its hooks object through hook dispatch in the engine.
audience: new contributor familiar with TypeScript but not this codebase
perspective: under-the-hood
---

# Walk-through: how a plugin is defined and executed

**Audience:** new contributor familiar with TypeScript but not this codebase · **Perspective:** under-the-hood · **Time:** ~20 min

## What you will learn

You follow a plugin from its factory function, through hook selection and dispatch, to execution inside the engine. You finish able to read any plugin in `packages/plugins/` and predict when each of its hooks runs.

## Before you start

- TypeScript fluency; no Powerlines experience needed.
- These files open: `packages/plugins/plugin-vite/src/index.ts`, `packages/base/core/src/types/plugin.ts`, `packages/base/core/src/lib/hooks.ts`, `packages/base/engine/src/engine.ts`.

## The path at a glance

1. A factory returns a `Plugin` object with named hooks.
2. The engine loads one execution per environment.
3. The execution API invokes the command; contexts dispatch hooks.
4. `_callHook` selects, orders, and runs matching hook handlers.
5. Helpers compose and gate plugins.

## Step 1 — A factory returns a `Plugin` object

`packages/plugins/plugin-vite/src/index.ts` — the canonical shape:

```ts
export const plugin = <TContext extends VitePluginContext = VitePluginContext>(
  options: VitePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "vite",
    config() { /* ...defaults... */ },
    async build() { /* ...run Vite... */ }
  };
};
```

`name` identifies the plugin in logs and hook listings. Each remaining key is a hook. Hooks come from the `Hooks<TContext>` interface in `packages/base/core/src/types/plugin.ts` (`config`, `build`, `create`, `lint`, `deploy`, and bundler-style hooks inherited through the unplugin model). A hook is either a bare function or a `PluginHookObject` with `order` (`"pre"` / `"post"`), a `filter`, and a `handler`.

Key trap from the `config` hook docs: user plugins are already resolved when `config` runs, so injecting more plugins inside `config` has no effect.

## Step 2 — The engine loads one execution per environment

`packages/base/engine/src/engine.ts` — every public method (`create`, `build`, `deploy`, …) delegates to the protected `execute(command, inlineConfig)`:

```ts
(await this.context.loadExecutions(command, inlineConfig)).map(
  async execution => {
    await this.api.execute(command, execution.options, inlineConfig);
  }
);
```

`loadExecutions` lives on the engine context (`packages/base/engine/src/context/engine-context.ts`). It resolves the user config and produces one execution per configured environment; the engine runs them concurrently with `Promise.all`. On failure it logs the command, invocation id, and execution id, then rethrows.

## Step 3 — Contexts dispatch hooks per command

Inside an execution, the API functions in `packages/base/engine/src/api/` drive the flow. For example `api/create.ts` calls `prepare`, then `executeEnvironments`, then `context.callHook("create", { environment: env, order: "pre" })`. Each command's API module decides which hooks fire and in what order — `create` renders Handlebars templates, `build` runs bundler plugins, and so on.

## Step 4 — `_callHook` selects, orders, and runs handlers

`packages/base/core/src/lib/hooks.ts` — `_callHook(context, key, options, ...args)` is the single funnel:

1. `context.selectHooks(key, options)` collects every registered handler for the hook name, honoring `order` and filters.
2. It logs the numbered handler list (`Calling N build plugin hooks: 1. vite, 2. …`) under the `hooks` logger category.
3. Each handler runs via `Reflect.apply(hook.handler, hook.context, hookArgs)` — note the plugin context becomes `this`, which is why plugin hooks are written as methods (`config() {...}`, `async build() {...}`) and can call `this.trace` / `this.debug`.

Results merge back into the flow according to the hook's contract (config hooks merge, build hooks run for effect).

## Step 5 — Helpers compose and gate plugins

`packages/base/core/src/plugin-utils/` — small combinators shape the plugin list before dispatch:

- `enable(plugin, condition)` returns the plugin(s) or `[]` based on a boolean or predicate — the standard way to gate environment-specific plugins.
- `combine-plugins.ts` merges plugin lists; `extend.ts` layers overrides.
- `docs-helper.ts` and `format.ts` generate the per-plugin reference pages from the same sources.

Plugin authors compose with these instead of hand-rolling conditionals, so hook selection always sees a flat, final list.

## Recap

A factory builds a `{ name, ...hooks }` object. The engine resolves config, loads one execution per environment, and the command's API module fires named hooks through `_callHook`, which selects, logs, and applies each handler with the plugin context as `this`. Composition helpers decide which plugins exist before any of that runs.

## Where to go next

- [Author a plugin with plugin-plugin](../packages/plugin-plugin/quick-start.md) for the hands-on authoring path.
- `packages/base/core/src/types/plugin.ts` for the full `Hooks` interface.
- Try adding a `config` hook log line to a local plugin and run `powerlines build` at debug level to watch hook dispatch order.
