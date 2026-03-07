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
import { LoadResult } from "rollup";
import type {
  ExternalIdResult,
  HookFnMap,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { UNSAFE_PluginContext } from "../../types/_internal";
import { PluginContext } from "../../types/context";

export interface CreateUnpluginModuleResolutionFunctionsOptions {
  /**
   * A prefix to apply to all resolved module IDs. This can be used to create virtual modules by prefixing them with a specific string (e.g., `\0`).
   *
   * @remarks
   * If set to `false`, no prefix will be applied, and resolved module IDs will be returned as-is. By default, this is set to `\0`, which is a common convention for virtual modules in Rollup and Vite plugins.
   *
   * @defaultValue "\\0"
   */
  prefix?: string | boolean;
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
 * @returns The module resolution hooks (`resolveId` and `load`).
 */
export function createUnpluginModuleResolutionFunctions<
  TContext extends PluginContext = PluginContext
>(
  context: TContext,
  options: CreateUnpluginModuleResolutionFunctionsOptions = {}
): Pick<HookFnMap, "resolveId" | "load"> {
  const ctx = context as unknown as UNSAFE_PluginContext;

  let prefix = "";
  if (options.prefix === true) {
    prefix = "\0";
  } else if (isSetString(options.prefix)) {
    prefix = options.prefix;
  }

  return {
    async resolveId(
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
      if (isSetString(result)) {
        return `${prefix}${result}`;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id: `${prefix}${result.id}`
        };
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
      if (isSetString(result)) {
        return `${prefix}${result}`;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id: `${prefix}${result.id}`
        };
      }

      result = await ctx.resolve(id, importer, opts);
      if (isSetString(result)) {
        return `${prefix}${result}`;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id: `${prefix}${result.id}`
        };
      }

      result = await ctx.$$internal.callHook(
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
      if (isSetString(result)) {
        return `${prefix}${result}`;
      } else if (isSetObject(result)) {
        return {
          ...result,
          id: `${prefix}${result.id}`
        };
      }

      return null;
    },
    async load(
      this: UnpluginBuildContext & UnpluginContext,
      id: string
    ): Promise<LoadResult | null | undefined> {
      const moduleId = prefix
        ? id.replace(new RegExp(`^${prefix}*`, "g"), "")
        : id;

      let result = await ctx.$$internal.callHook(
        "load",
        {
          sequential: true,
          result: "first",
          order: "pre"
        },
        moduleId
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
        moduleId
      );
      if (result) {
        return result;
      }

      result = await ctx.load(moduleId);
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
        moduleId
      );
    }
  };
}
