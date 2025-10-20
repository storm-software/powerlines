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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path/join-paths";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import chalk from "chalk";
import { loadWorkspaceConfig } from "../../lib/config-file";
import { InitialUserConfig, LogFn, WorkspaceConfig } from "../../types/config";
import {
  APIContext,
  EnvironmentContext,
  PluginContext
} from "../../types/context";
import { Plugin } from "../../types/plugin";
import {
  EnvironmentResolvedConfig,
  ResolvedConfig
} from "../../types/resolved";
import {
  createDefaultEnvironment,
  createEnvironment
} from "../helpers/environment";
import { PowerlinesContext } from "./context";
import { PowerlinesEnvironmentContext } from "./environment-context";

export class PowerlinesAPIContext<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >
  extends PowerlinesContext<TResolvedConfig>
  implements APIContext<TResolvedConfig>
{
  #environments: Record<string, EnvironmentContext<TResolvedConfig>> = {};

  #plugins: Plugin<PluginContext<TResolvedConfig>>[] = [];

  #log!: LogFn;

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param workspaceRoot - The root directory of the workspace.
   * @param config - The user configuration options.
   * @returns A promise that resolves to the new context.
   */
  public static override async from<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    workspaceRoot: string,
    config: InitialUserConfig<TResolvedConfig["userConfig"]>
  ): Promise<APIContext<TResolvedConfig>> {
    const context = new PowerlinesAPIContext<TResolvedConfig>(
      await loadWorkspaceConfig(workspaceRoot, config.root)
    );
    await context.withUserConfig(config);

    context.corePackagePath = process.env.POWERLINES_LOCAL
      ? joinPaths(context.workspaceConfig.workspaceRoot, "packages/core")
      : await resolvePackage("powerlines");
    if (!context.corePackagePath) {
      throw new Error("Could not resolve powerlines package location.");
    }

    return context;
  }

  /**
   * A record of all environments by name
   */
  public get environments(): Record<
    string,
    EnvironmentContext<TResolvedConfig>
  > {
    return this.#environments;
  }

  public override get log(): LogFn {
    if (!this.#log) {
      this.#log = this.createLog("engine");
    }

    return this.#log;
  }

  public get plugins(): Array<Plugin<PluginContext<TResolvedConfig>>> {
    return this.#plugins;
  }

  protected constructor(workspaceConfig: WorkspaceConfig) {
    super(workspaceConfig);
  }

  /**
   * Initialize the context with the provided configuration options
   *
   * @param config - The partial user configuration to use for initialization.
   */
  protected override async init(
    config: Partial<TResolvedConfig["userConfig"]> = {}
  ) {
    await super.init(config);

    await Promise.all(
      toArray(
        this.config.userConfig.environments &&
          Object.keys(this.config.userConfig.environments).length > 0
          ? Object.keys(this.config.userConfig.environments).map(name =>
              createEnvironment(name, this.config.userConfig)
            )
          : createDefaultEnvironment(this.config.userConfig)
      ).map(async env => {
        this.#environments[env.name] = await this.in(env);
      })
    );
  }

  /**
   * A function to copy the context and update the fields for a specific environment
   *
   * @param environment - The environment configuration to use.
   * @returns A new context instance with the updated environment.
   */
  public async in(
    environment: EnvironmentResolvedConfig
  ): Promise<EnvironmentContext<TResolvedConfig>> {
    let context: EnvironmentContext<TResolvedConfig>;
    if (this.environments[environment.name]) {
      context = this.environments[environment.name] as any;
    } else {
      context = (await PowerlinesEnvironmentContext.fromConfig(
        this.workspaceConfig,
        this.config
      )) as any;
    }

    if (isSetObject(this.config.inlineConfig)) {
      await context.withInlineConfig(this.config.inlineConfig);
    }

    context.environment = environment;
    context.plugins = [];

    for (const plugin of this.plugins) {
      await context.addPlugin(plugin);
    }

    return context;
  }

  public async addPlugin(plugin: Plugin<PluginContext<TResolvedConfig>>) {
    this.plugins.push(plugin);

    await Promise.all(
      Object.keys(this.environments).map(async name => {
        await this.environments[name]!.addPlugin(plugin);
      })
    );
  }

  public async getEnvironment(name?: string) {
    let environment: EnvironmentContext<TResolvedConfig> | undefined;
    if (name) {
      environment = this.environments[name];
    }

    if (Object.keys(this.environments).length === 1) {
      environment = this.environments[Object.keys(this.environments)[0]!];

      this.log(
        LogLevelLabel.DEBUG,
        `Applying the only configured environment: ${chalk.bold.cyanBright(
          environment?.environment.name
        )}`
      );
    }

    if (!environment) {
      if (name) {
        throw new Error(`Environment "${name}" not found.`);
      }

      environment = await this.in(
        createDefaultEnvironment(this.config.userConfig)
      );

      this.log(
        LogLevelLabel.WARN,
        `No environment specified, and no default environment found. Using a temporary default environment: ${chalk.bold.cyanBright(
          environment?.environment.name
        )}`
      );
    }

    return environment;
  }

  public async getEnvironmentSafe(
    name?: string
  ): Promise<EnvironmentContext<TResolvedConfig> | undefined> {
    try {
      return await this.getEnvironment(name);
    } catch {
      return undefined;
    }
  }
}
