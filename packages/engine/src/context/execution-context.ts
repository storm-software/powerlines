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
  InlineConfig,
  Plugin,
  PluginContext,
  ResolvedConfig,
  ResolvedExecutionOptions,
  UserConfig
} from "@powerlines/core";
import { GLOBAL_ENVIRONMENT } from "@powerlines/core/constants";
import type {
  Unstable_ContextInternal,
  Unstable_EnvironmentContext,
  Unstable_ExecutionContext
} from "@powerlines/core/types/_internal";
import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { readJsonFile } from "@stryke/fs/json";
import { resolvePackage } from "@stryke/fs/resolve";
import { deepClone } from "@stryke/helpers/deep-clone";
import { joinPaths } from "@stryke/path/join";
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
  #environments: Record<string, Unstable_EnvironmentContext<TResolvedConfig>> =
    {};

  #plugins: Plugin<PluginContext<TResolvedConfig>>[] = [];

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param options - The options for resolving the context.
   * @returns A promise that resolves to the new context.
   */
  public static override async fromOptions<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: ResolvedExecutionOptions
  ): Promise<ExecutionContext<TResolvedConfig>> {
    const context = new PowerlinesExecutionContext<TResolvedConfig>(options);
    await context.init(options);

    const powerlinesPath = await resolvePackage("powerlines");
    if (!powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }
    context.powerlinesPath = powerlinesPath;

    return context;
  }

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param options - The options for resolving the context.
   * @returns A promise that resolves to the new context.
   */
  public static async fromConfig<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: ResolvedExecutionOptions,
    config: InlineConfig
  ): Promise<ExecutionContext<TResolvedConfig>> {
    const context = new PowerlinesExecutionContext<TResolvedConfig>(options);
    await context.init(options);

    context.config.inlineConfig = config;
    if (context.config.inlineConfig.command === "new") {
      const workspacePackageJsonPath = joinPaths(
        context.config.cwd,
        "package.json"
      );
      if (!existsSync(workspacePackageJsonPath)) {
        throw new Error(
          `The workspace package.json file could not be found at ${workspacePackageJsonPath}`
        );
      }

      context.packageJson = await readJsonFile<PackageJson>(
        workspacePackageJsonPath
      );
    }

    await context.setup();

    const powerlinesPath = await resolvePackage("powerlines");
    if (!powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }
    context.powerlinesPath = powerlinesPath;

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
  public override get $$internal(): Unstable_ContextInternal<TResolvedConfig> {
    return super.$$internal;
  }

  /**
   * Internal context fields and methods
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public override set $$internal(
    value: Unstable_ContextInternal<TResolvedConfig>
  ) {
    super.$$internal = value;
    for (const environment of Object.values(this.environments)) {
      environment.$$internal = super.$$internal;
    }
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
   */
  protected constructor(options: ResolvedExecutionOptions) {
    super(options);
  }

  /**
   * Creates a clone of the current context with the same configuration and workspace settings. This can be useful for running multiple builds in parallel or for creating isolated contexts for different parts of the build process.
   *
   * @remarks
   * The cloned context will have the same configuration and workspace settings as the original context, but will have a different build ID, release ID, and timestamp. The virtual file system and caches will also be separate between the original and cloned contexts.
   *
   * @returns A promise that resolves to the cloned context.
   */
  public override async clone(): Promise<ExecutionContext<TResolvedConfig>> {
    const clone =
      (await PowerlinesExecutionContext.fromOptions<TResolvedConfig>(
        this.options
      )) as Unstable_ExecutionContext<TResolvedConfig>;

    clone.config.userConfig = deepClone(this.config.userConfig) as UserConfig;
    clone.config.inlineConfig = deepClone(
      this.config.inlineConfig
    ) as InlineConfig;
    clone.config.pluginConfig = deepClone(
      this.config.pluginConfig
    ) as Partial<UserConfig>;

    await clone.setup();
    clone.$$internal = this.$$internal;

    return this.copyTo(clone) as ExecutionContext<TResolvedConfig>;
  }

  /**
   * A function to copy the context and update the fields for a specific environment
   *
   * @param environment - The environment configuration to use.
   * @returns A new context instance with the updated environment.
   */
  public async in(
    environment: EnvironmentResolvedConfig
  ): Promise<Unstable_EnvironmentContext<TResolvedConfig>> {
    const context: Unstable_EnvironmentContext<TResolvedConfig> =
      await PowerlinesEnvironmentContext.fromConfig(
        deepClone(this.options),
        deepClone(this.config) as TResolvedConfig,
        deepClone(environment) as EnvironmentResolvedConfig
      );

    context.$$internal = this.$$internal;
    context.plugins = [];

    for (const plugin of this.plugins) {
      await context.addPlugin(plugin);
    }

    return context;
  }

  /**
   * Update the context using a new inline configuration options
   */
  public override async setup() {
    await super.setup();

    await Promise.all(
      toArray(
        this.config.environments &&
          Object.keys(this.config.environments).length > 0
          ? Object.keys(this.config.environments).map(name =>
              createEnvironment(name, this.config)
            )
          : createDefaultEnvironment(this.config)
      ).map(async env => {
        this.#environments[env.name] = await this.in(env);
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

      this.debug(
        `Applying the only configured environment: ${chalk.bold.cyanBright(
          environment?.environment.name
        )}`
      );
    }

    if (!environment) {
      if (name) {
        throw new Error(`Environment "${name}" not found.`);
      }

      environment = await this.in(createDefaultEnvironment(this.config));

      this.warn(
        `No environment specified, and no default environment found. Using a temporary default environment: ${chalk.bold.cyanBright(
          environment?.environment.name
        )}`
      );
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
      environment = await this.in(
        createEnvironment(GLOBAL_ENVIRONMENT, this.config)
      );

      this.debug(
        `Combined all ${Object.keys(this.environments).length} environments into a single global context.`
      );
    } else {
      environment = await this.getEnvironment();
    }

    return environment;
  }
}
