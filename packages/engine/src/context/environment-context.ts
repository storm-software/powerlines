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

import type {
  EnvironmentContextPlugin,
  EnvironmentResolvedConfig,
  ExecutionOptions,
  HooksList,
  HooksListItem,
  InferOverridableConfig,
  LogFn,
  Logger,
  LoggerOptions,
  Plugin,
  PluginConfig,
  PluginContext,
  ResolvedConfig,
  SelectHookResult,
  SelectHooksOptions
} from "@powerlines/core";
import {
  DEFAULT_ENVIRONMENT,
  PLUGIN_NON_HOOK_FIELDS
} from "@powerlines/core/constants";
import {
  dedupeHooklist,
  isPlugin,
  isPluginConfig,
  isPluginHookField,
  mergeConfig
} from "@powerlines/core/plugin-utils";
import {
  Unstable_ContextInternal,
  Unstable_EnvironmentContext
} from "@powerlines/core/types/_internal";
import { omit } from "@stryke/helpers/omit";
import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { ArrayValues } from "@stryke/types/array";
import { uuid } from "@stryke/unique-id/uuid";
import { extractHooks } from "../_internal/helpers/hooks";
import { PowerlinesContext } from "./context";
import { createPluginContext } from "./plugin-context";

export class PowerlinesEnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>
  extends PowerlinesContext<EnvironmentResolvedConfig<TResolvedConfig>>
  implements Unstable_EnvironmentContext<TResolvedConfig>
{
  /**
   * Internal references storage
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  #internal = {} as Unstable_ContextInternal<TResolvedConfig>;

  /**
   * The hooks registered by plugins in this environment
   */
  #hooks: Record<string, HooksList<PluginContext<TResolvedConfig>>> = {};

  /**
   * Create a new context from the config.
   *
   * @param options - The resolved execution options.
   * @param config - The user configuration options.
   * @param overriddenConfig - The configuration options that should override all other configuration sources, such as CLI flags or environment variables. This is used to ensure that certain configuration values take precedence over any other settings defined in the user configuration or environment configuration, allowing for dynamic overrides based on the execution context.
   * @param environment - The resolved environment configuration, which may include additional properties or modifications made during the configuration loading process. This is used to provide context about the environment in which the command is being executed, allowing for environment-specific behavior and configuration resolution.
   * @returns A promise that resolves to an instance of the PowerlinesEnvironmentContext class, initialized with the provided configuration and environment data.
   */
  public static async createEnvironment<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: ExecutionOptions,
    config: TResolvedConfig,
    overriddenConfig: InferOverridableConfig<
      EnvironmentResolvedConfig<TResolvedConfig>
    >,
    environment: EnvironmentResolvedConfig<TResolvedConfig>["environment"]
  ): Promise<PowerlinesEnvironmentContext<TResolvedConfig>> {
    const context = new PowerlinesEnvironmentContext<TResolvedConfig>(
      options,
      config,
      overriddenConfig
    );
    await context.setEnvironmentConfig(environment);

    return context;
  }

  /**
   * The configuration options provided by plugins added by the user (and other plugins)
   */
  protected environmentConfig: EnvironmentResolvedConfig<TResolvedConfig>["environment"] =
    {} as EnvironmentResolvedConfig<TResolvedConfig>["environment"];

  /**
   * The list of plugins applied to this environment
   */
  public plugins: EnvironmentContextPlugin<TResolvedConfig>[] = [];

  /**
   * Internal context fields and methods
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public get $$internal(): Unstable_ContextInternal<TResolvedConfig> {
    return this.#internal;
  }

  /**
   * Internal context fields and methods
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public set $$internal(value: Unstable_ContextInternal<TResolvedConfig>) {
    this.#internal = value;
  }

  /**
   * The unique identifier of the environment associated with this context, which can be used for logging and other purposes to distinguish between different environments in the same process.
   */
  public get id(): string {
    return this.config.environment.id;
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
   * A setter function to populate the environment config values provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed. This function can be used to update the context with the environment configuration values, which may be used during the configuration resolution process to ensure that the final configuration reflects both the user configuration and any environment configuration provided during execution.
   *
   * @param config - The environment configuration values to set.
   * @returns A promise that resolves when the environment configuration values have been set.
   */
  protected async setEnvironmentConfig(
    config: EnvironmentResolvedConfig<TResolvedConfig>["environment"]
  ): Promise<void> {
    this.logger.debug({
      meta: { category: "config" },
      message: `Updating environment configuration object: \n${this.logConfig(config)}`
    });

    this.environmentConfig = config;
    await this.resolveConfig();
  }

  /**
   * Create a new logger instance
   *
   * @param options - The configuration options to use for the logger instance, which can be used to customize the appearance and behavior of the log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance.
   * @param logFn - The custom logging function to use for logging messages, which can be used to override the default logging behavior of the original logger.
   * @returns A logger client instance that can be used to generate log messages with consistent formatting and metadata.
   */
  public override createLogger(options: LoggerOptions, logFn?: LogFn): Logger {
    return super.createLogger(
      {
        ...options,
        environment: this.config.environment?.name
      },
      logFn
    );
  }

  /**
   * Extend the base logger with additional configuration options
   *
   * @param options - The configuration options to extend the base logger with, which can be used to add additional metadata or customize the appearance of log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance, as well as any additional metadata such as the plugin category or environment.
   * @returns A new logger client instance that extends the base logger with the provided configuration options.
   */
  public override extendLogger(options: LoggerOptions): Logger {
    return super.extendLogger({
      ...options,
      environment: this.config.environment?.name
    });
  }

  public async addPlugin(
    plugin: Plugin<PluginContext<TResolvedConfig>>
  ): Promise<void> {
    let resolvedPlugin = plugin;
    if (isFunction(plugin.applyToEnvironment)) {
      const result = (await Promise.resolve(
        plugin.applyToEnvironment(this.config.environment) as Promise<any>
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

    const id = uuid();
    const context = createPluginContext<TResolvedConfig>(
      id,
      resolvedPlugin,
      this
    );

    this.plugins.push({
      id,
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
            ret[key] ??= {};
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
              };
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
    options: ExecutionOptions,
    config: TResolvedConfig,
    overriddenConfig: InferOverridableConfig<
      EnvironmentResolvedConfig<TResolvedConfig>
    >
  ) {
    super(options, config.initialConfig);

    this.userConfig =
      config.userConfig ?? ({} as TResolvedConfig["userConfig"]);
    this.inlineConfig =
      config.inlineConfig ?? ({} as TResolvedConfig["inlineConfig"]);
    this.pluginConfig = config.pluginConfig ?? {};
    this.overriddenConfig = overriddenConfig;
  }

  /**
   * A function to merge the various configuration objects (initial, user, inline, and plugin) into a single resolved configuration object that can be used throughout the Powerlines process. This function takes into account the different sources of configuration and their respective priorities, ensuring that the final configuration reflects the intended settings for the project. The merged configuration is then returned as a new object that can be accessed through the `config` property of the context.
   *
   * @returns The merged configuration object that combines the initial, user, inline, and plugin configurations.
   */
  protected override mergeConfig(): EnvironmentResolvedConfig<TResolvedConfig> {
    return mergeConfig(
      {
        ...omit(this.environmentConfig ?? {}, [
          "name",
          "ssr",
          "preview",
          "consumer",
          "runtime"
        ]),
        environment: {
          name: this.environmentConfig?.name || DEFAULT_ENVIRONMENT
        },
        environmentConfig: this.environmentConfig ?? {}
      },
      super.mergeConfig()
    ) as EnvironmentResolvedConfig<TResolvedConfig>;
  }
}
