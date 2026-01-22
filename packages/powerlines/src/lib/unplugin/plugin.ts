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
import type {
  ExternalIdResult,
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { setParseImpl } from "unplugin";
import { UnpluginBuilderVariant } from "../../types/build";
import { PluginContext } from "../../types/context";
import { UNSAFE_PluginContext } from "../../types/internal";
import { UnpluginFactory } from "../../types/unplugin";
import { extendLog } from "../logger";
import { getString } from "../utilities/source-file";
import { combineContexts } from "./helpers";

/**
 * Creates a Powerlines unplugin instance.
 *
 * @param context - The plugin context.
 * @returns The unplugin instance.
 */
export function createUnplugin<
  TContext extends PluginContext = PluginContext,
  TBuildVariant extends UnpluginBuilderVariant = UnpluginBuilderVariant
>(context: TContext): UnpluginFactory<TBuildVariant> {
  const ctx = context as unknown as UNSAFE_PluginContext;
  setParseImpl(ctx.parse);

  return () => {
    const log = extendLog(ctx.log, "unplugin");
    log(LogLevelLabel.DEBUG, "Initializing Unplugin");

    try {
      async function buildStart(this: UnpluginBuildContext) {
        log(LogLevelLabel.DEBUG, "Powerlines build plugin starting...");

        await ctx.$$internal.callHook("buildStart", {
          sequential: true
        });
      }

      async function resolveId(
        this: UnpluginBuildContext & UnpluginContext,
        id: string,
        importer?: string,
        opts: {
          isEntry: boolean;
        } = { isEntry: false }
      ): Promise<string | ExternalIdResult | null | undefined> {
        let result = await ctx.$$internal.callHook(
          "resolveId",
          {
            sequential: true,
            result: "first",
            order: "pre"
          },
          id,
          importer,
          opts
        );
        if (result) {
          return result;
        }

        result = await ctx.$$internal.callHook(
          "resolveId",
          {
            sequential: true,
            result: "first",
            order: "normal"
          },
          id,
          importer,
          opts
        );
        if (result) {
          return result;
        }

        result = await ctx.resolve(id, importer, opts);
        if (result) {
          return result;
        }

        return ctx.$$internal.callHook(
          "resolveId",
          {
            sequential: true,
            result: "first",
            order: "post"
          },
          id,
          importer,
          opts
        );
      }

      async function load(
        this: UnpluginBuildContext & UnpluginContext,
        id: string
      ): Promise<TransformResult | null | undefined> {
        let result = await ctx.$$internal.callHook(
          "load",
          {
            sequential: true,
            result: "first",
            order: "pre"
          },
          id
        );
        if (result) {
          return result;
        }

        result = await ctx.$$internal.callHook(
          "load",
          {
            sequential: true,
            result: "first",
            order: "normal"
          },
          id
        );
        if (result) {
          return result;
        }

        result = await ctx.load(id);
        if (result) {
          return result;
        }

        return ctx.$$internal.callHook(
          "load",
          {
            sequential: true,
            result: "first",
            order: "post"
          },
          id
        );
      }

      async function transform(
        this: UnpluginBuildContext & UnpluginContext,
        code: string,
        id: string
      ): Promise<TransformResult | null | undefined> {
        let transformed: TransformResult | string = code;

        for (const hook of ctx.$$internal.environment.selectHooks(
          "transform"
        )) {
          const result: TransformResult | string | undefined =
            await hook.handler.apply(combineContexts(ctx, this), [
              getString(transformed),
              id
            ]);
          if (result) {
            transformed = result;
          }
        }

        return transformed;
      }

      async function buildEnd(this: UnpluginBuildContext): Promise<void> {
        log(LogLevelLabel.DEBUG, "Powerlines build plugin finishing...");

        return ctx.$$internal.callHook("buildEnd", {
          sequential: true
        });
      }

      async function writeBundle(): Promise<void> {
        log(LogLevelLabel.DEBUG, "Finalizing Powerlines project output...");

        return ctx.$$internal.callHook("writeBundle", {
          sequential: true
        });
      }

      return {
        name: "powerlines",
        api: ctx.$$internal.api,
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
              include: [/.*/]
            }
          },
          handler: load
        },
        transform,
        buildStart,
        buildEnd,
        writeBundle,
        vite: {
          sharedDuringBuild: true
        }
      };
    } catch (error) {
      log(LogLevelLabel.FATAL, (error as Error)?.message);

      throw error;
    }
  };
}
