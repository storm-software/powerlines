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

import { Unstable_PluginContext } from "@powerlines/core/types/_internal";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import type {
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { setParseImpl } from "unplugin";
import { PluginContext } from "../../types/context";
import { UnpluginFactory } from "../../types/unplugin";
import { extendLog } from "../logger";
import { getString } from "../utilities/source-file";
import { combineContexts } from "./helpers";
import {
  createUnpluginModuleResolutionFunctions,
  CreateUnpluginModuleResolutionFunctionsOptions
} from "./module-resolution";

export interface CreateUnpluginResolverOptions extends CreateUnpluginModuleResolutionFunctionsOptions {
  /**
   * A name to use for the unplugin instance. This is used for logging and to generate the plugin name. It does not affect the functionality of the plugin.
   *
   * @remarks
   * If not provided, the plugin will be named "powerlines". If provided, the plugin will be named `${name} - Powerlines` (e.g., "MyPlugin - Powerlines").
   *
   * @defaultValue "powerlines"
   */
  name?: string;
}

/**
 * Creates a Powerlines unplugin instance.
 *
 * @param context - The plugin context.
 * @returns The unplugin instance.
 */
export function createUnpluginResolver<
  TContext extends PluginContext = PluginContext
>(
  context: TContext,
  options: CreateUnpluginResolverOptions = {}
): UnpluginFactory<TContext> {
  const ctx = context as unknown as Unstable_PluginContext;
  setParseImpl(ctx.parse);

  const name = options.name || "powerlines";

  return () => {
    const log = extendLog(ctx.log, name);
    log(LogLevelLabel.DEBUG, `Initializing ${titleCase(name)} plugin`);

    try {
      const { resolveId, load } =
        createUnpluginModuleResolutionFunctions<TContext>(context, options);

      return {
        name:
          name.toLowerCase() === "powerlines"
            ? "powerlines"
            : `powerlines:${kebabCase(name)}`,
        api: ctx.$$internal.api,
        resolveId,
        load
      };
    } catch (error) {
      log(LogLevelLabel.FATAL, (error as Error)?.message);

      throw error;
    }
  };
}

export interface CreateUnpluginOptions extends CreateUnpluginResolverOptions {
  /**
   * Whether to silence logging for the plugin hooks. This can be useful for plugins that run frequently or have hooks that are called often, to reduce noise in the logs. When set to `true`, the plugin will not log any messages for its hooks. When set to `false` (the default), the plugin will log messages for its hooks as normal.
   *
   * @defaultValue false
   */
  silenceHookLogging?: boolean;
}

/**
 * Creates a Powerlines unplugin instance.
 *
 * @param context - The plugin context.
 * @returns The unplugin instance.
 */
export function createUnplugin<TContext extends PluginContext = PluginContext>(
  context: TContext,
  options: CreateUnpluginOptions = {}
): UnpluginFactory<TContext> {
  const ctx = context as unknown as Unstable_PluginContext;
  setParseImpl(ctx.parse);

  const name = options.name || "powerlines";

  return () => {
    const log = options.name ? extendLog(ctx.log, name) : ctx.log;
    log(LogLevelLabel.DEBUG, `Initializing ${titleCase(name)} plugin`);

    try {
      const { resolveId, load } =
        createUnpluginModuleResolutionFunctions<TContext>(context, options);

      async function buildStart(this: UnpluginBuildContext) {
        if (!options.silenceHookLogging) {
          log(LogLevelLabel.DEBUG, "Powerlines build plugin starting...");
        }

        await ctx.$$internal.callHook("buildStart", {
          sequential: true
        });
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
        if (!options.silenceHookLogging) {
          log(LogLevelLabel.DEBUG, "Powerlines build plugin finishing...");
        }

        return ctx.$$internal.callHook("buildEnd", {
          sequential: true
        });
      }

      async function writeBundle(): Promise<void> {
        if (!options.silenceHookLogging) {
          log(LogLevelLabel.DEBUG, "Finalizing Powerlines project output...");
        }

        return ctx.$$internal.callHook("writeBundle", {
          sequential: true
        });
      }

      return {
        name:
          name.toLowerCase() === "powerlines"
            ? "powerlines"
            : `powerlines:${kebabCase(name)}`,
        api: ctx.$$internal.api,
        resolveId,
        load,
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
