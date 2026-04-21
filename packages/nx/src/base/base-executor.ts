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
import { isError } from "@stryke/type-checks/is-error";
import defu from "defu";
import { createJiti } from "jiti";
import type {
  InlineConfig,
  PowerlinesCommand,
  PowerlinesEngine
} from "powerlines";
import { BaseExecutorSchema } from "./base-executor.schema";

export type PowerlinesExecutorContext<
  TCommand extends PowerlinesCommand = PowerlinesCommand,
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
> = ExecutorContext & {
  projectName: string;
  command: TCommand;
  options: TExecutorSchema;
  inlineConfig: InlineConfig;
  workspaceConfig: StormWorkspaceConfig;
};

/**
 * A utility function to create a Powerlines executor that can be used with the `withRunExecutor` function.
 *
 * @remarks
 * This function is designed to simplify the creation of Powerlines executors by providing a consistent interface and error handling.
 *
 * @param command - The command that the executor will handle (e.g., "new", "prepare", "build", etc.).
 * @param executorFn - The function that will be executed when the command is run.
 * @returns A Promise that resolves to the result of the executor function.
 */
export function withExecutor<
  TCommand extends PowerlinesCommand = PowerlinesCommand,
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
>(
  command: TCommand,
  executorFn: (
    context: PowerlinesExecutorContext<TCommand, TExecutorSchema>,
    api: PowerlinesEngine
  ) =>
    | Promise<BaseExecutorResult | null | undefined>
    | BaseExecutorResult
    | null
    | undefined
): PromiseExecutor<TExecutorSchema> {
  return withRunExecutor(
    `Powerlines ${command} command executor`,
    async (
      options: TExecutorSchema,
      context: ExecutorContext,
      workspaceConfig: StormWorkspaceConfig
    ): Promise<BaseExecutorResult | null | undefined> => {
      if (!context.projectName) {
        throw new Error(
          "The executor requires `projectName` on the context object."
        );
      }

      if (
        !context.projectName ||
        !context.projectsConfigurations?.projects ||
        !context.projectsConfigurations.projects[context.projectName] ||
        !context.projectsConfigurations.projects[context.projectName]?.root
      ) {
        throw new Error(
          "The executor requires `projectsConfigurations` on the context object."
        );
      }

      const projectConfig =
        context.projectsConfigurations.projects[context.projectName]!;

      const jiti = createJiti(context.root, { cache: false });
      const { createEngine } = await jiti.import<{
        createEngine: typeof import("powerlines").createEngine;
      }>(jiti.esmResolve("powerlines"));

      const api = await createEngine(
        defu(
          {
            cwd: workspaceConfig.workspaceRoot,
            root: projectConfig.root,
            configFile: options.configFile ?? options.config
          },
          options,
          {
            name: context.projectName
          }
        )
      );

      try {
        return await Promise.resolve(
          executorFn(
            defu(
              {
                projectName: context.projectName,
                options,
                workspaceConfig,
                inlineConfig: {
                  command,
                  projectType: projectConfig.projectType,
                  output: {
                    path: options.outputPath,
                    copy: { path: options.copyPath, assets: options.assets },
                    format: options.format,
                    sourceMap: options.sourceMap
                  },
                  resolve: {
                    external: options.external,
                    noExternal: options.noExternal,
                    skipNodeModulesBundle: options.skipNodeModulesBundle
                  }
                } as InlineConfig,
                command
              },
              context
            ),
            api
          )
        );
      } catch (error) {
        writeError(
          `An error occurred while executing the Powerlines ${
            command
          } command executor: ${
            isError(error)
              ? `${error.message}

${error.stack}`
              : "Unknown error"
          }`
        );

        return { success: false };
      } finally {
        await api.finalize();
      }
    },
    {
      skipReadingConfig: false,
      hooks: {
        applyDefaultOptions: (options: Partial<TExecutorSchema>) => {
          return options as TExecutorSchema;
        }
      }
    }
  );
}
