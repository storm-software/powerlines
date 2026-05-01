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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import { LoadResult } from "rollup";
import type {
  UnpluginBuildContext,
  UnpluginContext,
  UnpluginOptions
} from "unplugin";
import {
  VIRTUAL_MODULE_PREFIX,
  VIRTUAL_MODULE_PREFIX_REGEX
} from "../../constants";
import { Unstable_PluginContext } from "../../types/_internal";
import { PluginContext, ResolveResult } from "../../types/context";
import { ResolveOptions } from "../../types/fs";

export interface CreateUnpluginModuleResolutionFunctionsOptions {
  /**
   * An indicator of whether to prefix virtual module IDs with a specific string. This is useful for ensuring that virtual modules are only processed by the plugin and not by other plugins or the bundler itself.
   *
   * @remarks
   * - If set to `true`, virtual module IDs will be prefixed with the string `__powerlines-virtual:`.
   * - If set to `false`, no prefix will be added to virtual module IDs.
   *
   * @defaultValue true
   */
  prefix?: boolean;

  /**
   * Optional overrides for the module resolution configuration.
   *
   * @remarks
   * This allows you to customize the behavior of the module resolution hooks by providing specific configuration options.
   */
  overrides?: Partial<ResolveOptions>;
}

/**
 * Creates the module resolution hook functions for a Powerlines unplugin plugin instance.
 *
 * @remarks
 * This includes the `resolveId` and `load` hooks.
 *
 * @see https://rollupjs.org/plugin-development/#resolveid
 * @see https://rollupjs.org/plugin-development/#load
 *
 * @param context - The plugin context.
 * @param options - Options for creating the module resolution functions.
 * @returns The module resolution hooks (`resolveId` and `load`).
 */
export function createUnpluginModuleResolutionFunctions<
  TContext extends PluginContext = PluginContext
>(
  context: TContext,
  options: CreateUnpluginModuleResolutionFunctionsOptions = {}
): Pick<UnpluginOptions, "resolveId" | "load"> {
  const ctx = context as unknown as Unstable_PluginContext;

  return {
    async resolveId(
      this: UnpluginBuildContext & UnpluginContext,
      id: string,
      importer?: string,
      opts: {
        isEntry: boolean;
      } = { isEntry: false }
    ): Promise<string | ResolveResult | null | undefined> {
      const normalizedId = id.replace(VIRTUAL_MODULE_PREFIX_REGEX, "");
      const normalizedImporter = importer
        ? importer.replace(VIRTUAL_MODULE_PREFIX_REGEX, "")
        : undefined;

      let result = await ctx.api.callHook(
        "resolveId",
        {
          sequential: true,
          result: "first",
          order: "pre"
        },
        normalizedId,
        normalizedImporter,
        opts
      );
      if (isSetString(result)) {
        return result;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id:
            result.virtual && options.prefix !== false
              ? `${VIRTUAL_MODULE_PREFIX}${result.id}`
              : result.id
        };
      }

      result = await ctx.api.callHook(
        "resolveId",
        {
          sequential: true,
          result: "first",
          order: "normal"
        },
        normalizedId,
        normalizedImporter,
        opts
      );
      if (isSetString(result)) {
        return result;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id:
            result.virtual && options.prefix !== false
              ? `${VIRTUAL_MODULE_PREFIX}${result.id}`
              : result.id
        };
      }

      result = await ctx.resolve(
        normalizedId,
        normalizedImporter,
        defu(options.overrides ?? {}, {
          isFile: true,
          ...opts
        })
      );
      if (isSetObject(result)) {
        return {
          ...result,
          id:
            result.virtual && options.prefix !== false
              ? `${VIRTUAL_MODULE_PREFIX}${result.id}`
              : result.id
        };
      }

      result = await ctx.api.callHook(
        "resolveId",
        {
          sequential: true,
          result: "first",
          order: "post"
        },
        normalizedId,
        normalizedImporter,
        opts
      );
      if (isSetString(result)) {
        return result;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id:
            result.virtual && options.prefix !== false
              ? `${VIRTUAL_MODULE_PREFIX}${result.id}`
              : result.id
        };
      }

      return null;
    },
    load: {
      filter:
        options.prefix !== false
          ? {
              id: {
                include: [VIRTUAL_MODULE_PREFIX_REGEX]
              }
            }
          : undefined,
      async handler(
        this: UnpluginBuildContext & UnpluginContext,
        id: string
      ): Promise<LoadResult | null | undefined> {
        const normalizedId = id.replace(VIRTUAL_MODULE_PREFIX_REGEX, "");

        let result = await ctx.api.callHook(
          "load",
          {
            sequential: true,
            result: "first",
            order: "pre"
          },
          normalizedId
        );
        if (result) {
          return result;
        }

        result = await ctx.api.callHook(
          "load",
          {
            sequential: true,
            result: "first",
            order: "normal"
          },
          normalizedId
        );
        if (result) {
          return result;
        }

        result = await ctx.load(normalizedId);
        if (result) {
          return result;
        }

        return ctx.api.callHook(
          "load",
          {
            sequential: true,
            result: "first",
            order: "post"
          },
          normalizedId
        );
      }
    }
  };
}
