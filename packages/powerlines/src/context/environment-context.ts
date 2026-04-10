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

import { createLog } from "@powerlines/core/lib/logger";
import { resolvePackage } from "@stryke/fs/resolve";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNull } from "@stryke/type-checks/is-null";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { ArrayValues } from "@stryke/types/array";
import { extractHooks } from "powerlines/_internal/helpers/hooks";
import { PLUGIN_NON_HOOK_FIELDS } from "../constants";
import {
  dedupeHooklist,
  isPlugin,
  isPluginConfig,
  isPluginHookField
} from "../plugin-utils";
import type {
  EnvironmentContext,
  EnvironmentContextPlugin,
  EnvironmentResolvedConfig,
  HooksList,
  HooksListItem,
  LogFn,
  Plugin,
  PluginConfig,
  PluginContext,
  ResolvedConfig,
  SelectHookResult,
  SelectHookResultItem,
  SelectHooksOptions,
  WorkspaceConfig
} from "../types";
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
  #hooks: Record<string, HooksList<PluginContext<TResolvedConfig>>> =
    {} as Record<string, HooksList<PluginContext<TResolvedConfig>>>;

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

  /**
   * Create a new logger instance
   *
   * @param name - The name to use for the logger instance
   * @returns A logger function
   */
  public override createLog(name: string | null = null): LogFn {
    return createLog(name, {
      ...this.config,
      logLevel: isNull(this.config.logLevel) ? "silent" : this.config.logLevel,
      environment: this.environment?.name
    });
  }

  /**
   * The hooks registered by plugins in this environment
   */
  public get hooks(): Record<
    string,
    HooksList<PluginContext<TResolvedConfig>>
  > {
    return this.#hooks;
  }

  /**
   * Creates a clone of the current context with the same configuration and workspace settings. This can be useful for running multiple builds in parallel or for creating isolated contexts for different parts of the build process.
   *
   * @remarks
   * The cloned context will have the same configuration and workspace settings as the original context, but will have a different build ID, release ID, and timestamp. The virtual file system and caches will also be separate between the original and cloned contexts.
   *
   * @returns A promise that resolves to the cloned context.
   */
  public override async clone(): Promise<EnvironmentContext<TResolvedConfig>> {
    const clone =
      await PowerlinesEnvironmentContext.fromConfig<TResolvedConfig>(
        this.workspaceConfig,
        this.config
      );
    await clone.withUserConfig(this.config);

    return this.copyTo(clone);
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

    this.#hooks = Object.entries(
      Object.keys(resolvedPlugin)
        .filter(
          key =>
            !PLUGIN_NON_HOOK_FIELDS.includes(
              key as ArrayValues<typeof PLUGIN_NON_HOOK_FIELDS>
            )
        )
        .reduce(
          (ret, key) =>
            extractHooks<TResolvedConfig>(context, ret, resolvedPlugin, key),
          this.hooks
        )
    ).reduce(
      (ret, [key, value]) => {
        if (isSetObject(value)) {
          Object.entries(value).forEach(([type, list]) => {
            ret[key] ??= {} as HooksList<PluginContext<TResolvedConfig>>;
            ret[key][type as keyof (typeof ret)[typeof key]] =
              dedupeHooklist<PluginContext<TResolvedConfig>>(list);
          });
        }

        return ret;
      },
      {} as Record<string, HooksList<PluginContext<TResolvedConfig>>>
    );
  }

  /**
   * Retrieves the hook handlers for a specific hook name
   */
  public selectHooks<TKey extends string>(
    key: TKey,
    options?: SelectHooksOptions
  ): SelectHookResult<PluginContext<TResolvedConfig>, TKey> {
    const result = [] as SelectHookResult<PluginContext<TResolvedConfig>, TKey>;

    if (
      isPluginHookField<PluginContext<TResolvedConfig>>(key) &&
      this.hooks[key]
    ) {
      if (this.hooks[key]) {
        if (options?.order) {
          const mapHooksToResult = (
            hooksList: HooksListItem<PluginContext<TResolvedConfig>, string>[]
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
            result.push(...mapHooksToResult(this.hooks[key].preOrdered ?? []));
            result.push(...mapHooksToResult(this.hooks[key].preEnforced ?? []));
          } else if (options?.order === "post") {
            result.push(...mapHooksToResult(this.hooks[key].postOrdered ?? []));
            result.push(
              ...mapHooksToResult(this.hooks[key].postEnforced ?? [])
            );
          } else {
            result.push(...mapHooksToResult(this.hooks[key].normal ?? []));
          }
        } else {
          result.push(...this.selectHooks(key, { order: "pre" }));
          result.push(...this.selectHooks(key, { order: "normal" }));
          result.push(...this.selectHooks(key, { order: "post" }));
        }
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

  /**
   * Creates a clone of the current context with the same configuration and workspace settings. This can be useful for running multiple builds in parallel or for creating isolated contexts for different parts of the build process.
   *
   * @remarks
   * The cloned context will have the same configuration and workspace settings as the original context, but will have a different build ID, release ID, and timestamp. The virtual file system and caches will also be separate between the original and cloned contexts.
   *
   * @returns The cloned context.
   */
  protected override copyTo(
    context: EnvironmentContext<TResolvedConfig>
  ): EnvironmentContext<TResolvedConfig> {
    context.plugins = this.plugins;

    return super.copyTo(context) as EnvironmentContext<TResolvedConfig>;
  }
}
