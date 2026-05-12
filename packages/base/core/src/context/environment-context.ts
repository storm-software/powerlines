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

import { omit } from "@stryke/helpers/omit";
import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { ArrayValues } from "@stryke/types/array";
import { uuid } from "@stryke/unique-id/uuid";
import { DEFAULT_ENVIRONMENT, PLUGIN_NON_HOOK_FIELDS } from "../constants";
import { extractHooks } from "../lib/hooks";
import { resolvePlugins } from "../lib/plugins";
import {
  dedupeHooklist,
  formatConfig,
  isPlugin,
  isPluginConfig,
  isPluginHookField,
  mergeConfig
} from "../plugin-utils";
import type {
  EnvironmentContext,
  EnvironmentPlugin,
  EnvironmentResolvedConfig,
  ExecutionContext,
  ExecutionOptions,
  HooksList,
  HooksListItem,
  InferOverridableConfig,
  Logger,
  LoggerOptions,
  PluginConfig,
  PluginContext,
  ResolvedConfig,
  SelectHookResult,
  SelectHooksOptions
} from "../types";
import { PowerlinesContext } from "./context";
import { createPluginContext } from "./plugin-context";

export class PowerlinesEnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
>
  extends PowerlinesContext<
    EnvironmentResolvedConfig<TResolvedConfig>,
    TSystemContext
  >
  implements EnvironmentContext<TResolvedConfig, TSystemContext>
{
  /**
   * The hooks registered by plugins in this environment
   */
  #hooks: Record<
    string,
    HooksList<PluginContext<TResolvedConfig, TSystemContext>>
  > = {};

  /**
   * The execution context associated with this environment, which provides access to the project configuration, environment, and utility functions for performing the build. The execution context is used to manage the state and behavior of the build process across multiple environments, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
   */
  #execution: ExecutionContext<TResolvedConfig, TSystemContext>;

  /**
   * Create a new context from the config.
   *
   * @param execution - The execution context for the build process, which provides access to the project configuration, environment, and utility functions for performing the build. The context is used to manage the state and behavior of the build process, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
   * @param options - The resolved execution options.
   * @param config - The user configuration options.
   * @param overriddenConfig - The configuration options that should override all other configuration sources, such as CLI flags or environment variables. This is used to ensure that certain configuration values take precedence over any other settings defined in the user configuration or environment configuration, allowing for dynamic overrides based on the execution context.
   * @returns A promise that resolves to an instance of the PowerlinesEnvironmentContext class, initialized with the provided configuration and environment data.
   */
  public static async from<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig,
    TSystemContext = unknown
  >(
    execution: ExecutionContext<TResolvedConfig, TSystemContext>,
    options: ExecutionOptions,
    config: TResolvedConfig,
    overriddenConfig: InferOverridableConfig<
      EnvironmentResolvedConfig<TResolvedConfig>
    >
  ): Promise<PowerlinesEnvironmentContext<TResolvedConfig, TSystemContext>> {
    const context = new PowerlinesEnvironmentContext<
      TResolvedConfig,
      TSystemContext
    >(execution, options, config, overriddenConfig);
    await context.init();

    return context;
  }

  /**
   * The configuration options provided by plugins added by the user (and other plugins)
   */
  protected override environmentConfig: EnvironmentResolvedConfig<TResolvedConfig>["environment"] =
    {} as EnvironmentResolvedConfig<TResolvedConfig>["environment"];

  /**
   * The list of plugins applied to this environment
   */
  public plugins: EnvironmentPlugin<TResolvedConfig, TSystemContext>[] = [];

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
    HooksList<PluginContext<TResolvedConfig, TSystemContext>>
  > {
    return this.#hooks;
  }

  /**
   * The execution context associated with this environment, which provides access to the project configuration, environment, and utility functions for performing the build. The execution context is used to manage the state and behavior of the build process across multiple environments, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public get unstable_execution(): ExecutionContext<
    TResolvedConfig,
    TSystemContext
  > {
    return this.#execution;
  }

  /**
   * A setter function to populate the environment config values provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed. This function can be used to update the context with the environment configuration values, which may be used during the configuration resolution process to ensure that the final configuration reflects both the user configuration and any environment configuration provided during execution.
   *
   * @param config - The environment configuration values to set.
   * @returns A promise that resolves when the environment configuration values have been set.
   */
  public async setEnvironmentConfig(
    config: EnvironmentResolvedConfig<TResolvedConfig>["environment"]
  ): Promise<void> {
    this.logger.debug({
      meta: { category: "config" },
      message: `Updating environment configuration object: \n${formatConfig(config)}`
    });

    this.environmentConfig = config;
    await this.resolveConfig();
  }

  /**
   * Create a new logger instance
   *
   * @param options - The configuration options to use for the logger instance, which can be used to customize the appearance and behavior of the log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance.
   * @returns A logger client instance that can be used to generate log messages with consistent formatting and metadata.
   */
  public override createLogger(options: LoggerOptions): Logger {
    return super.createLogger({
      ...options,
      environment: this.config.environment?.name
    });
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

  /**
   * A function used internally to add a plugin to the context and update the configuration options
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public async unstable_addPlugin(
    plugin: PluginConfig<PluginContext<TResolvedConfig, TSystemContext>>
  ): Promise<void> {
    const plugins = await resolvePlugins<TResolvedConfig, TSystemContext>(
      this,
      plugin
    );
    for (const plugin of plugins) {
      let resolvedPlugin = plugin as EnvironmentPlugin<
        TResolvedConfig,
        TSystemContext
      >;
      if (isFunction(plugin.applyToEnvironment)) {
        const result = (await Promise.resolve(
          plugin.applyToEnvironment(this.config.environment) as Promise<any>
        )) as
          | boolean
          | PluginConfig<PluginContext<TResolvedConfig, TSystemContext>>;

        if (!result || (isObject(result) && Object.keys(result).length === 0)) {
          return;
        }

        if (
          isPluginConfig<PluginContext<TResolvedConfig, TSystemContext>>(result)
        ) {
          return this.unstable_addPlugin(result);
        }

        resolvedPlugin = (
          isPlugin<PluginContext<TResolvedConfig, TSystemContext>>(result)
            ? result
            : plugin
        ) as EnvironmentPlugin<TResolvedConfig, TSystemContext>;
      }

      const id = uuid();
      const context = createPluginContext<TResolvedConfig, TSystemContext>(
        id,
        resolvedPlugin,
        this
      );

      resolvedPlugin.$$internal = {
        id,
        context
      };

      this.plugins.push(resolvedPlugin);

      this.#hooks = Object.entries(
        Object.keys(resolvedPlugin)
          .filter(
            key =>
              key !== "$$internal" &&
              !PLUGIN_NON_HOOK_FIELDS.includes(
                key as ArrayValues<typeof PLUGIN_NON_HOOK_FIELDS>
              )
          )
          .reduce(
            (ret, key) =>
              extractHooks<TResolvedConfig, TSystemContext>(
                context,
                ret,
                resolvedPlugin,
                key
              ),
            this.hooks
          )
      ).reduce(
        (ret, [key, value]) => {
          if (isSetObject(value)) {
            Object.entries(value).forEach(([type, list]) => {
              ret[key] ??= {};
              ret[key][type as keyof (typeof ret)[typeof key]] =
                dedupeHooklist<PluginContext<TResolvedConfig, TSystemContext>>(
                  list
                );
            });
          }

          return ret;
        },
        {} as Record<
          string,
          HooksList<PluginContext<TResolvedConfig, TSystemContext>>
        >
      );
    }
  }

  /**
   * Retrieves the hook handlers for a specific hook name
   */
  public selectHooks<TKey extends string>(
    key: TKey,
    options?: SelectHooksOptions
  ): SelectHookResult<PluginContext<TResolvedConfig, TSystemContext>, TKey> {
    const result = [] as SelectHookResult<
      PluginContext<TResolvedConfig, TSystemContext>,
      TKey
    >;

    if (
      isPluginHookField<PluginContext<TResolvedConfig, TSystemContext>>(key) &&
      this.hooks[key]
    ) {
      if (this.hooks[key]) {
        if (options?.order) {
          const mapHooksToResult = (
            hooksList: HooksListItem<
              PluginContext<TResolvedConfig, TSystemContext>,
              TKey
            >[]
          ): SelectHookResult<
            PluginContext<TResolvedConfig, TSystemContext>,
            TKey
          > =>
            hooksList.map(hook => {
              const plugin = this.plugins.find(
                p => p.name === hook.plugin.name
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
                context: plugin.$$internal.context
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

  /**
   *  A function to add a plugin to the context and update the configuration options. This function is used internally when applying plugins to the environment, and it ensures that the plugin is added to the list of plugins in the context and that any hooks or configuration options provided by the plugin are properly integrated into the context's state.
   *
   * @remarks
   * This function is used internally when applying plugins to the environment, and it ensures that the plugin is added to the list of plugins in the context and that any hooks or configuration options provided by the plugin are properly integrated into the context's state. It should not be called directly by external code, as it is intended for internal use only and may be subject to change without warning.
   *
   * @param options - The configuration options for the plugin, which may include properties such as the plugin name, hooks, and any other relevant metadata or settings that should be associated with the plugin when it is added to the context.
   * @param config - The resolved configuration for the environment, which may include properties such as the environment name, SSR settings, and other relevant configuration options that may affect how the plugin is applied to the environment.
   * @param overriddenConfig - The configuration options that should override all other configuration sources, such as CLI flags or environment variables. This is used to ensure that certain configuration values take precedence over any other settings defined in the user configuration or environment configuration, allowing for dynamic overrides based on the execution context.
   * @returns A promise that resolves when the plugin has been added to the context and the configuration has been updated accordingly.
   */
  protected constructor(
    execution: ExecutionContext<TResolvedConfig, TSystemContext>,
    options: ExecutionOptions,
    config: TResolvedConfig,
    overriddenConfig: InferOverridableConfig<
      EnvironmentResolvedConfig<TResolvedConfig>
    >
  ) {
    super(options);

    this.#execution = execution;
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
