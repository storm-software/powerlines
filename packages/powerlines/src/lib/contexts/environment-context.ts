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
  isPluginConfig,
  isPluginHook
} from "../../plugin-utils/helpers";
import { PluginConfig, WorkspaceConfig } from "../../types/config";
import {
  EnvironmentContext,
  EnvironmentContextPlugin,
  PluginContext,
  SelectHooksOptions,
  SelectHooksResult
} from "../../types/context";
import { BaseHooksList, HookKeys, HooksList } from "../../types/hooks";
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

    const powerlinesPath = await resolvePackage("powerlines");
    if (!powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }

    context.powerlinesPath = powerlinesPath;

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
    if (isFunction(plugin.applyToEnvironment)) {
      const result = (await Promise.resolve(
        plugin.applyToEnvironment(this.environment) as Promise<any>
      )) as boolean | PluginConfig<PluginContext<TResolvedConfig>>;

      if (!result || (isObject(result) && Object.keys(result).length === 0)) {
        return;
      }

      if (isPluginConfig(result)) {
        return this.$$internal.addPlugin(result);
      }

      resolvedPlugin = isPlugin<PluginContext<TResolvedConfig>>(result)
        ? result
        : plugin;
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
  ): SelectHooksResult<TResolvedConfig, TKey>[] {
    const result = [] as SelectHooksResult<TResolvedConfig, TKey>[];

    if (this.hooks[hook]) {
      if (!isHookExternal(hook)) {
        const hooks = this.hooks[hook] as BaseHooksList<
          PluginContext<TResolvedConfig>
        >;
        if (options?.order) {
          if (options?.order === "pre") {
            result.push(
              ...(hooks.preOrdered ?? []).map(h => {
                const plugin = this.plugins.find(
                  p => p.plugin.name === h.plugin.name
                );
                if (!plugin) {
                  throw new Error(
                    `Could not find plugin context for plugin "${
                      h.plugin.name
                    }".`
                  );
                }

                return {
                  handle: h.handler,
                  context: plugin.context
                };
              })
            );
            result.push(
              ...(hooks.preEnforced ?? []).map(h => {
                const plugin = this.plugins.find(
                  p => p.plugin.name === h.plugin.name
                );
                if (!plugin) {
                  throw new Error(
                    `Could not find plugin context for plugin "${
                      h.plugin.name
                    }".`
                  );
                }

                return {
                  handle: h.handler,
                  context: plugin.context
                };
              })
            );
          } else if (options?.order === "post") {
            result.push(
              ...(hooks.postOrdered ?? []).map(h => {
                const plugin = this.plugins.find(
                  p => p.plugin.name === h.plugin.name
                );
                if (!plugin) {
                  throw new Error(
                    `Could not find plugin context for plugin "${
                      h.plugin.name
                    }".`
                  );
                }

                return {
                  handle: h.handler,
                  context: plugin.context
                };
              })
            );
            result.push(
              ...(hooks.postEnforced ?? []).map(h => {
                const plugin = this.plugins.find(
                  p => p.plugin.name === h.plugin.name
                );
                if (!plugin) {
                  throw new Error(
                    `Could not find plugin context for plugin "${
                      h.plugin.name
                    }".`
                  );
                }

                return {
                  handle: h.handler,
                  context: plugin.context
                };
              })
            );
          } else {
            result.push(
              ...(hooks.normal ?? []).map(h => {
                const plugin = this.plugins.find(
                  p => p.plugin.name === h.plugin.name
                );
                if (!plugin) {
                  throw new Error(
                    `Could not find plugin context for plugin "${
                      h.plugin.name
                    }".`
                  );
                }

                return {
                  handle: h.handler,
                  context: plugin.context
                };
              })
            );
          }
        } else {
          result.push(...this.selectHooks(hook, { order: "pre" }));
          result.push(...this.selectHooks(hook, { order: "normal" }));
          result.push(...this.selectHooks(hook, { order: "post" }));
        }
      } else {
        result.push(
          ...this.hooks[hook].map(h => {
            const plugin = this.plugins.find(
              p => p.plugin.name === h.plugin.name
            );
            if (!plugin) {
              throw new Error(
                `Could not find plugin context for plugin "${h.plugin.name}".`
              );
            }

            return {
              handle: h.handler,
              context: plugin.context
            };
          })
        );
      }
    }

    return result;
  }

  protected constructor(
    config: TResolvedConfig,
    workspaceConfig: WorkspaceConfig
  ) {
    super(workspaceConfig);

    this.resolvedConfig = config;
  }
}
