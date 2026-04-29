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
  Context,
  UnpluginBuilderVariant,
  UnpluginFactory,
  UnpluginOptions
} from "@powerlines/core";
import { getString } from "@powerlines/core/lib/utilities/source-file";
import { createLogger } from "@powerlines/core/plugin-utils/logging";
import { getWorkspaceRoot } from "@stryke/fs/get-workspace-root";
import { LoadResult } from "rolldown";
import type {
  UnpluginOptions as BaseUnpluginOptions,
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { setParseImpl } from "unplugin";
import { PowerlinesAPI } from "./api";

export * from "@powerlines/core/lib/unplugin";

/**
 * Creates a Powerlines unplugin factory that generates a plugin instance.
 *
 * @param variant - The build variant for which to create the unplugin.
 * @param decorate - An optional function to decorate the unplugin options.
 * @returns The unplugin factory that generates a plugin instance.
 */
export function createUnpluginFactory<
  TContext extends Context,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant
>(
  variant: TUnpluginBuilderVariant,
  decorate?: (
    api: PowerlinesAPI<TContext["config"]>,
    plugin: UnpluginOptions<TContext>
  ) => BaseUnpluginOptions
): UnpluginFactory<TContext> {
  return (config, meta): UnpluginOptions<TContext> => {
    let logger = createLogger(config.name || "powerlines", {});
    logger.debug("Initializing Unplugin");

    try {
      const userConfig = {
        ...config,
        variant,
        unplugin: meta
      } as TContext["config"]["userConfig"];

      let api!: PowerlinesAPI<TContext["config"]>;

      async function buildStart(this: UnpluginBuildContext): Promise<void> {
        api = await PowerlinesAPI.fromOptions(
          {
            cwd: getWorkspaceRoot(process.cwd()),
            root: userConfig.root,
            mode: userConfig.mode
          },
          { command: "build", ...userConfig }
        );

        logger = api.context.logger;
        logger.debug("Powerlines build plugin starting...");

        await api.context.setup();

        setParseImpl(api.context.parse);

        logger.debug("Preparing build artifacts for the Powerlines project...");

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
        logger.debug("Finalizing Powerlines project output...");

        await api.callHook("writeBundle", {
          environment: await api.context.getEnvironment()
        });
      }

      const options = {
        name: "powerlines",
        api,
        resolveId,
        load,
        transform,
        buildStart,
        writeBundle
      } as UnpluginOptions<TContext>;

      const result = decorate ? decorate(api, options) : options;

      logger.debug("Unplugin initialized successfully.");

      return { api, ...result };
    } catch (error) {
      logger.error((error as Error)?.message);

      throw error;
    }
  };
}
