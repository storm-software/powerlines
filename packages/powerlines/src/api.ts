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

import { UNSAFE_APIContext } from "@powerlines/core/types/_internal";
import { formatLogMessage } from "@storm-software/config-tools/logger/console";
import { toArray } from "@stryke/convert/to-array";
import { copyFiles } from "@stryke/fs/copy-file";
import { existsSync } from "@stryke/fs/exists";
import { createDirectory } from "@stryke/fs/helpers";
import { install } from "@stryke/fs/install";
import { listFiles } from "@stryke/fs/list-files";
import { isPackageExists } from "@stryke/fs/package-fns";
import { resolvePackage } from "@stryke/fs/resolve";
import { omit } from "@stryke/helpers/omit";
import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { isError } from "@stryke/type-checks/is-error";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNumber } from "@stryke/type-checks/is-number";
import { isObject } from "@stryke/type-checks/is-object";
import { isPromiseLike } from "@stryke/type-checks/is-promise";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { MaybePromise, PartialKeys, RequiredKeys } from "@stryke/types/base";
import chalk from "chalk";
import Handlebars from "handlebars";
import packageJson from "../package.json" assert { type: "json" };
import {
  emitBuiltinTypes,
  formatTypes
} from "./_internal/helpers/generate-types";
import { callHook, mergeConfigs } from "./_internal/helpers/hooks";
import { installDependencies } from "./_internal/helpers/install-dependencies";
import { writeMetaFile } from "./_internal/helpers/meta";
import {
  getTsconfigDtsPath,
  initializeTsconfig,
  resolveTsconfig
} from "./_internal/helpers/resolve-tsconfig";
import { PowerlinesAPIContext } from "./context/api-context";
import {
  checkDedupe,
  findInvalidPluginConfig,
  isPlugin,
  isPluginConfig,
  isPluginConfigObject,
  isPluginConfigTuple
} from "./plugin-utils";
import type {
  APIContext,
  BuildInlineConfig,
  CleanInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  EnvironmentContext,
  InitialUserConfig,
  LintInlineConfig,
  NewInlineConfig,
  Plugin,
  PluginConfig,
  PluginConfigObject,
  PluginConfigTuple,
  PluginContext,
  PluginFactory,
  PrepareInlineConfig,
  TypegenInlineConfig,
  TypegenResult
} from "./types";
import {
  API,
  CallHookOptions,
  EnvironmentResolvedConfig,
  InferHookParameters,
  ResolvedConfig
} from "./types";
import {
  getParsedTypeScriptConfig,
  isIncludeMatchFound
} from "./typescript/tsconfig";
import { format, formatFolder, getTypescriptFileHeader } from "./utils";

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
>
  implements API<TResolvedConfig>, AsyncDisposable
{
  /**
   * The Powerlines context
   */
  #context: UNSAFE_APIContext<TResolvedConfig>;

  /**
   * The Powerlines context
   */
  public get context(): APIContext<TResolvedConfig> {
    return this.#context;
  }

  /**
   * Create a new Powerlines API instance
   *
   * @param context - The Powerlines context
   */
  private constructor(context: APIContext<TResolvedConfig>) {
    this.#context = context as UNSAFE_APIContext<TResolvedConfig>;
  }

  /**
   * Initialize a Powerlines API instance
   *
   * @param workspaceRoot - The directory of the underlying workspace the Powerlines project exists in
   * @param config - An object containing the configuration required to run Powerlines tasks.
   * @returns A new instance of the Powerlines API
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
    api.#context.$$internal = {
      api,
      addPlugin: api.#addPlugin.bind(api)
    };

    api.context.info(
      `🔌 The Powerlines Engine v${packageJson.version} has started`
    );

    for (const plugin of api.context.config.plugins ?? []) {
      await api.#addPlugin(plugin);
    }

    if (api.context.plugins.length === 0) {
      api.context.warn(
        "No Powerlines plugins were specified in the options. Please ensure this is correct, as it is generally not recommended."
      );
    }

    const pluginConfig = await api.callHook("config", {
      environment: await api.context.getEnvironment(),
      sequential: true,
      result: "merge",
      merge: mergeConfigs
    });
    await api.context.withUserConfig(
      pluginConfig as TResolvedConfig["userConfig"],
      { isHighPriority: false }
    );

    return api;
  }

  /**
   * Generate the Powerlines typescript declaration file
   *
   * @remarks
   * This method will only generate the typescript declaration file for the Powerlines project. It is generally recommended to run the full `prepare` command, which will run this method as part of its process.
   *
   * @param inlineConfig - The inline configuration for the typegen command
   */
  public async typegen(
    inlineConfig: PartialKeys<TypegenInlineConfig, "command"> = {
      command: "typegen"
    }
  ) {
    this.context.info(
      " 🏗️  Generating typescript declarations for the Powerlines project"
    );

    this.context.debug(
      " Aggregating configuration options for the Powerlines project"
    );

    inlineConfig.command ??= "typegen";

    await this.context.withInlineConfig(
      inlineConfig as RequiredKeys<TypegenInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      context.debug(
        `Initializing the processing options for the Powerlines project.`
      );

      await this.callHook("configResolved", {
        environment: context,
        order: "pre"
      });

      await initializeTsconfig<TResolvedConfig>(context);

      await this.callHook("configResolved", {
        environment: context,
        order: "normal"
      });

      if (context.entry.length > 0) {
        context.debug(
          `The configuration provided ${
            isObject(context.config.input)
              ? Object.keys(context.config.input).length
              : toArray(context.config.input).length
          } entry point(s), Powerlines has found ${
            context.entry.length
          } entry files(s) for the ${context.config.title} project${
            context.entry.length > 0 && context.entry.length < 10
              ? `: \n${context.entry
                  .map(
                    entry =>
                      `- ${entry.file}${
                        entry.output ? ` -> ${entry.output}` : ""
                      }`
                  )
                  .join(" \n")}`
              : ""
          }`
        );
      } else {
        context.warn(
          `No entry files were found for the ${
            context.config.title
          } project. Please ensure this is correct. Powerlines plugins generally require at least one entry point to function properly.`
        );
      }

      await resolveTsconfig<TResolvedConfig>(context);
      await installDependencies(context);

      await this.callHook("configResolved", {
        environment: context,
        order: "post"
      });

      context.trace(
        `Powerlines configuration has been resolved: \n\n${formatLogMessage({
          ...context.config,
          userConfig: isSetObject(context.config.userConfig)
            ? omit(context.config.userConfig, ["plugins"])
            : undefined,
          inlineConfig: isSetObject(context.config.inlineConfig)
            ? omit(context.config.inlineConfig, ["plugins"])
            : undefined,
          plugins: context.plugins.map(plugin => plugin.plugin.name)
        })}`
      );

      if (!context.fs.existsSync(context.cachePath)) {
        await createDirectory(context.cachePath);
      }

      if (!context.fs.existsSync(context.dataPath)) {
        await createDirectory(context.dataPath);
      }

      await this.#typegen(context);

      this.context.debug("Formatting files generated during the typegen step.");

      await format(
        context,
        context.typegenPath,
        (await context.fs.read(context.typegenPath)) ?? ""
      );

      await writeMetaFile(context);
      context.persistedMeta = context.meta;
    });

    this.context.debug("✔ Powerlines typegen has completed successfully");
  }

  /**
   * Prepare the Powerlines API
   *
   * @remarks
   * This method will prepare the Powerlines API for use, initializing any necessary resources.
   *
   * @param inlineConfig - The inline configuration for the prepare command
   */
  public async prepare(
    inlineConfig:
      | PartialKeys<PrepareInlineConfig, "command">
      | PartialKeys<NewInlineConfig, "command">
      | PartialKeys<CleanInlineConfig, "command">
      | PartialKeys<BuildInlineConfig, "command">
      | PartialKeys<LintInlineConfig, "command">
      | PartialKeys<DocsInlineConfig, "command">
      | PartialKeys<DeployInlineConfig, "command"> = { command: "prepare" }
  ) {
    this.context.info(" 🏗️  Preparing the Powerlines project");

    this.context.debug(
      " Aggregating configuration options for the Powerlines project"
    );

    inlineConfig.command ??= "prepare";

    await this.context.withInlineConfig(
      inlineConfig as RequiredKeys<PrepareInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      context.debug(
        `Initializing the processing options for the Powerlines project.`
      );

      await this.callHook("configResolved", {
        environment: context,
        order: "pre"
      });

      await initializeTsconfig<TResolvedConfig>(context);

      await this.callHook("configResolved", {
        environment: context,
        order: "normal"
      });

      if (context.entry.length > 0) {
        context.debug(
          `The configuration provided ${
            isObject(context.config.input)
              ? Object.keys(context.config.input).length
              : toArray(context.config.input).length
          } entry point(s), Powerlines has found ${
            context.entry.length
          } entry files(s) for the ${context.config.title} project${
            context.entry.length > 0 && context.entry.length < 10
              ? `: \n${context.entry
                  .map(
                    entry =>
                      `- ${entry.file}${
                        entry.output ? ` -> ${entry.output}` : ""
                      }`
                  )
                  .join(" \n")}`
              : ""
          }`
        );
      } else {
        context.warn(
          `No entry files were found for the ${
            context.config.title
          } project. Please ensure this is correct. Powerlines plugins generally require at least one entry point to function properly.`
        );
      }

      await resolveTsconfig<TResolvedConfig>(context);
      await installDependencies(context);

      await this.callHook("configResolved", {
        environment: context,
        order: "post"
      });

      context.trace(
        `Powerlines configuration has been resolved: \n\n${formatLogMessage({
          ...context.config,
          userConfig: isSetObject(context.config.userConfig)
            ? omit(context.config.userConfig, ["plugins"])
            : undefined,
          inlineConfig: isSetObject(context.config.inlineConfig)
            ? omit(context.config.inlineConfig, ["plugins"])
            : undefined,
          plugins: context.plugins.map(plugin => plugin.plugin.name)
        })}`
      );

      if (!context.fs.existsSync(context.cachePath)) {
        await createDirectory(context.cachePath);
      }

      if (!context.fs.existsSync(context.dataPath)) {
        await createDirectory(context.dataPath);
      }

      await this.callHook("prepare", {
        environment: context,
        order: "pre"
      });
      await this.callHook("prepare", {
        environment: context,
        order: "normal"
      });

      await this.callHook("prepare", {
        environment: context,
        order: "post"
      });

      if (context.config.output.typegen !== false) {
        await this.#typegen(context);
      }

      this.context.debug("Formatting files generated during the prepare step.");

      await Promise.all([
        formatFolder(context, context.builtinsPath),
        formatFolder(context, context.entryPath)
      ]);

      await writeMetaFile(context);
      context.persistedMeta = context.meta;
    });

    this.context.debug("✔ Powerlines preparation has completed successfully");
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
  public async new(inlineConfig: PartialKeys<NewInlineConfig, "command">) {
    this.context.info(" 🆕 Creating a new Powerlines project");

    inlineConfig.command ??= "new";

    await this.prepare(
      inlineConfig as RequiredKeys<NewInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      context.debug(
        "Initializing the processing options for the Powerlines project."
      );

      await this.callHook("new", {
        environment: context,
        order: "pre"
      });

      const files = await listFiles(
        joinPaths(context.powerlinesPath, "files/common/**/*.hbs")
      );
      for (const file of files) {
        context.trace(`Adding template file to project: ${file}`);

        const template = Handlebars.compile(file);
        await context.fs.write(
          joinPaths(context.config.root, file.replace(".hbs", "")),
          template(context)
        );
      }

      await this.callHook("new", {
        environment: context,
        order: "normal"
      });

      if (context.config.projectType === "application") {
        const files = await listFiles(
          joinPaths(context.powerlinesPath, "files/application/**/*.hbs")
        );
        for (const file of files) {
          context.trace(`Adding application template file: ${file}`);

          const template = Handlebars.compile(file);
          await context.fs.write(
            joinPaths(context.config.root, file.replace(".hbs", "")),
            template(context)
          );
        }
      } else {
        const files = await listFiles(
          joinPaths(context.powerlinesPath, "files/library/**/*.hbs")
        );
        for (const file of files) {
          context.trace(`Adding library template file: ${file}`);

          const template = Handlebars.compile(file);
          await context.fs.write(
            joinPaths(context.config.root, file.replace(".hbs", "")),
            template(context)
          );
        }
      }

      await this.callHook("new", {
        environment: context,
        order: "post"
      });
    });

    this.context.debug("✔ Powerlines new command completed successfully");
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
    inlineConfig:
      | PartialKeys<CleanInlineConfig, "command">
      | PartialKeys<PrepareInlineConfig, "command"> = {
      command: "clean"
    }
  ) {
    this.context.info(" 🧹 Cleaning the previous Powerlines artifacts");

    inlineConfig.command ??= "clean";

    await this.prepare(
      inlineConfig as RequiredKeys<CleanInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      context.debug("Cleaning the project's dist and artifacts directories.");

      await context.fs.remove(
        joinPaths(
          context.workspaceConfig.workspaceRoot,
          context.config.output.path
        )
      );
      await context.fs.remove(
        joinPaths(
          context.workspaceConfig.workspaceRoot,
          context.config.root,
          context.config.output.artifactsPath
        )
      );

      await this.callHook("clean", {
        environment: context,
        sequential: false
      });
    });

    this.context.debug("✔ Powerlines cleaning completed successfully");
  }

  /**
   * Lint the project
   *
   * @param inlineConfig - The inline configuration for the lint command
   * @returns A promise that resolves when the lint command has completed
   */
  public async lint(
    inlineConfig:
      | PartialKeys<LintInlineConfig, "command">
      | PartialKeys<BuildInlineConfig, "command"> = { command: "lint" }
  ) {
    this.context.info(" 📝 Linting the Powerlines project");

    inlineConfig.command ??= "lint";
    await this.prepare(
      inlineConfig as RequiredKeys<LintInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      await this.callHook("lint", {
        environment: context,
        sequential: false
      });
    });

    this.context.debug("✔ Powerlines linting completed successfully");
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
  public async build(
    inlineConfig: PartialKeys<BuildInlineConfig, "command"> = {
      command: "build"
    }
  ) {
    this.context.info(" 📦  Building the Powerlines project");

    await this.context.generateChecksum();
    if (
      this.context.meta.checksum !== this.context.persistedMeta?.checksum ||
      this.context.config.skipCache
    ) {
      this.context.info(
        !this.context.persistedMeta?.checksum
          ? "No previous build cache found. Preparing the project for the initial build."
          : this.context.meta.checksum !== this.context.persistedMeta.checksum
            ? "The project has been modified since the last time `prepare` was ran. Re-preparing the project."
            : "The project is configured to skip cache. Re-preparing the project."
      );

      inlineConfig.command ??= "build";

      await this.prepare(
        inlineConfig as RequiredKeys<BuildInlineConfig, "command">
      );
    }

    if (this.context.config.singleBuild) {
      await this.#handleBuild(await this.#context.toEnvironment());
    } else {
      await this.#executeEnvironments(async context => {
        await this.#handleBuild(context);
      });
    }

    this.context.debug("✔ Powerlines build completed successfully");
  }

  /**
   * Prepare the documentation for the project
   *
   * @param inlineConfig - The inline configuration for the docs command
   * @returns A promise that resolves when the documentation generation has completed
   */
  public async docs(inlineConfig: DocsInlineConfig = { command: "docs" }) {
    this.context.info(
      " 📓 Generating documentation for the Powerlines project"
    );

    inlineConfig.command ??= "docs";
    await this.prepare(
      inlineConfig as RequiredKeys<DocsInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      context.debug(
        "Writing documentation for the Powerlines project artifacts."
      );

      inlineConfig.command ??= "docs";

      await this.prepare(
        inlineConfig as RequiredKeys<DocsInlineConfig, "command">
      );
      await this.#executeEnvironments(async context => {
        await this.callHook("docs", {
          environment: context
        });
      });
    });

    this.context.debug(
      "✔ Powerlines documentation generation completed successfully"
    );
  }

  /**
   * Deploy the project source code
   *
   * @remarks
   * This method will prepare and build the Powerlines project, generating the necessary artifacts for the deployment.
   *
   * @param inlineConfig - The inline configuration for the deploy command
   */
  public async deploy(
    inlineConfig: PartialKeys<DeployInlineConfig, "command"> = {
      command: "deploy"
    }
  ) {
    this.context.info(" 🚀 Deploying the Powerlines project");

    inlineConfig.command ??= "deploy";

    await this.prepare(
      inlineConfig as RequiredKeys<DeployInlineConfig, "command">
    );
    await this.#executeEnvironments(async context => {
      await this.callHook("deploy", { environment: context });
    });

    this.context.debug("✔ Powerlines deploy completed successfully");
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
    this.context.info(" 🏁 Powerlines finalization processes started");

    await this.#executeEnvironments(async context => {
      await this.callHook("finalize", { environment: context });
      await context.fs.dispose();
    });

    this.context.debug("✔ Powerlines finalization completed successfully");
  }

  /**
   * Invokes the configured plugin hooks
   *
   * @remarks
   * By default, it will call the `"pre"`, `"normal"`, and `"post"` ordered hooks in sequence
   *
   * @param hook - The hook to call
   * @param options - The options to provide to the hook
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  public async callHook<TKey extends string>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) {
    return callHook<TResolvedConfig, TKey>(
      isSetObject(options?.environment)
        ? options.environment
        : await this.#context.getEnvironment(options?.environment),
      hook,
      { sequential: true, ...options },
      ...args
    );
  }

  /**
   * Dispose of the Powerlines API instance
   *
   * @remarks
   * This method will finalize the Powerlines API instance, cleaning up any resources used.
   */
  public async [Symbol.asyncDispose]() {
    await this.finalize();
  }

  async #handleBuild(context: EnvironmentContext<TResolvedConfig>) {
    await this.callHook("build", {
      environment: context,
      order: "pre"
    });

    context.debug(
      "Formatting the generated entry files before the build process starts."
    );
    await formatFolder(context, context.entryPath);

    await this.callHook("build", {
      environment: context,
      order: "normal"
    });

    if (context.config.output.copy) {
      context.debug("Copying project's files from build output directory.");

      const destinationPath = isParentPath(
        appendPath(
          context.config.output.path,
          context.workspaceConfig.workspaceRoot
        ),
        appendPath(context.config.root, context.workspaceConfig.workspaceRoot)
      )
        ? joinPaths(
            context.config.output.copy.path,
            relativePath(
              appendPath(
                context.config.root,
                context.workspaceConfig.workspaceRoot
              ),
              appendPath(
                context.config.output.path,
                context.workspaceConfig.workspaceRoot
              )
            )
          )
        : joinPaths(context.config.output.copy.path, "dist");
      const sourcePath = appendPath(
        context.config.output.path,
        context.workspaceConfig.workspaceRoot
      );

      if (existsSync(sourcePath) && sourcePath !== destinationPath) {
        context.debug(
          `Copying files from project's build output directory (${
            context.config.output.path
          }) to the project's copy/publish directory (${destinationPath}).`
        );

        await copyFiles(sourcePath, destinationPath);
      } else {
        context.warn(
          `The source path for the copy operation ${
            !existsSync(sourcePath)
              ? "does not exist"
              : "is the same as the destination path"
          }. Source: ${sourcePath}, Destination: ${
            destinationPath
          }. Skipping copying of build output files.`
        );
      }

      if (
        context.config.output.copy.assets &&
        Array.isArray(context.config.output.copy.assets)
      ) {
        await Promise.all(
          context.config.output.copy.assets.map(async asset => {
            context.trace(
              `Copying asset(s): ${chalk.redBright(
                context.workspaceConfig.workspaceRoot === asset.input
                  ? asset.glob
                  : appendPath(
                      asset.glob,
                      replacePath(
                        asset.input,
                        context.workspaceConfig.workspaceRoot
                      )
                    )
              )} -> ${chalk.greenBright(
                appendPath(
                  asset.glob,
                  replacePath(
                    asset.output,
                    context.workspaceConfig.workspaceRoot
                  )
                )
              )} ${
                Array.isArray(asset.ignore) && asset.ignore.length > 0
                  ? ` (ignoring: ${asset.ignore
                      .map(i => chalk.yellowBright(i))
                      .join(", ")})`
                  : ""
              }`
            );

            await context.fs.copy(asset, asset.output);
          })
        );
      }
    } else {
      context.debug(
        "No copy configuration found for the project output. Skipping the copying of build output files."
      );
    }

    await this.callHook("build", {
      environment: context,
      order: "post"
    });

    
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
      this.context.debug(
        "No environments are configured for this Powerlines project. Using the default environment."
      );

      return [await this.context.getEnvironment()];
    }

    this.context.debug(
      `Found ${Object.keys(this.context.config.environments).length} configured environment(s) for this Powerlines project.`
    );

    return (
      await Promise.all(
        Object.entries(this.context.config.environments).map(
          async ([name, config]) => {
            const environment = await this.context.getEnvironmentSafe(name);
            if (!environment) {
              const resolvedEnvironment = await this.callHook(
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
      const result = await this.#initPlugin(config);
      if (!result) {
        return;
      }

      for (const plugin of result) {
        this.context.debug(
          `Successfully initialized the ${chalk.bold.cyanBright(
            plugin.name
          )} plugin`
        );

        await this.context.addPlugin(plugin);
      }
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
  ): Promise<Plugin<PluginContext<TResolvedConfig>>[] | null> {
    let awaited = config;
    if (isPromiseLike(config)) {
      awaited = (await Promise.resolve(config as Promise<any>)) as PluginConfig<
        PluginContext<TResolvedConfig>
      >;
    }

    if (!isPluginConfig<PluginContext<TResolvedConfig>>(awaited)) {
      const invalid = findInvalidPluginConfig(awaited);

      throw new Error(
        `Invalid ${
          invalid && invalid.length > 1 ? "plugins" : "plugin"
        } specified in the configuration - ${
          invalid && invalid.length > 0
            ? JSON.stringify(awaited)
            : invalid?.join("\n\n")
        } \n\nPlease ensure the value is one of the following: \n - an instance of \`Plugin\` \n - a plugin name \n - an object with the \`plugin\` and \`options\` properties \n - a tuple array with the plugin and options \n - a factory function that returns a plugin or array of plugins \n - an array of plugins or plugin configurations`
      );
    }

    let plugins!: Plugin<PluginContext<TResolvedConfig>>[];
    if (isPlugin<PluginContext<TResolvedConfig>>(awaited)) {
      plugins = [awaited];
    } else if (isFunction(awaited)) {
      plugins = toArray(await Promise.resolve(awaited()));
    } else if (isString(awaited)) {
      const resolved = await this.#resolvePlugin(awaited);
      if (isFunction(resolved)) {
        plugins = toArray(await Promise.resolve(resolved()));
      } else {
        plugins = toArray(resolved);
      }
    } else if (
      Array.isArray(awaited) &&
      (awaited as PluginContext<TResolvedConfig>[]).every(
        isPlugin<PluginContext<TResolvedConfig>>
      )
    ) {
      plugins = awaited as Plugin<PluginContext<TResolvedConfig>>[];
    } else if (
      Array.isArray(awaited) &&
      (awaited as PluginConfig<PluginContext<TResolvedConfig>>[]).every(
        isPluginConfig<PluginContext<TResolvedConfig>>
      )
    ) {
      plugins = [];
      for (const pluginConfig of awaited as PluginConfig<
        PluginContext<TResolvedConfig>
      >[]) {
        const initialized = await this.#initPlugin(pluginConfig);
        if (initialized) {
          plugins.push(...initialized);
        }
      }
    } else if (
      isPluginConfigTuple<PluginContext<TResolvedConfig>>(awaited) ||
      isPluginConfigObject<PluginContext<TResolvedConfig>>(awaited)
    ) {
      let pluginConfig!:
        | string
        | PluginFactory<PluginContext<TResolvedConfig>>
        | Plugin<PluginContext<TResolvedConfig>>;
      let pluginOptions: any;

      if (isPluginConfigTuple<PluginContext<TResolvedConfig>>(awaited)) {
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
          plugins = toArray(
            await Promise.resolve(
              pluginOptions ? resolved(pluginOptions) : resolved()
            )
          );
        } else {
          plugins = toArray(resolved);
        }
      } else if (isFunction(pluginConfig)) {
        plugins = toArray(await Promise.resolve(pluginConfig(pluginOptions)));
      } else if (
        Array.isArray(pluginConfig) &&
        pluginConfig.every(isPlugin<PluginContext<TResolvedConfig>>)
      ) {
        plugins = pluginConfig;
      } else if (isPlugin<PluginContext<TResolvedConfig>>(pluginConfig)) {
        plugins = toArray(pluginConfig);
      }
    }

    if (!plugins) {
      throw new Error(
        `The plugin configuration ${JSON.stringify(awaited)} is invalid. This configuration must point to a valid Powerlines plugin module.`
      );
    }

    if (
      plugins.length > 0 &&
      !plugins.every(isPlugin<PluginContext<TResolvedConfig>>)
    ) {
      throw new Error(
        `The plugin option ${JSON.stringify(plugins)} does not export a valid module. This configuration must point to a valid Powerlines plugin module.`
      );
    }

    const result = [] as Plugin<PluginContext<TResolvedConfig>>[];
    for (const plugin of plugins) {
      if (checkDedupe<TResolvedConfig>(plugin, this.context.plugins)) {
        this.context.trace(
          `Duplicate ${chalk.bold.cyanBright(
            plugin.name
          )} plugin dependency detected - Skipping initialization.`
        );
      } else {
        result.push(plugin);

        this.context.trace(
          `Initializing the ${chalk.bold.cyanBright(plugin.name)} plugin...`
        );
      }
    }

    return result;
  }

  async #resolvePlugin<TOptions>(
    pluginPath: string
  ): Promise<
    | Plugin<PluginContext<TResolvedConfig>>
    | Plugin<PluginContext<TResolvedConfig>>[]
    | ((
        options?: TOptions
      ) => MaybePromise<
        | Plugin<PluginContext<TResolvedConfig>>
        | Plugin<PluginContext<TResolvedConfig>>[]
      >)
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
        this.context.config.root
      ]
    });
    if (!isInstalled && this.context.config.autoInstall) {
      this.#context.warn(
        `The plugin package "${
          pluginPath
        }" is not installed. It will be installed automatically.`
      );

      const result = await install(pluginPath, {
        cwd: this.context.config.root
      });
      if (isNumber(result.exitCode) && result.exitCode > 0) {
        this.#context.error(result.stderr);

        throw new Error(
          `An error occurred while installing the build plugin package "${
            pluginPath
          }" `
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

  /**
   * Generate the Powerlines TypeScript declaration file
   *
   * @remarks
   * This method will generate the TypeScript declaration file for the Powerlines project, including any types provided by plugins.
   *
   * @param context - The environment context to use for generating the TypeScript declaration file
   * @returns A promise that resolves when the TypeScript declaration file has been generated
   */
  async #typegen(context: EnvironmentContext<TResolvedConfig>) {
    context.debug(
      `Preparing the TypeScript definitions for the Powerlines project.`
    );

    if (context.fs.existsSync(context.typegenPath)) {
      await context.fs.remove(context.typegenPath);
    }

    const typescriptPath = await resolvePackage("typescript");
    if (!typescriptPath) {
      throw new Error(
        "Could not resolve TypeScript package location. Please ensure TypeScript is installed."
      );
    }

    context.debug(
      "Running TypeScript compiler for built-in runtime module files."
    );

    let types = await emitBuiltinTypes(
      context,
      (await context.getBuiltins()).reduce<string[]>((ret, builtin) => {
        const formatted = replacePath(
          builtin.path,
          context.workspaceConfig.workspaceRoot
        );
        if (!ret.includes(formatted)) {
          ret.push(formatted);
        }

        return ret;
      }, [])
    );

    context.debug(
      `Generating TypeScript declaration file ${context.typegenPath}.`
    );

    const directives = [] as string[];
    const asNextParam = (
      previousResult: string | TypegenResult | null | undefined
    ) => (isObject(previousResult) ? previousResult.code : previousResult);

    let result = await this.callHook(
      "typegen",
      {
        environment: context,
        sequential: true,
        order: "pre",
        result: "merge",
        asNextParam
      },
      types
    );
    if (result) {
      if (isSetObject(result)) {
        types = result.code;
        if (Array.isArray(result.directives) && result.directives.length > 0) {
          directives.push(...result.directives);
        }
      } else if (isSetString(result)) {
        types = result;
      }
    }

    result = await this.callHook(
      "typegen",
      {
        environment: context,
        sequential: true,
        order: "normal",
        result: "merge",
        asNextParam
      },
      types
    );
    if (result) {
      if (isSetObject(result)) {
        types = result.code;
        if (Array.isArray(result.directives) && result.directives.length > 0) {
          directives.push(...result.directives);
        }
      } else if (isSetString(result)) {
        types = result;
      }
    }

    result = await this.callHook(
      "typegen",
      {
        environment: context,
        sequential: true,
        order: "post",
        result: "merge",
        asNextParam
      },
      types
    );
    if (result) {
      if (isSetObject(result)) {
        types = result.code;
        if (Array.isArray(result.directives) && result.directives.length > 0) {
          directives.push(...result.directives);
        }
      } else if (isSetString(result)) {
        types = result;
      }
    }

    if (isSetString(types?.trim()) || directives.length > 0) {
      await context.fs.write(
        context.typegenPath,
        `${
          directives.length > 0
            ? `${directives.map(directive => `/// <reference types="${directive}" />`).join("\n")}

`
            : ""
        }${getTypescriptFileHeader(context, { directive: null, prettierIgnore: false })}

${formatTypes(types)}
`
      );
    } else {
      const dtsRelativePath = getTsconfigDtsPath(context);
      if (
        context.tsconfig.tsconfigJson.include &&
        isIncludeMatchFound(
          dtsRelativePath,
          context.tsconfig.tsconfigJson.include
        )
      ) {
        const normalizedDtsRelativePath = dtsRelativePath.startsWith("./")
          ? dtsRelativePath.slice(2)
          : dtsRelativePath;
        context.tsconfig.tsconfigJson.include =
          context.tsconfig.tsconfigJson.include.filter(
            includeValue =>
              includeValue?.toString() !== normalizedDtsRelativePath
          );

        await context.fs.write(
          context.tsconfig.tsconfigFilePath,
          JSON.stringify(context.tsconfig.tsconfigJson, null, 2)
        );
      }
    }

    // Re-resolve the tsconfig to ensure it is up to date
    context.tsconfig = getParsedTypeScriptConfig(
      context.workspaceConfig.workspaceRoot,
      context.config.root,
      context.config.tsconfig
    );
    if (!context.tsconfig) {
      throw new Error("Failed to parse the TypeScript configuration file.");
    }
  }
}
