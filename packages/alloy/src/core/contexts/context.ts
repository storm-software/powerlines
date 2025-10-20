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

export interface PowerlinesContextInterface<
  TContext extends PluginContext = PluginContext
> {
  ref: Ref<TContext>;
}

/**
 * The Powerlines context used in template rendering.
 */
export const PowerlinesContext: ComponentContext<
  PowerlinesContextInterface<any>
> = createContext<PowerlinesContextInterface<any>>();

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The Context.
 */
export function usePowerlinesContext<
  TContext extends PluginContext = PluginContext
>(): PowerlinesContextInterface<TContext> | undefined {
  return useContext<PowerlinesContextInterface<TContext>>(PowerlinesContext);
}

/**
 * Hook to access the Powerlines Context.
 *
 * @returns The reactive context ref.
 */
export function usePowerlines<
  TContext extends PluginContext = PluginContext
>(): Ref<TContext> | undefined {
  const storm = usePowerlinesContext<TContext>();

  return storm?.ref;
}
