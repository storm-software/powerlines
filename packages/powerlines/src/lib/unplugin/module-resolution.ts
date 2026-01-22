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

import { LoadResult } from "rollup";
import type {
  ExternalIdResult,
  HookFnMap,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { PluginContext } from "../../types/context";
import { UNSAFE_PluginContext } from "../../types/internal";

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
>(context: TContext): Pick<HookFnMap, "resolveId" | "load"> {
  const ctx = context as unknown as UNSAFE_PluginContext;

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
  ): Promise<LoadResult | null | undefined> {
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

  return {
    resolveId,
    load
  };
}
