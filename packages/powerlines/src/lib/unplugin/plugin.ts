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
import { findFileName } from "@stryke/path/file-path-fns";
import { replaceExtension } from "@stryke/path/replace";
import { isString } from "@stryke/type-checks/is-string";
import type {
  ExternalIdResult,
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { UnpluginBuildVariant } from "../../types/build";
import { PluginContext } from "../../types/context";
import { UNSAFE_PluginContext } from "../../types/internal";
import { PowerlinesUnpluginFactory } from "../../types/unplugin";
import { extendLog } from "../logger";
import { getString } from "../utilities/source-file";
import { combineContexts } from "./helpers";

export interface CreateUnpluginOptions {
  /**
   * If true, skips the plugin resolution step.
   *
   * @remarks
   * This value should be set to `true` when using a build tool that handles `external` and `noExternal` options itself (for example `tsup`).
   *
   * @defaultValue false
   */
  skipResolve?: boolean;
}

/**
 * Creates a Powerlines unplugin instance.
 *
 * @param context - The plugin context.
 * @param options - Options for creating the unplugin.
 * @returns The unplugin instance.
 */
export function createUnplugin<TContext extends PluginContext = PluginContext>(
  context: TContext,
  _options: CreateUnpluginOptions = {}
): PowerlinesUnpluginFactory<UnpluginBuildVariant> {
  const ctx = context as unknown as UNSAFE_PluginContext;

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
        const resolved = await (async () => {
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

          result = await ctx.resolveId(id, importer, opts);
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
        })();
        if (
          resolved &&
          opts.isEntry &&
          ctx.config.build.polyfill &&
          ctx.config.build.polyfill.length > 0
        ) {
          const entry = ctx.entry.find(
            entry =>
              entry.file === (isString(resolved) ? resolved : resolved.id)
          );
          if (entry) {
            entry.file = `${replaceExtension(isString(resolved) ? resolved : resolved.id)}-polyfill.ts`;
            entry.output ||= entry.output?.replace(
              findFileName(entry.output, { withExtension: true }),
              entry.file
            );

            await ctx.emitEntry(
              `
${ctx.config.build.polyfill.map(p => `import "${p}";`).join("\n")}

export * from "${isString(resolved) ? resolved : resolved.id}";
`,
              entry.file,
              { mode: "virtual" }
            );

            return entry.file;
          }
        }

        return resolved;
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

        for (const handler of ctx.$$internal.environment.selectHooks(
          "transform"
        )) {
          const result: TransformResult | string | undefined =
            await handler.apply(combineContexts(ctx, this), [
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
