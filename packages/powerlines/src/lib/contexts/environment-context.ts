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
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { ArrayValues } from "@stryke/types/array";
import { AnyFunction } from "@stryke/types/base";
import {
  addPluginHook,
  isPlugin,
  isPluginConfig,
  isPluginHook,
  isPluginHookField,
  isUnpluginHookField,
  isUnpluginHookKey
} from "../../plugin-utils/helpers";
import { PluginConfig, WorkspaceConfig } from "../../types/config";
import {
  EnvironmentContext,
  EnvironmentContextPlugin,
  PluginContext,
  SelectHookResult,
  SelectHookResultItem,
  SelectHooksOptions
} from "../../types/context";
import {
  HookFields,
  HookListOrders,
  HooksList,
  InferHooksListItem,
  PluginHooksListItem,
  UnpluginHookList,
  UnpluginHooksListItem
} from "../../types/hooks";
import {
  Plugin,
  PLUGIN_NON_HOOK_FIELDS,
  PluginHook,
  PluginHookFields
} from "../../types/plugin";
import {
  EnvironmentResolvedConfig,
  ResolvedConfig
} from "../../types/resolved";
import { UnpluginOptions } from "../../types/unplugin";
import { isUnpluginBuilderVariant } from "../unplugin/helpers";
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

      if (isPluginConfig<PluginContext<TResolvedConfig>>(result)) {
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
        const hook = key as HookFields<PluginContext<TResolvedConfig>>;

        if (isPluginHookField<PluginContext<TResolvedConfig>>(hook)) {
          const pluginHook = resolvedPlugin[hook];
          if (!isPluginHook(pluginHook)) {
            return ret;
          }

          ret[hook] ??= {
            preEnforced: [],
            preOrdered: [],
            normal: [],
            postEnforced: [],
            postOrdered: []
          };

          if (resolvedPlugin.enforce) {
            const hookListOrder =
              `${resolvedPlugin.enforce}Enforced` as HookListOrders;
            ret[hook][hookListOrder] ??= [];

            const bucket = ret[hook][hookListOrder];
            addPluginHook<
              PluginContext<TResolvedConfig>,
              PluginHookFields<PluginContext<TResolvedConfig>>
            >(context, resolvedPlugin, pluginHook, bucket);

            return ret;
          }

          if (isFunction(pluginHook) || !pluginHook.order) {
            ret[hook].normal ??= [];

            const bucket = ret[hook].normal;
            addPluginHook<
              PluginContext<TResolvedConfig>,
              PluginHookFields<PluginContext<TResolvedConfig>>
            >(context, resolvedPlugin, pluginHook, bucket);

            return ret;
          }

          const hookListOrder = `${pluginHook.order}Ordered` as HookListOrders;
          ret[hook][hookListOrder] ??= [];

          addPluginHook(
            context,
            resolvedPlugin,
            pluginHook,
            ret[hook][hookListOrder] as PluginHooksListItem<
              PluginContext<TResolvedConfig>
            >[]
          );

          return ret;
        } else if (isUnpluginHookField(hook)) {
          const unpluginPlugin = resolvedPlugin[hook];
          if (!isSetObject(unpluginPlugin)) {
            return ret;
          }

          for (const field of Object.keys(unpluginPlugin)) {
            const variantField = field as keyof UnpluginOptions[typeof hook];

            const pluginHook = unpluginPlugin[
              variantField
            ] as PluginHook<AnyFunction>;
            if (!isPluginHook(pluginHook)) {
              continue;
            }

            ret[hook] ??= {};
            (ret[hook][variantField] as UnpluginHookList<
              PluginContext<TResolvedConfig>,
              typeof variantField
            >) ??= {
              preEnforced: [],
              preOrdered: [],
              normal: [],
              postEnforced: [],
              postOrdered: []
            };

            if (resolvedPlugin.enforce) {
              addPluginHook(
                context,
                resolvedPlugin,
                pluginHook,
                ret[hook][variantField][
                  `${resolvedPlugin.enforce}Enforced`
                ] as UnpluginHooksListItem<PluginContext<TResolvedConfig>>[]
              );

              return ret;
            }

            if (isFunction(pluginHook) || !pluginHook.order) {
              addPluginHook(
                context,
                resolvedPlugin,
                pluginHook,
                (
                  ret[hook][variantField] as UnpluginHookList<
                    PluginContext<TResolvedConfig>,
                    typeof variantField
                  >
                ).normal!
              );

              return ret;
            }

            addPluginHook(
              context,
              resolvedPlugin,
              pluginHook,
              ret[hook][variantField][
                `${pluginHook.order}Ordered`
              ] as UnpluginHooksListItem<PluginContext<TResolvedConfig>>[]
            );
          }
        } else {
          this.warn(`Unknown plugin hook field: ${String(hook)}`);
        }

        return ret;
      }, this.hooks);
  }

  /**
   * Retrieves the hook handlers for a specific hook name
   */
  public selectHooks<TKey extends string>(
    key: TKey,
    options?: SelectHooksOptions
  ): SelectHookResult<PluginContext<TResolvedConfig>, TKey> {
    const result = [] as SelectHookResult<PluginContext<TResolvedConfig>, TKey>;

    if (isUnpluginHookKey(key)) {
      const variant = String(key).split(":")[0];
      if (isUnpluginBuilderVariant(variant)) {
        const hooks = this.hooks[variant];
        if (hooks) {
          const field = String(key).split(":")[1] as keyof typeof hooks;
          if (field && hooks[field]) {
            const fieldHooks = hooks[field] as Record<
              HookListOrders,
              InferHooksListItem<PluginContext<TResolvedConfig>, TKey>[]
            >;

            if (options?.order) {
              const mapHooksToResult = (
                hooksList: InferHooksListItem<
                  PluginContext<TResolvedConfig>,
                  TKey
                >[]
              ): SelectHookResult<PluginContext<TResolvedConfig>, TKey> =>
                hooksList.map(hook => {
                  const plugin = this.plugins.find(
                    p => p.plugin.name === hook.plugin.name
                  );
                  if (!plugin) {
                    throw new Error(
                      `Could not find plugin context for plugin "${
                        hook.plugin.name
                      }".`
                    );
                  }

                  return {
                    handler: hook.handler,
                    plugin: hook.plugin,
                    context: plugin.context
                  } as SelectHookResultItem<
                    PluginContext<TResolvedConfig>,
                    TKey
                  >;
                });

              if (options?.order === "pre") {
                result.push(...mapHooksToResult(fieldHooks.preOrdered ?? []));
                result.push(...mapHooksToResult(fieldHooks.preEnforced ?? []));
              } else if (options?.order === "post") {
                result.push(...mapHooksToResult(fieldHooks.postOrdered ?? []));
                result.push(...mapHooksToResult(fieldHooks.postEnforced ?? []));
              } else {
                result.push(...mapHooksToResult(fieldHooks.normal ?? []));
              }
            } else {
              result.push(...this.selectHooks(key, { order: "pre" }));
              result.push(...this.selectHooks(key, { order: "normal" }));
              result.push(...this.selectHooks(key, { order: "post" }));
            }
          }
        }
      }
    } else if (isPluginHookField<PluginContext<TResolvedConfig>>(key)) {
      if (this.hooks[key]) {
        const fieldHooks = this.hooks[key] as Record<
          HookListOrders,
          InferHooksListItem<PluginContext<TResolvedConfig>, TKey>[]
        >;

        if (options?.order) {
          const mapHooksToResult = (
            hooksList: InferHooksListItem<
              PluginContext<TResolvedConfig>,
              TKey
            >[]
          ): SelectHookResult<PluginContext<TResolvedConfig>, TKey> =>
            hooksList.map(hook => {
              const plugin = this.plugins.find(
                p => p.plugin.name === hook.plugin.name
              );
              if (!plugin) {
                throw new Error(
                  `Could not find plugin context for plugin "${
                    hook.plugin.name
                  }".`
                );
              }

              return {
                handler: hook.handler,
                plugin: hook.plugin,
                context: plugin.context
              } as SelectHookResultItem<PluginContext<TResolvedConfig>, TKey>;
            });

          if (options?.order === "pre") {
            result.push(...mapHooksToResult(fieldHooks.preOrdered ?? []));
            result.push(...mapHooksToResult(fieldHooks.preEnforced ?? []));
          } else if (options?.order === "post") {
            result.push(...mapHooksToResult(fieldHooks.postOrdered ?? []));
            result.push(...mapHooksToResult(fieldHooks.postEnforced ?? []));
          } else {
            result.push(...mapHooksToResult(fieldHooks.normal ?? []));
          }
        } else {
          result.push(...this.selectHooks(key, { order: "pre" }));
          result.push(...this.selectHooks(key, { order: "normal" }));
          result.push(...this.selectHooks(key, { order: "post" }));
        }
      }
    } else {
      throw new Error(`Unknown plugin hook key: ${String(key)}`);
    }

    // if (this.hooks[key]) {
    //   if (!isPluginHookField(key)) {
    //     const hooks = this.hooks[key];
    //     if (options?.order) {
    //       if (options?.order === "pre") {
    //         // result.push(
    //         //   ...(hooks.preOrdered ?? []).map(hook => {
    //         //     const plugin = this.plugins.find(
    //         //       p => p.plugin.name === hook.plugin.name
    //         //     );
    //         //     if (!plugin) {
    //         //       throw new Error(
    //         //         `Could not find plugin context for plugin "${
    //         //           hook.plugin.name
    //         //         }".`
    //         //       );
    //         //     }

    //         //     return {
    //         //       handler: hook.handler,
    //         //       context: plugin.context
    //         //     };
    //         //   })
    //         // );
    //         // result.push(
    //         //   ...(hooks.preEnforced ?? []).map(h => {
    //         //     const plugin = this.plugins.find(
    //         //       p => p.plugin.name === h.plugin.name
    //         //     );
    //         //     if (!plugin) {
    //         //       throw new Error(
    //         //         `Could not find plugin context for plugin "${
    //         //           h.plugin.name
    //         //         }".`
    //         //       );
    //         //     }

    //         //     return {
    //         //       handler: h.handler,
    //         //       context: plugin.context
    //         //     };
    //         //   })
    //         // );
    //       } else if (options?.order === "post") {
    //         result.push(
    //           ...(hooks.postOrdered ?? []).map(h => {
    //             const plugin = this.plugins.find(
    //               p => p.plugin.name === h.plugin.name
    //             );
    //             if (!plugin) {
    //               throw new Error(
    //                 `Could not find plugin context for plugin "${
    //                   h.plugin.name
    //                 }".`
    //               );
    //             }

    //             return {
    //               handler: h.handler,
    //               context: plugin.context
    //             };
    //           })
    //         );
    //         result.push(
    //           ...(hooks.postEnforced ?? []).map(h => {
    //             const plugin = this.plugins.find(
    //               p => p.plugin.name === h.plugin.name
    //             );
    //             if (!plugin) {
    //               throw new Error(
    //                 `Could not find plugin context for plugin "${
    //                   h.plugin.name
    //                 }".`
    //               );
    //             }

    //             return {
    //               handler: h.handler,
    //               context: plugin.context
    //             };
    //           })
    //         );
    //       } else {
    //         result.push(
    //           ...(hooks.normal ?? []).map(h => {
    //             const plugin = this.plugins.find(
    //               p => p.plugin.name === h.plugin.name
    //             );
    //             if (!plugin) {
    //               throw new Error(
    //                 `Could not find plugin context for plugin "${
    //                   h.plugin.name
    //                 }".`
    //               );
    //             }

    //             return {
    //               handler: h.handler,
    //               context: plugin.context
    //             };
    //           })
    //         );
    //       }
    //     } else {
    //       result.push(...this.selectHooks(key, { order: "pre" }));
    //       result.push(...this.selectHooks(key, { order: "normal" }));
    //       result.push(...this.selectHooks(key, { order: "post" }));
    //     }
    //   } else {
    //     result.push(
    //       ...this.hooks[key].map(h => {
    //         const plugin = this.plugins.find(
    //           p => p.plugin.name === h.plugin.name
    //         );
    //         if (!plugin) {
    //           throw new Error(
    //             `Could not find plugin context for plugin "${h.plugin.name}".`
    //           );
    //         }

    //         return {
    //           handler: h.handler,
    //           context: plugin.context
    //         };
    //       })
    //     );
    //   }
    // }

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
