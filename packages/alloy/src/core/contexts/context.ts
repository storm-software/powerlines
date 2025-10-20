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

import type { ComponentContext, Ref } from "@alloy-js/core";
import { createContext, useContext } from "@alloy-js/core";
import type { PluginContext } from "powerlines/types/context";

export interface StormStackContextInterface<
  TContext extends PluginContext = PluginContext
> {
  ref: Ref<TContext>;
}

/**
 * The Powerlines context used in template rendering.
 */
export const StormStackContext: ComponentContext<
  StormStackContextInterface<any>
> = createContext<StormStackContextInterface<any>>();

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The Context.
 */
export function useStormStack<
  TContext extends PluginContext = PluginContext
>(): StormStackContextInterface<TContext> | undefined {
  return useContext<StormStackContextInterface<TContext>>(StormStackContext);
}

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The reactive context ref.
 */
export function useStorm<TContext extends PluginContext = PluginContext>():
  | Ref<TContext>
  | undefined {
  const storm =
    useContext<StormStackContextInterface<TContext>>(StormStackContext);

  return storm?.ref;
}
