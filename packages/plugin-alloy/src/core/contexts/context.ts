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

import {
  ComponentContext,
  createNamedContext,
  useContext
} from "@alloy-js/core";
import type { PluginContext } from "powerlines";

/**
 * The Powerlines context used in template rendering.
 */
export const PowerlinesContext: ComponentContext<PluginContext> =
  createNamedContext<PluginContext>("Powerlines");

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The Context.
 */
export function usePowerlinesContext<
  TContext extends PluginContext = PluginContext
>(): TContext | undefined {
  return useContext(PowerlinesContext) as TContext | undefined;
}

/**
 * Hook to safely access the {@link PluginContext | Powerlines context}.
 *
 * @returns The Powerlines context or undefined if not set.
 */
export function usePowerlinesSafe<
  TContext extends PluginContext = PluginContext
>(): TContext | undefined {
  const powerlines = usePowerlinesContext<TContext>();

  return powerlines ?? undefined;
}

/**
 * Hook to access the {@link PluginContext | Powerlines context}.
 *
 * @returns The Powerlines context.
 */
export function usePowerlines<
  TContext extends PluginContext = PluginContext
>(): TContext {
  const powerlines = usePowerlinesSafe<TContext>();
  if (!powerlines) {
    throw new Error(
      "Powerlines - Context is not set. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return powerlines;
}
