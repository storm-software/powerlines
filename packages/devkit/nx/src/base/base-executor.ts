/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { writeError } from "@storm-software/config-tools/logger";
import type { StormWorkspaceConfig } from "@storm-software/config/types";
import { withRunExecutor } from "@storm-software/workspace-tools/base/base-executor";
import type { BaseExecutorResult } from "@storm-software/workspace-tools/types";
import { omit } from "@stryke/helpers/omit";
import { joinPaths } from "@stryke/path/join";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isError } from "@stryke/type-checks/is-error";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetArray } from "@stryke/type-checks/is-set-array";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type { DeepPartial } from "@stryke/types/base";
import defu from "defu";
import { createJiti } from "jiti";
import type {
  ExecutionApiParams,
  ExecutionOptions,
  FrameworkOptions,
  InlineConfig,
  Mode,
  OutputConfig
} from "powerlines";
import { formatExecutionId, getName } from "powerlines/plugin-utils";
import type { BaseExecutorSchema } from "./base-executor.schema";

export type PowerlinesExecutorContext<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
> = ExecutorContext & {
  projectName: string;
  command: string;
  options: TExecutorSchema;
  inlineConfig: InlineConfig;
  workspaceConfig: StormWorkspaceConfig;
};

export type PowerlinesExecutorApi = (
  inlineConfig: InlineConfig
) => Promise<void>;

export interface WithExecutorOptions {
  /**
   * The import path for the executor API module, which is used to dynamically import the API function that will be called during execution. This value should be a string representing the module path, and it defaults to "powerlines/api" if not provided. The specified module should export a default function that matches the expected signature for the executor API, which will be invoked with the execution parameters when the executor is run.
   *
   * @defaultValue "powerlines/api"
   */
  importPath?: string;

  /**
   * Default options to be merged with the execution options, which can be used to provide default values for certain execution parameters or to override specific options for all executions of the executor. This value should be an object that matches the shape of the `ExecutionOptions` type, and it will be merged with the options provided during execution to create the final set of options that will be passed to the executor API function.
   *
   * @remarks
   * This can be useful for setting default values for options that are commonly used across multiple executions, or for providing a consistent set of options for all executions of the executor without requiring the caller to specify them each time.
   */
  defaultOptions?: DeepPartial<ExecutionOptions>;

  /**
   * Details about the framework being used in the current execution, which can be used by plugins and other parts of the system to customize behavior based on the framework.
   *
   * @remarks
   * This should only be used by framework plugins to ensure the correct framework name is applied
   *
   * @defaultValue
   * ```ts
   * {
   *   name: "powerlines",
   *   orgId: "storm-software"
   * }
   * ```
   */
  framework?: FrameworkOptions;
}

/**
 * A utility function to create a Powerlines executor that can be used with the `withRunExecutor` function.
 *
 * @remarks
 * This function is designed to simplify the creation of Powerlines executors by providing a consistent interface and error handling.
 *
 * @param command - The command that the executor will handle (e.g., "new", "prepare", "build", etc.).
 * @param executorFn - The function that will be executed when the command is run.
 * @param options - Additional options for configuring the executor, such as the import path for the API module and default execution options.
 * @returns A Promise that resolves to the result of the executor function.
 */
export function withExecutor<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
>(
  command: string,
  executorFn: (
    context: PowerlinesExecutorContext<TExecutorSchema>,
    api: PowerlinesExecutorApi
  ) =>
    | Promise<BaseExecutorResult | null | undefined>
    | BaseExecutorResult
    | null
    | undefined,
  options: WithExecutorOptions = {}
): PromiseExecutor<TExecutorSchema> {
  const {
    importPath = "powerlines/api",
    defaultOptions = {},
    framework = {} as FrameworkOptions
  } = options;

  framework.name ??= "powerlines";
  framework.orgId ??= "storm-software";

  return withRunExecutor(
    `${titleCase(framework.name)} - ${titleCase(command)} executor`,
    async (
      options: TExecutorSchema,
      context: ExecutorContext,
      workspaceConfig: StormWorkspaceConfig
    ): Promise<BaseExecutorResult | null | undefined> => {
      if (!context.projectName) {
        throw new Error(
          `The ${titleCase(framework.name)} - ${titleCase(
            command
          )} executor requires \`projectName\` on the context object.`
        );
      }

      if (
        !context.projectName ||
        !context.projectsConfigurations?.projects ||
        !context.projectsConfigurations.projects[context.projectName] ||
        !context.projectsConfigurations.projects[context.projectName]?.root
      ) {
        throw new Error(
          `The ${titleCase(framework.name)} - ${titleCase(
            command
          )} executor requires \`projectsConfigurations\` on the context object.`
        );
      }

      const projectConfig =
        context.projectsConfigurations.projects[context.projectName]!;

      const jiti = createJiti(context.root, {
        cache: false,
        tsconfigPaths: true
      });
      const api = await jiti
        .import<{
          default: (params: ExecutionApiParams) => Promise<void>;
        }>(jiti.esmResolve(importPath))
        .then(mod => mod.default);

      try {
        return await Promise.resolve(
          executorFn(
            defu(
              {
                projectName: context.projectName,
                options,
                workspaceConfig,
                command,
                inlineConfig: defu(
                  {
                    command,
                    root: projectConfig.root,
                    configFile: options.configFile || options.config,
                    configIndex: options.configIndex,
                    projectType: projectConfig.projectType,
                    mode: options.mode as Mode,
                    output: {
                      path: options.outputPath,
                      copy:
                        options.copyPath === false
                          ? false
                          : {
                              path: options.copyPath,
                              assets: options.assets
                            },
                      minify: options.minify,
                      sourceMap: options.sourceMap
                    } as OutputConfig,
                    resolve:
                      isSetArray(options.external) ||
                      isSetArray(options.noExternal) ||
                      isSet(options.skipNodeModulesBundle)
                        ? {
                            external: isSetArray(options.external)
                              ? options.external
                              : undefined,
                            noExternal: isSetArray(options.noExternal)
                              ? options.noExternal
                              : undefined,
                            skipNodeModulesBundle: isSet(
                              options.skipNodeModulesBundle
                            )
                              ? options.skipNodeModulesBundle
                              : undefined
                          }
                        : undefined,
                    define: isSetObject(options.define)
                      ? options.define
                      : undefined,
                    assets: isSetObject(options.assets)
                      ? options.assets
                      : undefined
                  },
                  omit(options, [
                    "config",
                    "configFile",
                    "outputPath",
                    "copyPath",
                    "sourceMap",
                    "minify",
                    "format",
                    "external",
                    "noExternal",
                    "skipNodeModulesBundle",
                    "mode",
                    "define",
                    "assets"
                  ])
                ) as InlineConfig
              },
              context
            ),
            async (inlineConfig: InlineConfig) => {
              const name =
                inlineConfig.name ||
                context.projectName ||
                (await getName(context.root, projectConfig.root));

              return api({
                options: defu(defaultOptions, {
                  name,
                  executionId: formatExecutionId(
                    name,
                    command,
                    options.configIndex ?? 0
                  ),
                  cwd: context.root,
                  root: projectConfig.root,
                  configFile:
                    options.configFile ||
                    options.config ||
                    joinPaths(
                      projectConfig.root,
                      `${kebabCase(framework.name)}.config.ts`
                    ),
                  configIndex: options.configIndex,
                  framework
                }) as ExecutionOptions,
                command,
                inlineConfig
              });
            }
          )
        );
      } catch (error) {
        writeError(
          `An error occurred while executing the ${titleCase(
            framework.name
          )} - ${titleCase(command)} executor: ${
            isError(error)
              ? `${error.message}

${error.stack}`
              : "Unknown error"
          }`
        );

        return { success: false };
      }
    },
    {
      skipReadingConfig: false,
      hooks: {
        applyDefaultOptions: (options: Partial<TExecutorSchema>) => {
          options.copyPath ??= "dist/{projectRoot}";

          return options as TExecutorSchema;
        }
      }
    }
  );
}
