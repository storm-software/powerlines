/* -------------------------------------------------------------------

                   ⚡ Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { resolvePackage } from "@stryke/fs/resolve";
import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { ArrayValues } from "@stryke/types/array";
import {
  addPluginHook,
  getHookHandler,
  isHookExternal,
  isPlugin,
  isPluginHook
} from "../../plugin-utils/helpers";
import { WorkspaceConfig } from "../../types/config";
import {
  EnvironmentContext,
  EnvironmentContextPlugin,
  PluginContext,
  SelectHooksOptions
} from "../../types/context";
import {
  BaseHooksList,
  HookKeys,
  HooksList,
  InferHookHandler
} from "../../types/hooks";
import { Plugin, PLUGIN_NON_HOOK_FIELDS } from "../../types/plugin";
import {
  EnvironmentResolvedConfig,
  ResolvedConfig
} from "../../types/resolved";
import { PowerlinesContext } from "./context";
import { createPluginContext } from "./plugin-context";

export class PowerlinesEnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>
  extends PowerlinesContext<TResolvedConfig>
  implements EnvironmentContext<TResolvedConfig>
{
  /**
   * The hooks registered by plugins in this environment
   */
  #hooks: HooksList<PluginContext<TResolvedConfig>> = {} as HooksList<
    PluginContext<TResolvedConfig>
  >;

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param workspaceConfig - The root directory of the workspace.
   * @param config - The user configuration options.
   * @returns A promise that resolves to the new context.
   */
  public static async fromConfig<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    workspaceConfig: WorkspaceConfig,
    config: TResolvedConfig
  ): Promise<PowerlinesEnvironmentContext<TResolvedConfig>> {
    const context = new PowerlinesEnvironmentContext<TResolvedConfig>(
      config,
      workspaceConfig
    );
    await context.init();

    context.powerlinesPath = await resolvePackage("powerlines");
    if (!context.powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }

    return context;
  }

  /**
   * The resolved environment configuration
   */
  public environment!: EnvironmentResolvedConfig;

  /**
   * The list of plugins applied to this environment
   */
  public plugins: EnvironmentContextPlugin<TResolvedConfig>[] = [];

  /**
   * The resolved configuration options
   */
  public override get config(): TResolvedConfig {
    return super.config;
  }

  public get hooks(): HooksList<PluginContext<TResolvedConfig>> {
    return this.#hooks;
  }

  public async addPlugin(plugin: Plugin<PluginContext<TResolvedConfig>>) {
    let resolvedPlugin = plugin;
    if (plugin.applyToEnvironment) {
      const result = await Promise.resolve(
        plugin.applyToEnvironment(this.environment)
      );
      if (!result || (isObject(result) && Object.keys(result).length === 0)) {
        return;
      }

      resolvedPlugin = isPlugin<TResolvedConfig>(result) ? result : plugin;
    }

    const context = createPluginContext<TResolvedConfig>(resolvedPlugin, this);

    this.plugins.push({
      plugin: resolvedPlugin,
      context
    });

    this.#hooks = Object.keys(resolvedPlugin)
      .filter(
        key =>
          !PLUGIN_NON_HOOK_FIELDS.includes(
            key as ArrayValues<typeof PLUGIN_NON_HOOK_FIELDS>
          )
      )
      .reduce((ret, key) => {
        const hook = key as keyof HooksList<PluginContext<TResolvedConfig>>;
        const pluginHook = resolvedPlugin[hook as keyof typeof resolvedPlugin];
        if (!isPluginHook(pluginHook)) {
          return ret;
        }

        if (!isHookExternal(hook)) {
          ret[hook] ??= {};
          if (resolvedPlugin.enforce) {
            ret[hook][`${resolvedPlugin.enforce}Enforced`] ??= [];

            addPluginHook(
              context,
              resolvedPlugin,
              pluginHook,
              ret[hook][`${resolvedPlugin.enforce}Enforced`]!
            );

            return ret;
          }

          if (isFunction(pluginHook) || !pluginHook.order) {
            ret[hook].normal ??= [];

            addPluginHook(
              context,
              resolvedPlugin,
              pluginHook,
              ret[hook].normal
            );

            return ret;
          }

          ret[hook][`${pluginHook.order}Ordered`] ??= [];

          addPluginHook(
            context,
            resolvedPlugin,
            pluginHook,
            ret[hook][`${pluginHook.order}Ordered`]!
          );
        } else {
          ret[hook] ??= [];
          ret[hook].push({
            plugin: resolvedPlugin,
            hook: getHookHandler(pluginHook).bind(context)
          } as any);
        }

        return ret;
      }, this.hooks);
  }

  /**
   * Retrieves the hook handlers for a specific hook name
   */
  public selectHooks<TKey extends HookKeys<PluginContext<TResolvedConfig>>>(
    hook: TKey,
    options?: SelectHooksOptions
  ): InferHookHandler<PluginContext<TResolvedConfig>, TKey>[] {
    const handlers = [] as InferHookHandler<
      PluginContext<TResolvedConfig>,
      TKey
    >[];

    if (this.hooks[hook]) {
      if (!isHookExternal(hook)) {
        const hooks = this.hooks[hook] as BaseHooksList<
          PluginContext<TResolvedConfig>
        >;
        if (options?.order) {
          if (options?.order === "pre") {
            handlers.push(
              ...(hooks.preOrdered ?? []).map(
                h =>
                  h.handler as InferHookHandler<
                    PluginContext<TResolvedConfig>,
                    TKey
                  >
              )
            );
            handlers.push(
              ...(hooks.preEnforced ?? []).map(
                h =>
                  h.handler as InferHookHandler<
                    PluginContext<TResolvedConfig>,
                    TKey
                  >
              )
            );
          } else if (options?.order === "post") {
            handlers.push(
              ...(hooks.postOrdered ?? []).map(
                h =>
                  h.handler as InferHookHandler<
                    PluginContext<TResolvedConfig>,
                    TKey
                  >
              )
            );
            handlers.push(
              ...(hooks.postEnforced ?? []).map(
                h =>
                  h.handler as InferHookHandler<
                    PluginContext<TResolvedConfig>,
                    TKey
                  >
              )
            );
          } else {
            handlers.push(
              ...(hooks.normal ?? []).map(
                h =>
                  h.handler as InferHookHandler<
                    PluginContext<TResolvedConfig>,
                    TKey
                  >
              )
            );
          }
        } else {
          handlers.push(...this.selectHooks(hook, { order: "pre" }));
          handlers.push(...this.selectHooks(hook, { order: "normal" }));
          handlers.push(...this.selectHooks(hook, { order: "post" }));
        }
      } else {
        handlers.push(
          ...this.hooks[hook].map(
            h =>
              h.handler as InferHookHandler<
                PluginContext<TResolvedConfig>,
                TKey
              >
          )
        );
      }
    }

    return handlers;
  }

  protected constructor(
    config: TResolvedConfig,
    workspaceConfig: WorkspaceConfig
  ) {
    super(workspaceConfig);

    this.resolvedConfig = config;
  }
}
