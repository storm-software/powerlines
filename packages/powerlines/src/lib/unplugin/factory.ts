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
import { API } from "powerlines/types/api";
import { LoadResult } from "rolldown";
import type {
  UnpluginOptions as BaseUnpluginOptions,
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { setParseImpl } from "unplugin";
import { PowerlinesAPI } from "../../api";
import { UnpluginBuilderVariant } from "../../types/build";
import { Context } from "../../types/context";
import { UnpluginFactory, UnpluginOptions } from "../../types/unplugin";
import { createLog } from "../logger";
import { getString } from "../utilities/source-file";

/**
 * Creates a Powerlines unplugin factory that generates a plugin instance.
 *
 * @param variant - The build variant for which to create the unplugin.
 * @param decorate - An optional function to decorate the unplugin options.
 * @returns The unplugin factory that generates a plugin instance.
 */
export function createUnpluginFactory<
  TContext extends Context,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant
>(
  variant: TUnpluginBuilderVariant,
  decorate?: (
    api: API<TContext["config"]>,
    plugin: UnpluginOptions
  ) => BaseUnpluginOptions
): UnpluginFactory<TUnpluginBuilderVariant> {
  return (config, meta): UnpluginOptions => {
    const log = createLog("unplugin", config);
    log(LogLevelLabel.DEBUG, "Initializing Unplugin");

    try {
      const userConfig = {
        ...config,
        variant,
        unplugin: meta
      } as TContext["config"]["userConfig"];

      let api!: API<TContext["config"]>;

      async function buildStart(this: UnpluginBuildContext): Promise<void> {
        log(LogLevelLabel.DEBUG, "Powerlines build plugin starting...");

        api = await PowerlinesAPI.from(
          getWorkspaceRoot(process.cwd()),
          userConfig
        );
        setParseImpl(api.context.parse);

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
        return api.context.resolve(id, importer, options);
      }

      async function load(
        this: UnpluginBuildContext & UnpluginContext,
        id: string
      ): Promise<LoadResult> {
        const environment = await api.context.getEnvironment();

        let result = await api.callHook(
          "load",
          { environment, order: "pre" },
          id
        );
        if (result) {
          return result;
        }

        result = await api.callHook(
          "load",
          { environment, order: "normal" },
          id
        );
        if (result) {
          return result;
        }

        result = await environment.load(id);
        if (result) {
          return result;
        }

        return api.callHook("load", { environment, order: "post" }, id);
      }

      async function transform(
        code: string,
        id: string
      ): Promise<TransformResult> {
        return api.callHook(
          "transform",
          {
            environment: await api.context.getEnvironment(),
            result: "merge",
            asNextParam: previousResult => getString(previousResult)
          },
          getString(code),
          id
        );
      }

      async function writeBundle(): Promise<void> {
        log(LogLevelLabel.DEBUG, "Finalizing Powerlines project output...");

        await api.callHook("writeBundle", {
          environment: await api.context.getEnvironment()
        });
      }

      const options = {
        name: "powerlines",
        api,
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
      } as UnpluginOptions;

      const result = decorate ? decorate(api, options) : options;

      log(LogLevelLabel.DEBUG, "Unplugin initialized successfully.");

      return { api, ...result };
    } catch (error) {
      log(LogLevelLabel.FATAL, (error as Error)?.message);

      throw error;
    }
  };
}
