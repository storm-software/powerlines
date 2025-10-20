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

import { Children } from "@alloy-js/core/jsx-runtime";
import type { PluginPluginAlloyOptions } from "@powerlines/plugin-plugin/types/plugin";
import type { MaybePromise } from "@stryke/types/base";
import { PluginContext } from "powerlines/types/context";
import type { Plugin } from "powerlines/types/plugin";

export interface AlloyPluginOptions {
  alloy?: PluginPluginAlloyOptions;
}

export type AlloyPluginBuilder<
  TOptions = any,
  TContext extends PluginContext = PluginContext
> = (options: TOptions) => MaybePromise<
  Plugin<TContext> & {
    render: (this: TContext) => Children;
  }
>;
