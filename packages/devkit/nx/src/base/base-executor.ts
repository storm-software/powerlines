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

import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { writeError } from "@storm-software/config-tools/logger";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import { withRunExecutor } from "@storm-software/workspace-tools/base/base-executor";
import { BaseExecutorResult } from "@storm-software/workspace-tools/types";
import { omit } from "@stryke/helpers/omit";
import { joinPaths } from "@stryke/path/join";
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
  InlineConfig,
  Mode,
  OutputConfig
} from "powerlines";
import { BaseExecutorSchema } from "./base-executor.schema";

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

/**
 * A utility function to create a Powerlines executor that can be used with the `withRunExecutor` function.
 *
 * @remarks
 * This function is designed to simplify the creation of Powerlines executors by providing a consistent interface and error handling.
 *
 * @param command - The command that the executor will handle (e.g., "new", "prepare", "build", etc.).
 * @param executorFn - The function that will be executed when the command is run.
 * @param defaultOptions - Default options to be merged with the execution options.
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
  defaultOptions: DeepPartial<ExecutionOptions> = {}
): PromiseExecutor<TExecutorSchema> {
  return withRunExecutor(
    `Powerlines - ${titleCase(command)} executor`,
    async (
      options: TExecutorSchema,
      context: ExecutorContext,
      workspaceConfig: StormWorkspaceConfig
    ): Promise<BaseExecutorResult | null | undefined> => {
      if (!context.projectName) {
        throw new Error(
          `The Powerlines - ${titleCase(command)} executor requires \`projectName\` on the context object.`
        );
      }

      if (
        !context.projectName ||
        !context.projectsConfigurations?.projects ||
        !context.projectsConfigurations.projects[context.projectName] ||
        !context.projectsConfigurations.projects[context.projectName]?.root
      ) {
        throw new Error(
          `The Powerlines - ${titleCase(command)} executor requires \`projectsConfigurations\` on the context object.`
        );
      }

      const projectConfig =
        context.projectsConfigurations.projects[context.projectName]!;

      const jiti = createJiti(context.root, {
        cache: false,
        interopDefault: true,
        tsconfigPaths: true
      });
      const api = await jiti
        .import<{
          default: (params: ExecutionApiParams) => Promise<void>;
        }>(jiti.esmResolve("powerlines/api"))
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
                    name: context.projectName,
                    command,
                    root: projectConfig.root,
                    configFile: options.configFile || options.config,
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
            async (inlineConfig: InlineConfig) =>
              api({
                options: defu(defaultOptions, {
                  executionId: `${context.projectName}-${command}-${Date.now()}`,
                  cwd: context.root,
                  root: projectConfig.root,
                  configFile:
                    options.configFile ||
                    options.config ||
                    joinPaths(projectConfig.root, "powerlines.config.ts"),
                  configIndex: 0,
                  framework: {
                    name: "powerlines",
                    orgId: "storm-software"
                  }
                }),
                command,
                inlineConfig
              })
          )
        );
      } catch (error) {
        writeError(
          `An error occurred while executing the Powerlines - ${titleCase(
            command
          )} executor: ${
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
