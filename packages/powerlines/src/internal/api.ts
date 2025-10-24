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

import { formatLogMessage } from "@storm-software/config-tools/logger/console";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { copyFiles } from "@stryke/fs/copy-file";
import { existsSync } from "@stryke/fs/exists";
import { createDirectory } from "@stryke/fs/helpers";
import { install } from "@stryke/fs/install";
import { listFiles } from "@stryke/fs/list-files";
import { isPackageExists } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { isError } from "@stryke/type-checks/is-error";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNumber } from "@stryke/type-checks/is-number";
import { isPromiseLike } from "@stryke/type-checks/is-promise";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { MaybePromise } from "@stryke/types/base";
import chalk from "chalk";
import Handlebars from "handlebars";
import { getParsedTypeScriptConfig } from "../lib/typescript/tsconfig";
import { writeMetaFile } from "../lib/utilities/meta";
import {
  checkDedupe,
  isPlugin,
  isPluginConfig,
  isPluginConfigObject,
  isPluginConfigTuple
} from "../lib/utilities/plugin-helpers";
import { writeFile } from "../lib/utilities/write-file";
import type {
  BuildInlineConfig,
  CleanInlineConfig,
  DocsInlineConfig,
  InitialUserConfig,
  LintInlineConfig,
  NewInlineConfig,
  PluginConfig,
  PluginConfigObject,
  PluginConfigTuple,
  PluginFactory,
  PrepareInlineConfig,
  ReleaseInlineConfig
} from "../types/config";
import type {
  APIContext,
  EnvironmentContext,
  PluginContext
} from "../types/context";
import { HookKeys, InferHookParameters } from "../types/hooks";
import type { Plugin } from "../types/plugin";
import { EnvironmentResolvedConfig, ResolvedConfig } from "../types/resolved";
import { __VFS_INIT__, __VFS_REVERT__ } from "../types/vfs";
import { PowerlinesAPIContext } from "./contexts/api-context";
import { generateTypes } from "./helpers/generate-types";
import { callHook, CallHookOptions } from "./helpers/hooks";
import { installDependencies } from "./helpers/install-dependencies";
import {
  initializeTsconfig,
  resolveTsconfig
} from "./helpers/resolve-tsconfig";

/**
 * The Powerlines API class
 *
 * @remarks
 * This class is responsible for managing the Powerlines project lifecycle, including initialization, building, and finalization.
 *
 * @public
 */
export class PowerlinesAPI<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> implements AsyncDisposable
{
  /**
   * The Powerlines context
   */
  #context: APIContext<TResolvedConfig>;

  /**
   * The Powerlines context
   */
  public get context() {
    return this.#context;
  }

  /**
   * Create a new Powerlines API instance
   *
   * @param context - The Powerlines context
   */
  private constructor(context: APIContext<TResolvedConfig>) {
    this.#context = context;
  }

  /**
   * Initialize the Powerlines API
   */
  public static async from<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    workspaceRoot: string,
    config: InitialUserConfig<TResolvedConfig["userConfig"]>
  ): Promise<PowerlinesAPI<TResolvedConfig>> {
    const api = new PowerlinesAPI<TResolvedConfig>(
      await PowerlinesAPIContext.from(workspaceRoot, config)
    );

    for (const plugin of api.context.config.plugins ?? []) {
      await api.#addPlugin(plugin);
    }

    if (api.context.plugins.length === 0) {
      api.context.log(
        LogLevelLabel.WARN,
        "No Powerlines plugins were specified in the options. Please ensure this is correct, as it is generally not recommended."
      );
    }

    const pluginConfig = await callHook<TResolvedConfig>(
      await api.context.getEnvironment(),
      "config",
      {
        sequential: true,
        result: "merge"
      }
    );
    await api.context.withUserConfig(
      pluginConfig as TResolvedConfig["userConfig"],
      { isHighPriority: false }
    );

    return api;
  }

  /**
   * Prepare the Powerlines API
   */
  public async prepare(
    inlineConfig:
      | PrepareInlineConfig
      | NewInlineConfig
      | CleanInlineConfig
      | BuildInlineConfig
      | LintInlineConfig
      | DocsInlineConfig
      | ReleaseInlineConfig = { command: "prepare" }
  ) {
    this.context.log(
      LogLevelLabel.TRACE,
      " 🏗️  Preparing the Powerlines project"
    );

    this.context.log(
      LogLevelLabel.TRACE,
      " ⚙️  Aggregating configuration options for the Powerlines project"
    );

    await this.context.withInlineConfig(inlineConfig);
    await this.#executeEnvironments(async context => {
      context.log(
        LogLevelLabel.TRACE,
        `Initializing the processing options for the Powerlines project.`
      );

      await this.callPreHook(context, "configResolved");

      await initializeTsconfig<TResolvedConfig>(context);

      await this.callNormalHook(context, "configResolved");

      context.log(
        LogLevelLabel.DEBUG,
        `The configuration provided ${
          toArray(context.config.entry).length
        } entry point(s), Powerlines has found ${
          context.entry.length
        } entry files(s) for the ${context.config.title} project${
          context.entry.length > 0 && context.entry.length < 10
            ? `: \n${context.entry
                .map(
                  entry =>
                    `- ${entry.input.file || entry.file}${
                      entry.output ? ` -> ${entry.output}` : ""
                    }`
                )
                .join(" \n")}`
            : ""
        }.`
      );

      await resolveTsconfig<TResolvedConfig>(context);
      await installDependencies(context);

      await this.callPostHook(context, "configResolved");

      context.log(
        LogLevelLabel.TRACE,
        `Powerlines configuration has been resolved: \n\n${formatLogMessage(
          context.config
        )}`
      );

      context.fs[__VFS_INIT__]();

      await writeMetaFile(context);
      context.persistedMeta = context.meta;

      if (!existsSync(context.cachePath)) {
        await createDirectory(context.cachePath);
      }

      if (!existsSync(context.dataPath)) {
        await createDirectory(context.dataPath);
      }

      await this.callPreHook(context, "prepare");

      if (context.config.projectType === "application") {
        context.log(LogLevelLabel.TRACE, "Generating built-in barrel file");

        //       await context.fs.writeBuiltinFile(
        //         "index",
        //         joinPaths(context.builtinsPath, "index.ts"),
        //         `
        // ${getFileHeader(context)}

        // ${(await context.fs.listBuiltinFiles())
        //   .filter(
        //     file =>
        //       !isParentPath(file.path, joinPaths(context.builtinsPath, "log")) &&
        //       !isParentPath(file.path, joinPaths(context.builtinsPath, "storage"))
        //   )
        //   .map(
        //     file =>
        //       `export * from "./${replacePath(
        //         file.path,
        //         context.builtinsPath
        //       ).replace(`.${findFileExtensionSafe(file.path)}`, "")}";`
        //   )
        //   .join("\n")}
        // `
        //       );
      }

      if (context.config.output.dts !== false) {
        await generateTypes(context);
      }

      await this.callNormalHook(context, "prepare");

      // Re-resolve the tsconfig to ensure it is up to date
      context.tsconfig = getParsedTypeScriptConfig(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        context.config.tsconfig
      );
      if (!context.tsconfig) {
        throw new Error("Failed to parse the TypeScript configuration file.");
      }

      await this.callPostHook(context, "prepare");

      await writeMetaFile(context);

      // await compressDirectory(
      //   joinPaths(context.options.projectRoot, context.artifactsDir),
      //   {
      //     destination: joinPaths(
      //       context.envPaths.cache,
      //       context.options.projectRoot,
      //       `${context.meta.checksum}.tar.gz`
      //     )
      //   }
      // );

      context.fs[__VFS_REVERT__]();
    });

    this.context.log(
      LogLevelLabel.INFO,
      "Powerlines API has been prepared successfully"
    );
  }

  /**
   * Create a new Powerlines project
   *
   * @remarks
   * This method will create a new Powerlines project in the current directory.
   *
   * @param inlineConfig - The inline configuration for the new command
   * @returns A promise that resolves when the project has been created
   */
  public async new(inlineConfig: NewInlineConfig) {
    this.context.log(
      LogLevelLabel.INFO,
      "🆕 Creating a new Powerlines project"
    );

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      context.log(
        LogLevelLabel.TRACE,
        `Initializing the processing options for the Powerlines project.`
      );

      await this.callPreHook(context, "new");

      const files = await listFiles(
        joinPaths(context.powerlinesPath, "files/common/**/*.hbs")
      );
      for (const file of files) {
        context.log(LogLevelLabel.TRACE, `Adding template file: ${file}`);

        const template = Handlebars.compile(file);
        await writeFile(
          context.log,
          joinPaths(context.config.projectRoot, file.replace(".hbs", "")),
          template(context)
        );
      }

      await this.callNormalHook(context, "new");

      if (context.config.projectType === "application") {
        const files = await listFiles(
          joinPaths(context.powerlinesPath, "files/application/**/*.hbs")
        );
        for (const file of files) {
          context.log(
            LogLevelLabel.TRACE,
            `Adding application template file: ${file}`
          );

          const template = Handlebars.compile(file);
          await writeFile(
            context.log,
            joinPaths(context.config.projectRoot, file.replace(".hbs", "")),
            template(context)
          );
        }
      } else {
        const files = await listFiles(
          joinPaths(context.powerlinesPath, "files/library/**/*.hbs")
        );
        for (const file of files) {
          context.log(
            LogLevelLabel.TRACE,
            `Adding library template file: ${file}`
          );

          const template = Handlebars.compile(file);
          await writeFile(
            context.log,
            joinPaths(context.config.projectRoot, file.replace(".hbs", "")),
            template(context)
          );
        }
      }

      await this.callPostHook(context, "new");
    });

    this.context.log(LogLevelLabel.TRACE, "Powerlines - New command completed");
  }

  /**
   * Clean any previously prepared artifacts
   *
   * @remarks
   * This method will remove the previous Powerlines artifacts from the project.
   *
   * @param inlineConfig - The inline configuration for the clean command
   * @returns A promise that resolves when the clean command has completed
   */
  public async clean(
    inlineConfig: CleanInlineConfig | PrepareInlineConfig = {
      command: "clean"
    }
  ) {
    this.context.log(
      LogLevelLabel.INFO,
      "🧹 Cleaning the previous Powerlines artifacts"
    );

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      await callHook<TResolvedConfig>(context, "clean", {
        sequential: true
      });
    });

    this.context.log(
      LogLevelLabel.TRACE,
      "Powerlines - Clean command completed"
    );
  }

  /**
   * Lint the project
   *
   * @param inlineConfig - The inline configuration for the lint command
   * @returns A promise that resolves when the lint command has completed
   */
  public async lint(
    inlineConfig: LintInlineConfig | BuildInlineConfig = { command: "lint" }
  ) {
    // if (this.context.persistedMeta?.checksum !== this.context.meta.checksum) {
    //   this.context.log(
    //     LogLevelLabel.INFO,
    //     "The Powerlines project has been modified since the last time `prepare` was ran. Re-preparing the project."
    //   );

    //   await this.generate(inlineConfig);
    // }

    this.context.log(LogLevelLabel.INFO, "📋 Linting the Powerlines project");

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      if (context.config.lint !== false) {
        await this.callHook(context, "lint");
      }
    });

    this.context.log(LogLevelLabel.TRACE, "Powerlines linting completed");
  }

  /**
   * Build the project
   *
   * @remarks
   * This method will build the Powerlines project, generating the necessary artifacts.
   *
   * @param inlineConfig - The inline configuration for the build command
   * @returns A promise that resolves when the build command has completed
   */
  public async build(inlineConfig: BuildInlineConfig = { command: "build" }) {
    // const persistedMeta = await getPersistedMeta(this.context);
    // const checksum = await getChecksum(this.context.config.projectRoot);

    // if (persistedMeta?.checksum !== checksum) {
    //   this.context.log(
    //     LogLevelLabel.INFO,
    //     "The Powerlines project has been modified since the last time `prepare` was ran. Re-preparing the project."
    //   );

    //   await this.generate(inlineConfig);
    // }

    this.context.log(LogLevelLabel.INFO, "📦  Building the Powerlines project");

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      await this.callPreHook(context, "build");
      await this.callNormalHook(context, "build");

      await Promise.all(
        context.config.output.assets.map(async asset => {
          context.log(
            LogLevelLabel.DEBUG,
            `Copying asset(s): ${chalk.redBright(
              context.workspaceConfig.workspaceRoot === asset.input
                ? asset.glob
                : joinPaths(
                    replacePath(
                      asset.input,
                      context.workspaceConfig.workspaceRoot
                    ),
                    asset.glob
                  )
            )} -> ${chalk.greenBright(
              joinPaths(
                replacePath(
                  asset.output,
                  context.workspaceConfig.workspaceRoot
                ),
                asset.glob
              )
            )} ${
              Array.isArray(asset.ignore) && asset.ignore.length > 0
                ? ` (ignoring: ${asset.ignore
                    .map(i => chalk.yellowBright(i))
                    .join(", ")})`
                : ""
            }`
          );

          await copyFiles(asset, asset.output);
        })
      );

      await this.callPostHook(context, "build");
    });

    // await build(this.context, this.#hooks);

    this.context.log(LogLevelLabel.TRACE, "Powerlines build completed");
  }

  /**
   * Prepare the documentation for the project
   *
   * @param inlineConfig - The inline configuration for the docs command
   * @returns A promise that resolves when the documentation generation has completed
   */
  public async docs(inlineConfig: DocsInlineConfig = { command: "docs" }) {
    this.context.log(
      LogLevelLabel.INFO,
      "📓 Generating documentation for the Powerlines project"
    );

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      context.log(
        LogLevelLabel.TRACE,
        "Writing documentation for the Powerlines project artifacts."
      );

      await this.prepare(inlineConfig);
      await this.#executeEnvironments(async context => {
        await this.callHook(context, "docs");
      });
    });

    this.#context.log(
      LogLevelLabel.TRACE,
      "Powerlines documentation generation completed"
    );
  }

  /**
   * Release the project
   *
   * @remarks
   * This method will prepare and build the Powerlines project, generating the necessary artifacts for release.
   *
   * @param inlineConfig - The inline configuration for the release command
   */
  public async release(
    inlineConfig: ReleaseInlineConfig = { command: "release" }
  ) {
    this.context.log(LogLevelLabel.INFO, "📦 Releasing the Powerlines project");

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      await this.callHook(context, "release");
    });

    this.context.log(LogLevelLabel.TRACE, "Powerlines release completed");
  }

  /**
   * Finalization process
   *
   * @remarks
   * This step includes any final processes or clean up required by Powerlines. It will be run after each Powerlines command.
   *
   * @returns A promise that resolves when the finalization process has completed
   */
  public async finalize() {
    this.context.log(
      LogLevelLabel.TRACE,
      "Powerlines finalize execution started"
    );

    await this.#executeEnvironments(async context => {
      await this.callHook(context, "finalize");

      context.fs[__VFS_REVERT__]();
    });

    this.context.log(
      LogLevelLabel.TRACE,
      "Powerlines finalize execution completed"
    );
  }

  /**
   * Calls a hook in parallel
   *
   * @param hook - The hook to call
   * @param options - Options for calling the hook
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callHookParallel<
    TKey extends HookKeys<PluginContext<TResolvedConfig>>
  >(
    hook: TKey,
    options: Omit<CallHookOptions, "sequential"> & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return callHook<TResolvedConfig>(
      isSetObject(options?.environment)
        ? options.environment
        : await this.#context.getEnvironment(options?.environment),
      hook,
      { ...options, sequential: false },
      ...args
    );
  }

  /**
   * Calls a hook in sequence
   *
   * @param hook - The hook to call
   * @param options - Options for calling the hook
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callHookSequential<
    TKey extends HookKeys<PluginContext<TResolvedConfig>>
  >(
    hook: TKey,
    options: Omit<CallHookOptions, "sequential"> & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return callHook<TResolvedConfig>(
      isSetObject(options?.environment)
        ? options.environment
        : await this.#context.getEnvironment(options?.environment),
      hook,
      { ...options, sequential: true },
      ...args
    );
  }

  /**
   * Calls the `"pre"` ordered hooks in sequence
   *
   * @param environment - The environment to use for the hook call
   * @param hook - The hook to call
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callPreHook<
    TKey extends HookKeys<PluginContext<TResolvedConfig>>
  >(
    environment: string | EnvironmentContext<TResolvedConfig>,
    hook: TKey,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return this.callHookSequential(
      hook,
      { order: "pre", environment },
      ...args
    );
  }

  /**
   * Calls the `"post"` ordered hooks in sequence
   *
   * @param environment - The environment to use for the hook call
   * @param hook - The hook to call
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callPostHook<
    TKey extends HookKeys<PluginContext<TResolvedConfig>>
  >(
    environment: string | EnvironmentContext<TResolvedConfig>,
    hook: TKey,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return this.callHookSequential(
      hook,
      { order: "post", environment },
      ...args
    );
  }

  /**
   * Calls a hook in sequence
   *
   * @param environment - The environment to use for the hook call
   * @param hook - The hook to call
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callNormalHook<
    TKey extends HookKeys<PluginContext<TResolvedConfig>>
  >(
    environment: string | EnvironmentContext<TResolvedConfig>,
    hook: TKey,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return this.callHookSequential(
      hook,
      { order: "normal", environment },
      ...args
    );
  }

  /**
   * Calls the `"pre"` and `"post"` ordered hooks, as well as the normal hooks in sequence
   *
   * @param environment - The environment to use for the hook call
   * @param hook - The hook to call
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callHook<TKey extends HookKeys<PluginContext<TResolvedConfig>>>(
    environment: string | EnvironmentContext<TResolvedConfig>,
    hook: TKey,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return this.callHookSequential(hook, { environment }, ...args);
  }

  async [Symbol.asyncDispose]() {
    await this.finalize();
  }

  /**
   * Get the configured environments
   *
   * @returns The configured environments
   */
  async #getEnvironments() {
    if (
      !this.context.config.environments ||
      Object.keys(this.context.config.environments).length <= 1
    ) {
      this.context.log(
        LogLevelLabel.DEBUG,
        "No environments are configured for this Powerlines project. Using the default environment."
      );

      return [await this.context.getEnvironment()];
    }

    this.context.log(
      LogLevelLabel.DEBUG,
      `Found ${Object.keys(this.context.config.environments).length} configured environment(s) for this Powerlines project.`
    );

    return (
      await Promise.all(
        Object.entries(this.context.config.environments).map(
          async ([name, config]) => {
            const environment = await this.context.getEnvironmentSafe(name);
            if (!environment) {
              const resolvedEnvironment = await this.callHookParallel(
                "configEnvironment",
                {
                  environment: name
                },
                name,
                config
              );

              if (resolvedEnvironment) {
                this.context.environments[name] = await this.context.in(
                  resolvedEnvironment as EnvironmentResolvedConfig
                );
              }
            }

            return this.context.environments[name];
          }
        )
      )
    ).filter(context => isSet(context));
  }

  /**
   * Execute a handler function for each environment
   *
   * @param handle - The handler function to execute for each environment
   */
  async #executeEnvironments(
    handle: (context: EnvironmentContext<TResolvedConfig>) => MaybePromise<void>
  ) {
    await Promise.all(
      (await this.#getEnvironments()).map(async context => {
        return Promise.resolve(handle(context));
      })
    );
  }

  /**
   * Add a Powerlines plugin used in the build process
   *
   * @param config - The import path of the plugin to add
   */
  async #addPlugin(config: PluginConfig<PluginContext<TResolvedConfig>>) {
    if (config) {
      const plugin = await this.#initPlugin(config);
      if (!plugin) {
        return;
      }

      if (plugin.dependsOn) {
        for (const required of plugin.dependsOn) {
          await this.#addPlugin(required);
        }
      }

      this.context.log(
        LogLevelLabel.DEBUG,
        `Successfully initialized the ${chalk.bold.cyanBright(
          plugin.name
        )} plugin`
      );

      await this.context.addPlugin(plugin);
    }
  }

  /**
   * Initialize a Powerlines plugin
   *
   * @param config - The configuration for the plugin
   * @returns The initialized plugin instance, or null if the plugin was a duplicate
   * @throws Will throw an error if the plugin cannot be found or is invalid
   */
  async #initPlugin(
    config: PluginConfig<PluginContext<TResolvedConfig>>
  ): Promise<Plugin<PluginContext<TResolvedConfig>> | null> {
    let awaited = config;
    if (isPromiseLike(config)) {
      awaited = await Promise.resolve(config);
    }

    if (!isPluginConfig(awaited)) {
      throw new Error(
        `Invalid plugin specified in the configuration - ${JSON.stringify(awaited)}. Please ensure the value is a plugin name, an object with the \`plugin\` and \`props\` properties, or an instance of \`Plugin\`.`
      );
    }

    let plugin!: Plugin<PluginContext<TResolvedConfig>>;
    if (isPlugin<TResolvedConfig>(awaited)) {
      plugin = awaited;
    } else if (isFunction(awaited)) {
      plugin = (await Promise.resolve(awaited())) as Plugin<
        PluginContext<TResolvedConfig>
      >;
    } else if (isSetString(awaited)) {
      const resolved = await this.#resolvePlugin(awaited);
      if (isFunction(resolved)) {
        plugin = await Promise.resolve(resolved());
      } else {
        plugin = resolved;
      }
    } else if (isPluginConfigTuple(awaited) || isPluginConfigObject(awaited)) {
      let pluginConfig!:
        | string
        | PluginFactory<PluginContext<TResolvedConfig>>
        | Plugin<PluginContext<TResolvedConfig>>;
      let pluginOptions: any;

      if (isPluginConfigTuple(awaited)) {
        pluginConfig = awaited[0] as Plugin<PluginContext<TResolvedConfig>>;
        pluginOptions =
          (awaited as PluginConfigTuple)?.length === 2 ? awaited[1] : undefined;
      } else {
        pluginConfig = (awaited as PluginConfigObject).plugin as Plugin<
          PluginContext<TResolvedConfig>
        >;
        pluginOptions = (awaited as PluginConfigObject).options;
      }

      if (isSetString(pluginConfig)) {
        const resolved = await this.#resolvePlugin(pluginConfig);
        if (isFunction(resolved)) {
          plugin = await Promise.resolve(
            pluginOptions ? resolved(pluginOptions) : resolved()
          );
        } else {
          plugin = resolved;
        }
      } else if (isFunction(pluginConfig)) {
        plugin = await Promise.resolve(pluginConfig(pluginOptions));
      } else if (isPlugin(pluginConfig)) {
        plugin = pluginConfig;
      }
    }

    if (!plugin) {
      throw new Error(
        `The plugin configuration ${JSON.stringify(awaited)} is invalid. This configuration must point to a valid Powerlines plugin module.`
      );
    }

    if (!isPlugin(plugin)) {
      throw new Error(
        `The plugin option ${JSON.stringify(plugin)} does not export a valid module. This configuration must point to a valid Powerlines plugin module.`
      );
    }

    if (checkDedupe<TResolvedConfig>(plugin, this.context.plugins)) {
      this.context.log(
        LogLevelLabel.TRACE,
        `Duplicate ${chalk.bold.cyanBright(
          plugin.name
        )} plugin dependency detected - Skipping initialization.`
      );

      return null;
    }

    this.context.log(
      LogLevelLabel.TRACE,
      `Initializing the ${chalk.bold.cyanBright(plugin.name)} plugin...`
    );

    return plugin;
  }

  async #resolvePlugin<TOptions>(
    pluginPath: string
  ): Promise<
    | Plugin<PluginContext<TResolvedConfig>>
    | ((
        options?: TOptions
      ) => MaybePromise<Plugin<PluginContext<TResolvedConfig>>>)
  > {
    if (
      pluginPath.startsWith("@") &&
      pluginPath.split("/").filter(Boolean).length > 2
    ) {
      const splits = pluginPath.split("/").filter(Boolean);
      pluginPath = `${splits[0]}/${splits[1]}`;
    }

    const isInstalled = isPackageExists(pluginPath, {
      paths: [
        this.context.workspaceConfig.workspaceRoot,
        this.context.config.projectRoot
      ]
    });
    if (!isInstalled && this.context.config.skipInstalls !== true) {
      this.#context.log(
        LogLevelLabel.WARN,
        `The plugin package "${pluginPath}" is not installed. It will be installed automatically.`
      );

      const result = await install(pluginPath, {
        cwd: this.context.config.projectRoot
      });
      if (isNumber(result.exitCode) && result.exitCode > 0) {
        this.#context.log(LogLevelLabel.ERROR, result.stderr);
        throw new Error(
          `An error occurred while installing the build plugin package "${pluginPath}" `
        );
      }
    }

    try {
      // First check if the package has a "plugin" subdirectory - @scope/package/plugin
      const module = await this.context.resolver.plugin.import<{
        plugin?:
          | Plugin<PluginContext<TResolvedConfig>>
          | ((
              options?: TOptions
            ) => MaybePromise<Plugin<PluginContext<TResolvedConfig>>>);
        default?:
          | Plugin<PluginContext<TResolvedConfig>>
          | ((
              options?: TOptions
            ) => MaybePromise<Plugin<PluginContext<TResolvedConfig>>>);
      }>(
        this.context.resolver.plugin.esmResolve(joinPaths(pluginPath, "plugin"))
      );

      const result = module.plugin ?? module.default;
      if (!result) {
        throw new Error(
          `The plugin package "${pluginPath}" does not export a valid module.`
        );
      }

      return result;
    } catch (error) {
      try {
        const module = await this.context.resolver.plugin.import<{
          plugin?:
            | Plugin<PluginContext<TResolvedConfig>>
            | ((
                options?: TOptions
              ) => MaybePromise<Plugin<PluginContext<TResolvedConfig>>>);
          default?:
            | Plugin<PluginContext<TResolvedConfig>>
            | ((
                options?: TOptions
              ) => MaybePromise<Plugin<PluginContext<TResolvedConfig>>>);
        }>(this.context.resolver.plugin.esmResolve(pluginPath));

        const result = module.plugin ?? module.default;
        if (!result) {
          throw new Error(
            `The plugin package "${pluginPath}" does not export a valid module.`
          );
        }

        return result;
      } catch {
        if (!isInstalled) {
          throw new Error(
            `The plugin package "${
              pluginPath
            }" is not installed. Please install the package using the command: "npm install ${
              pluginPath
            } --save-dev"`
          );
        } else {
          throw new Error(
            `An error occurred while importing the build plugin package "${
              pluginPath
            }":
${isError(error) ? error.message : String(error)}

Note: Please ensure the plugin package's default export is a class that extends \`Plugin\` with a constructor that excepts a single arguments of type \`PluginOptions\`.`
          );
        }
      }
    }
  }
}
