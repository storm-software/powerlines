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
import { getWorkspaceRoot } from "@stryke/fs/get-workspace-root";
import { tsconfigPathsToRegExp } from "bundle-require";
import type {
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext,
  UnpluginOptions
} from "unplugin";
import { PowerlinesAPI } from "../../internal/api";
import { UnpluginBuildVariant } from "../../types/build";
import { Context } from "../../types/context";
import { InferResolvedConfig } from "../../types/resolved";
import {
  InferUnpluginOptions,
  StormStackUnpluginFactory
} from "../../types/unplugin";
import { createLog } from "../logger";
import { getString } from "../utilities/source-file";
import { handleResolveId } from "./resolve-id";

/**
 * Creates a Powerlines unplugin factory that generates a plugin instance.
 *
 * @param variant - The build variant for which to create the unplugin.
 * @param decorate - An optional function to decorate the unplugin options.
 * @returns The unplugin factory that generates a plugin instance.
 */
export function createUnpluginFactory<
  TBuildVariant extends UnpluginBuildVariant,
  TContext extends Context<InferResolvedConfig<TBuildVariant>> = Context<
    InferResolvedConfig<TBuildVariant>
  >
>(
  variant: TBuildVariant,
  decorate?: (
    api: PowerlinesAPI<TContext["config"]>,
    plugin: Omit<UnpluginOptions, UnpluginBuildVariant>
  ) => InferUnpluginOptions<TBuildVariant>
): StormStackUnpluginFactory<TBuildVariant> {
  return (config, meta) => {
    const log = createLog("unplugin", config);
    log(LogLevelLabel.DEBUG, "Initializing Unplugin");

    try {
      const userConfig = {
        ...config,
        variant,
        unplugin: meta
      } as TContext["config"]["userConfig"];

      let api!: PowerlinesAPI<TContext["config"]>;
      let resolvePatterns: RegExp[] = [];

      async function buildStart(this: UnpluginBuildContext): Promise<void> {
        log(LogLevelLabel.DEBUG, "Powerlines build plugin starting...");

        const workspaceRoot = getWorkspaceRoot(process.cwd());
        api = await PowerlinesAPI.from(workspaceRoot, userConfig);

        if (api.context.config.build.skipNodeModulesBundle) {
          resolvePatterns = tsconfigPathsToRegExp(
            api.context.tsconfig.options.paths ?? []
          );
        }

        log(
          LogLevelLabel.DEBUG,
          "Preparing build artifacts for the Powerlines project..."
        );

        await api.prepare({
          command: "build"
        });
      }

      async function resolveId(
        this: UnpluginBuildContext & UnpluginContext,
        id: string,
        importer?: string,
        options: {
          isEntry: boolean;
        } = { isEntry: false }
      ) {
        return handleResolveId(
          api.context,
          {
            id,
            importer,
            options
          },
          {
            skipNodeModulesBundle:
              api.context.config.build.skipNodeModulesBundle,
            external: api.context.config.build.external,
            noExternal: api.context.config.build.noExternal,
            resolvePatterns
          }
        );
      }

      async function load(
        this: UnpluginBuildContext & UnpluginContext,
        id: string
      ): Promise<TransformResult> {
        const environment = await api.context.getEnvironment();

        if (id) {
          const resolvedPath = environment.fs.resolvePath(id, {
            type: "file"
          });
          if (resolvedPath) {
            return environment.fs.readFile(resolvedPath);
          }
        }

        let result = await api.callPreHook(environment, "load", id);
        if (result) {
          return result;
        }

        result = await api.callNormalHook(environment, "load", id);
        if (result) {
          return result;
        }

        return api.callPostHook(environment, "load", id);
      }

      async function transform(
        code: string,
        id: string
      ): Promise<TransformResult> {
        const environment = await api.context.getEnvironment();

        let transformed: TransformResult | string = code;

        let result = await api.callPreHook(
          environment,
          "transform",
          getString(transformed),
          id
        );
        if (result) {
          transformed = result;
        }

        result = await api.callNormalHook(
          environment,
          "transform",
          getString(transformed),
          id
        );
        if (result) {
          transformed = result;
        }

        result = await api.callPostHook(
          environment,
          "transform",
          getString(transformed),
          id
        );
        if (result) {
          transformed = result;
        }

        return transformed;
      }

      async function writeBundle(): Promise<void> {
        log(LogLevelLabel.DEBUG, "Finalizing Powerlines project output...");

        const environment = await api.context.getEnvironment();
        await api.callHook(environment, "writeBundle");
      }

      const result = {
        name: "powerlines",
        resolveId: {
          filter: {
            id: {
              include: [/.*/]
            }
          },
          handler: resolveId
        },
        load: {
          filter: {
            id: {
              include: [/.*/, /^storm:/]
            }
          },
          handler: load
        },
        transform,
        buildStart,
        writeBundle
      };

      return decorate ? decorate(api, result) : result;
    } catch (error) {
      log(LogLevelLabel.FATAL, (error as Error)?.message);

      throw error;
    }
  };
}
