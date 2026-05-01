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
  EnvironmentContext,
  EnvironmentResolvedConfig,
  ExecutionContext,
  InferOverridableConfig,
  LogFn,
  Logger,
  LoggerOptions,
  Plugin,
  PluginContext,
  ResolvedConfig
} from "@powerlines/core";
import { ExecutionOptions } from "@powerlines/core";
import { GLOBAL_ENVIRONMENT } from "@powerlines/core/constants";
import type {
  Unstable_ContextInternal,
  Unstable_EnvironmentContext
} from "@powerlines/core/types/_internal";
import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { readJsonFile } from "@stryke/fs/json";
import { deepClone } from "@stryke/helpers/deep-clone";
import { joinPaths } from "@stryke/path/join";
import { isObject } from "@stryke/type-checks/is-object";
import { PackageJson } from "@stryke/types/package-json";
import chalk from "chalk";
import {
  createDefaultEnvironment,
  createEnvironment
} from "../_internal/helpers/environment";
import { PowerlinesContext } from "./context";
import { PowerlinesEnvironmentContext } from "./environment-context";

export class PowerlinesExecutionContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>
  extends PowerlinesContext<TResolvedConfig>
  implements ExecutionContext<TResolvedConfig>
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
   * A record of all environments by name
   */
  #environments: Record<string, Unstable_EnvironmentContext<TResolvedConfig>> =
    {};

  /**
   * The plugins added to this execution context, which may be used to track the plugins that have been added to the context and ensure that they are properly registered and executed during the build process. This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   */
  #plugins: Plugin<PluginContext<TResolvedConfig>>[] = [];

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param options - The options for resolving the context.
   * @returns A promise that resolves to the new context.
   */
  public static override async fromInitialConfig<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: ExecutionOptions,
    initialConfig: TResolvedConfig["initialConfig"]
  ): Promise<PowerlinesExecutionContext<TResolvedConfig>> {
    const context = new PowerlinesExecutionContext<TResolvedConfig>(
      options,
      initialConfig
    );
    await context.init();

    return context;
  }

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param options - The options for resolving the context.
   * @returns A promise that resolves to the new context.
   */
  public static async fromInlineConfig<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: ExecutionOptions,
    initialConfig: TResolvedConfig["initialConfig"],
    inlineConfig: TResolvedConfig["inlineConfig"]
  ): Promise<PowerlinesExecutionContext<TResolvedConfig>> {
    const context = new PowerlinesExecutionContext<TResolvedConfig>(
      options,
      initialConfig
    );
    await context.init();
    await context.setInlineConfig(inlineConfig);

    return context;
  }

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

    for (const environment of Object.values(this.environments)) {
      environment.$$internal = value;
    }
  }

  /**
   * The unique identifier of the execution context, which can be used for logging and other purposes to distinguish between different executions in the same process.
   */
  public get id(): string {
    return this.options.executionId;
  }

  /**
   * A record of all environments by name
   */
  public get environments(): Record<
    string,
    Unstable_EnvironmentContext<TResolvedConfig>
  > {
    return this.#environments;
  }

  public get plugins(): Array<Plugin<PluginContext<TResolvedConfig>>> {
    return this.#plugins;
  }

  /**
   * Creates a new instance.
   *
   * @param options - The options to use for creating the context, including the resolved configuration and workspace settings.
   * @param initialConfig - The initial configuration options to use for the context, which can be used to provide default values for configuration options that may be overridden by user configuration or inline configuration. This is typically the configuration options provided by the user in a configuration file on disk, and can include any relevant settings such as environment definitions, plugin configurations, and other parameters that may be relevant to the execution of a Powerlines command.
   */
  protected constructor(
    options: ExecutionOptions,
    initialConfig: TResolvedConfig["initialConfig"] = {}
  ) {
    super(options, initialConfig);
    this.initialOptions = options;
    this.initialConfig = initialConfig;
  }

  /**
   * A setter function to populate the inline config values provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed. This function can be used to update the context with the inline configuration values, which may be used during the configuration resolution process to ensure that the final configuration reflects both the user configuration and any inline configuration provided during execution.
   *
   * @param config - The inline configuration values to set.
   * @returns A promise that resolves when the inline configuration values have been set.
   */
  public override async setInlineConfig(
    config: TResolvedConfig["inlineConfig"]
  ): Promise<void> {
    await super.setInlineConfig(config);
    if (this.inlineConfig.command === "new") {
      const workspacePackageJsonPath = joinPaths(
        this.config.cwd,
        "package.json"
      );
      if (!existsSync(workspacePackageJsonPath)) {
        throw new Error(
          `The workspace package.json file could not be found at ${workspacePackageJsonPath}`
        );
      }

      this.packageJson = await readJsonFile<PackageJson>(
        workspacePackageJsonPath
      );
    }
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
        executionId: this.id,
        executionIndex: this.options.executionIndex
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
      executionId: this.id,
      executionIndex: this.options.executionIndex
    });
  }

  /**
   * A function to copy the context and update the fields for a specific environment
   *
   * @param environment - The environment configuration to use.
   * @returns A new context instance with the updated environment.
   */
  public async createEnvironment(
    environment: EnvironmentResolvedConfig<TResolvedConfig>["environment"]
  ): Promise<Unstable_EnvironmentContext<TResolvedConfig>> {
    const context =
      await PowerlinesEnvironmentContext.createEnvironment<TResolvedConfig>(
        deepClone(this.initialOptions),
        deepClone(this.config) as TResolvedConfig,
        deepClone(this.overriddenConfig) as InferOverridableConfig<
          EnvironmentResolvedConfig<TResolvedConfig>
        >,
        deepClone(
          environment
        ) as EnvironmentResolvedConfig<TResolvedConfig>["environment"]
      );

    context.$$internal = this.$$internal;

    context.dependencies = deepClone<typeof this.dependencies>(
      this.dependencies
    );
    context.devDependencies = deepClone<typeof this.devDependencies>(
      this.devDependencies
    );
    context.persistedMeta = deepClone<typeof this.persistedMeta>(
      this.persistedMeta
    );
    context.resolvePatterns = deepClone<typeof this.resolvePatterns>(
      this.resolvePatterns
    );

    context.powerlinesPath ??= this.powerlinesPath;
    context.resolver ??= this.resolver;

    context.plugins = [];
    for (const plugin of this.plugins) {
      await context.addPlugin(plugin);
    }

    for (const [key, value] of Object.entries(this)) {
      if (
        ![
          "fs",
          "$$internal",
          "initialOptions",
          "options",
          "config",
          "initialConfig",
          "inlineConfig",
          "userConfig",
          "pluginConfig",
          "overriddenConfig",
          "environmentConfig",
          "dependencies",
          "devDependencies",
          "persistedMeta",
          "packageJson",
          "projectJson",
          "tsconfig",
          "resolver",
          "plugins",
          "environments"
        ].includes(key)
      ) {
        if (isObject(value) || Array.isArray(value)) {
          (context as any)[key] = deepClone(value);
        } else {
          (context as any)[key] = value;
        }
      }
    }

    return context;
  }

  /**
   * Update the context using a new inline configuration options
   */
  public override async resolveConfig() {
    await super.resolveConfig();

    await Promise.all(
      toArray(
        this.config.environments &&
          Object.keys(this.config.environments).length > 0
          ? Object.keys(this.config.environments).map(name =>
              createEnvironment(name, this.config)
            )
          : createDefaultEnvironment(this.config)
      ).map(async env => {
        this.#environments[env.name] = await this.createEnvironment(env);
      })
    );
  }

  /**
   * Add a plugin to the API context and all environments
   *
   * @param plugin - The plugin to add.
   */
  public async addPlugin(plugin: Plugin<PluginContext<TResolvedConfig>>) {
    this.plugins.push(plugin);

    await Promise.all(
      Object.keys(this.environments).map(async name => {
        await this.environments[name]!.addPlugin(plugin);
      })
    );
  }

  /**
   * Get an environment by name, or the default environment if no name is provided
   *
   * @param name - The name of the environment to retrieve.
   * @returns The requested environment context.
   */
  public async getEnvironment(name?: string) {
    let environment: EnvironmentContext<TResolvedConfig> | undefined;
    if (name) {
      environment = this.environments[name];
    }

    if (Object.keys(this.environments).length === 1) {
      environment = this.environments[Object.keys(this.environments)[0]!];

      this.trace({
        meta: { category: "plugins" },
        message: `Applying the only configured environment: ${chalk.bold.cyanBright(
          environment?.config.environment?.name
        )}`
      });
    }

    if (!environment) {
      if (name) {
        throw new Error(`Environment "${name}" not found.`);
      }

      environment =
        await PowerlinesEnvironmentContext.createEnvironment<TResolvedConfig>(
          deepClone(this.options),
          deepClone(this.config) as TResolvedConfig,
          deepClone(this.overriddenConfig) as InferOverridableConfig<
            EnvironmentResolvedConfig<TResolvedConfig>
          >,
          deepClone(
            createDefaultEnvironment(this.config)
          ) as EnvironmentResolvedConfig<TResolvedConfig>["environment"]
        );

      environment.plugins = [];
      for (const plugin of this.plugins) {
        await environment.addPlugin(plugin);
      }

      this.warn({
        meta: { category: "plugins" },
        message: `No environment specified, and no default environment found. Using a temporary default environment: ${chalk.bold.cyanBright(
          environment.config.environment?.name
        )}`
      });
    }

    return environment;
  }

  /**
   * A safe version of `getEnvironment` that returns `undefined` if the environment is not found
   *
   * @param name - The name of the environment to retrieve.
   * @returns The requested environment context or `undefined` if not found.
   */
  public async getEnvironmentSafe(
    name?: string
  ): Promise<EnvironmentContext<TResolvedConfig> | undefined> {
    try {
      return await this.getEnvironment(name);
    } catch {
      return undefined;
    }
  }

  /**
   * A function to merge all configured environments into a single context.
   *
   * @remarks
   * If only one environment is configured, that environment will be returned directly.
   *
   * @returns A promise that resolves to a merged/global environment context.
   */
  public async toEnvironment(): Promise<EnvironmentContext<TResolvedConfig>> {
    let environment: EnvironmentContext<TResolvedConfig>;
    if (Object.keys(this.environments).length > 1) {
      environment = await this.createEnvironment(
        createEnvironment<TResolvedConfig>(GLOBAL_ENVIRONMENT, this.config)
      );

      this.debug({
        meta: { category: "plugins" },
        message: `Combined all ${Object.keys(this.environments).length} environments into a single global context.`
      });
    } else {
      environment = await this.getEnvironment();
    }

    return environment;
  }
}
