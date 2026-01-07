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

import { transformAsync } from "@babel/core";
import { formatLogMessage } from "@storm-software/config-tools/logger/console";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { createDirectory } from "@stryke/fs/helpers";
import { install } from "@stryke/fs/install";
import { listFiles } from "@stryke/fs/list-files";
import { isPackageExists } from "@stryke/fs/package-fns";
import { resolvePackage } from "@stryke/fs/resolve";
import { appendPath } from "@stryke/path/append";
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
import { MaybePromise } from "@stryke/types/base";
import chalk from "chalk";
import Handlebars from "handlebars";
import { moduleResolverBabelPlugin } from "./internal/babel/module-resolver-plugin";
import { emitTypes, formatTypes } from "./internal/helpers/generate-types";
import { callHook, CallHookOptions } from "./internal/helpers/hooks";
import { installDependencies } from "./internal/helpers/install-dependencies";
import {
  getTsconfigDtsPath,
  initializeTsconfig,
  resolveTsconfig
} from "./internal/helpers/resolve-tsconfig";
import { PowerlinesAPIContext } from "./lib/contexts/api-context";
import {
  getParsedTypeScriptConfig,
  isIncludeMatchFound
} from "./lib/typescript/tsconfig";
import { getFileHeader } from "./lib/utilities/file-header";
import { writeMetaFile } from "./lib/utilities/meta";
import {
  checkDedupe,
  findInvalidPluginConfig,
  isPlugin,
  isPluginConfig,
  isPluginConfigObject,
  isPluginConfigTuple
} from "./plugin-utils/helpers";
import { API } from "./types/api";
import type {
  BuildInlineConfig,
  CleanInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  InitialUserConfig,
  LintInlineConfig,
  NewInlineConfig,
  PluginConfig,
  PluginConfigObject,
  PluginConfigTuple,
  PluginFactory,
  PrepareInlineConfig
} from "./types/config";
import type {
  APIContext,
  EnvironmentContext,
  PluginContext
} from "./types/context";
import { InferHookParameters } from "./types/hooks";
import { UNSAFE_APIContext } from "./types/internal";
import type { Plugin, TypesResult } from "./types/plugin";
import { EnvironmentResolvedConfig, ResolvedConfig } from "./types/resolved";

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
    api.#context.$$internal = { api, addPlugin: api.#addPlugin.bind(api) };

    for (const plugin of api.context.config.plugins ?? []) {
      await api.#addPlugin(plugin);
    }

    if (api.context.plugins.length === 0) {
      api.context.log(
        LogLevelLabel.WARN,
        "No Powerlines plugins were specified in the options. Please ensure this is correct, as it is generally not recommended."
      );
    }

    const pluginConfig = await api.callHook("config", {
      environment: await api.context.getEnvironment(),
      sequential: true,
      result: "merge"
    });
    await api.context.withUserConfig(
      pluginConfig as TResolvedConfig["userConfig"],
      { isHighPriority: false }
    );

    return api;
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
      | PrepareInlineConfig
      | NewInlineConfig
      | CleanInlineConfig
      | BuildInlineConfig
      | LintInlineConfig
      | DocsInlineConfig
      | DeployInlineConfig = { command: "prepare" }
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

      await this.callHook("configResolved", {
        environment: context,
        order: "pre"
      });

      await initializeTsconfig<TResolvedConfig>(context);

      await this.callHook("configResolved", {
        environment: context,
        order: "normal"
      });

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
                    `- ${entry.file}${
                      entry.output ? ` -> ${entry.output}` : ""
                    }`
                )
                .join(" \n")}`
            : ""
        }.`
      );

      await resolveTsconfig<TResolvedConfig>(context);
      await installDependencies(context);

      await this.callHook("configResolved", {
        environment: context,
        order: "post"
      });

      context.log(
        LogLevelLabel.TRACE,
        `Powerlines configuration has been resolved: \n\n${formatLogMessage(
          context.config
        )}`
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

      if (context.config.output.dts !== false) {
        context.log(
          LogLevelLabel.TRACE,
          `Preparing the TypeScript definitions for the Powerlines project.`
        );

        if (context.fs.existsSync(context.dtsPath)) {
          await context.fs.remove(context.dtsPath);
        }

        context.log(
          LogLevelLabel.TRACE,
          "Transforming built-ins runtime modules files."
        );

        const builtinFilePaths = await Promise.all(
          (await context.getBuiltins()).map(async file => {
            const result = await transformAsync(file.code.toString(), {
              highlightCode: true,
              code: true,
              ast: false,
              cloneInputAst: false,
              comments: true,
              sourceType: "module",
              configFile: false,
              babelrc: false,
              envName: context.config.mode,
              caller: {
                name: "powerlines"
              },
              ...context.config.transform.babel,
              filename: file.path,
              plugins: [
                ["@babel/plugin-syntax-typescript"],
                [moduleResolverBabelPlugin(context)]
              ]
            });
            if (!result?.code) {
              throw new Error(
                `Powerlines - Generate Types failed to compile ${file.id}`
              );
            }

            if (!file.id) {
              context.warn(
                `File ID is missing for a built-in runtime file at ${file.path}.`
              );

              file.id = replacePath(
                replacePath(file.path, context.workspaceConfig.workspaceRoot),
                context.builtinsPath
              );
            }

            context.log(
              LogLevelLabel.TRACE,
              `Writing transformed built-in runtime file ${file.id}.`
            );

            await context.emitBuiltin(result.code, file.id);

            return file.path;
          })
        );

        const typescriptPath = await resolvePackage("typescript");
        if (!typescriptPath) {
          throw new Error(
            "Could not resolve TypeScript package location. Please ensure TypeScript is installed."
          );
        }

        const files = builtinFilePaths.reduce<string[]>(
          (ret, fileName) => {
            const formatted = replacePath(
              fileName,
              context.workspaceConfig.workspaceRoot
            );
            if (!ret.includes(formatted)) {
              ret.push(formatted);
            }

            return ret;
          },
          [] // [joinPaths(typescriptPath, "lib", "lib.esnext.full.d.ts")]
        );

        context.log(
          LogLevelLabel.TRACE,
          "Parsing TypeScript configuration for the Powerlines project."
        );

        let types = await emitTypes(context, files);

        context.log(
          LogLevelLabel.TRACE,
          `Generating TypeScript declaration file ${context.dtsPath}.`
        );

        const directives = [] as string[];
        const asNextParam = (
          previousResult: string | TypesResult | null | undefined
        ) => (isObject(previousResult) ? previousResult.code : previousResult);

        let result = await this.callHook(
          "types",
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
            if (
              Array.isArray(result.directives) &&
              result.directives.length > 0
            ) {
              directives.push(...result.directives);
            }
          } else if (isSetString(result)) {
            types = result;
          }
        }

        result = await this.callHook(
          "types",
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
            if (
              Array.isArray(result.directives) &&
              result.directives.length > 0
            ) {
              directives.push(...result.directives);
            }
          } else if (isSetString(result)) {
            types = result;
          }
        }

        result = await this.callHook(
          "types",
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
            if (
              Array.isArray(result.directives) &&
              result.directives.length > 0
            ) {
              directives.push(...result.directives);
            }
          } else if (isSetString(result)) {
            types = result;
          }
        }

        if (types?.trim() || directives.length > 0) {
          await context.fs.write(
            context.dtsPath,
            `${
              directives
                ? `${directives.map(directive => `/// <reference types="${directive}" />`).join("\n")}

`
                : ""
            }${getFileHeader(context, { directive: null, prettierIgnore: false })}

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
      }

      // Re-resolve the tsconfig to ensure it is up to date
      context.tsconfig = getParsedTypeScriptConfig(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        context.config.tsconfig
      );
      if (!context.tsconfig) {
        throw new Error("Failed to parse the TypeScript configuration file.");
      }

      await this.callHook("prepare", {
        environment: context,
        order: "post"
      });

      await writeMetaFile(context);
      context.persistedMeta = context.meta;
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

      await this.callHook("new", {
        environment: context,
        order: "pre"
      });

      const files = await listFiles(
        joinPaths(context.powerlinesPath, "files/common/**/*.hbs")
      );
      for (const file of files) {
        context.log(LogLevelLabel.TRACE, `Adding template file: ${file}`);

        const template = Handlebars.compile(file);
        await context.fs.write(
          joinPaths(context.config.projectRoot, file.replace(".hbs", "")),
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
          context.log(
            LogLevelLabel.TRACE,
            `Adding application template file: ${file}`
          );

          const template = Handlebars.compile(file);
          await context.fs.write(
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
          await context.fs.write(
            joinPaths(context.config.projectRoot, file.replace(".hbs", "")),
            template(context)
          );
        }
      }

      await this.callHook("new", {
        environment: context,
        order: "post"
      });
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
      this.context.log(
        LogLevelLabel.TRACE,
        "Cleaning the project's dist and artifacts directories."
      );

      await context.fs.remove(
        joinPaths(
          context.workspaceConfig.workspaceRoot,
          context.config.output.buildPath
        )
      );
      await context.fs.remove(
        joinPaths(
          context.workspaceConfig.workspaceRoot,
          context.config.output.artifactsPath
        )
      );

      await this.callHook("clean", {
        environment: context,
        sequential: false
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
    this.context.log(LogLevelLabel.INFO, "📋 Linting the Powerlines project");

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      if (context.config.lint !== false) {
        await this.callHook("lint", {
          environment: context,
          sequential: false
        });
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
    this.context.log(LogLevelLabel.INFO, "📦  Building the Powerlines project");

    // const checksum = await this.context.generateChecksum();
    // if (checksum !== this.context.persistedMeta?.checksum) {
    //   this.context.log(
    //     LogLevelLabel.INFO,
    //     "The Powerlines project has been modified since the last time `prepare` was ran. Re-preparing the project."
    //   );

    //   await this.prepare(inlineConfig);
    // }

    await this.prepare(inlineConfig);
    if (this.context.config.singleBuild) {
      await this.#handleBuild(await this.#context.toEnvironment());
    } else {
      await this.#executeEnvironments(async context => {
        await this.#handleBuild(context);
      });
    }

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
        await this.callHook("docs", {
          environment: context
        });
      });
    });

    this.#context.log(
      LogLevelLabel.TRACE,
      "Powerlines documentation generation completed"
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
    inlineConfig: DeployInlineConfig = { command: "deploy" }
  ) {
    this.context.log(LogLevelLabel.INFO, "📦 Deploying the Powerlines project");

    await this.prepare(inlineConfig);
    await this.#executeEnvironments(async context => {
      await this.callHook("deploy", { environment: context });
    });

    this.context.log(LogLevelLabel.TRACE, "Powerlines deploy completed");
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
      await this.callHook("finalize", { environment: context });
      await context.fs.dispose();
    });

    this.context.log(
      LogLevelLabel.TRACE,
      "Powerlines finalize execution completed"
    );
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
    await this.callHook("build", {
      environment: context,
      order: "normal"
    });

    if (context.config.output.buildPath !== context.config.output.outputPath) {
      const sourcePath = appendPath(
        context.config.output.buildPath,
        context.workspaceConfig.workspaceRoot
      );
      const destinationPath = joinPaths(
        appendPath(
          context.config.output.outputPath,
          context.workspaceConfig.workspaceRoot
        ),
        "dist"
      );

      if (context.fs.existsSync(sourcePath) && sourcePath !== destinationPath) {
        context.log(
          LogLevelLabel.INFO,
          `Copying build output files from project's build directory (${
            context.config.output.buildPath
          }) to the workspace's output directory (${context.config.output.outputPath}).`
        );

        await context.fs.copy(sourcePath, destinationPath);
      }
    }

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
              replacePath(asset.output, context.workspaceConfig.workspaceRoot),
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

        await context.fs.copy(asset, asset.output);
      })
    );

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
        this.context.log(
          LogLevelLabel.DEBUG,
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
        this.context.log(
          LogLevelLabel.TRACE,
          `Duplicate ${chalk.bold.cyanBright(
            plugin.name
          )} plugin dependency detected - Skipping initialization.`
        );
      } else {
        result.push(plugin);

        this.context.log(
          LogLevelLabel.TRACE,
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
