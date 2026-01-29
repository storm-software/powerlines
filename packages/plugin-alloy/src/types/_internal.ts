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

/* eslint-disable ts/naming-convention */

import { UNSAFE_PluginContextInternal } from "powerlines/types/_internal";
import { MetaItem } from "../core";
import { AlloyPluginResolvedConfig } from "./plugin";

/**
 * Internal fields and methods for internal contexts
 *
 * @internal
 */
export interface UNSAFE_AlloyPluginContextInternal<
  TResolvedConfig extends AlloyPluginResolvedConfig = AlloyPluginResolvedConfig
> extends UNSAFE_PluginContextInternal<TResolvedConfig> {
  meta: {
    /**
     * The meta information collected during the Powerlines process
     *
     * @internal
     */
    alloy: Record<string, MetaItem>;
  };
}

/**
 * An internal representation of the context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_AlloyPluginContext<
  TResolvedConfig extends AlloyPluginResolvedConfig = AlloyPluginResolvedConfig
> extends UNSAFE_PluginContextInternal<TResolvedConfig> {
  $$internal: UNSAFE_AlloyPluginContextInternal<TResolvedConfig>;
}
