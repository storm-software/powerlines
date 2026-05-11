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

import { BabelPluginOptions } from "@powerlines/plugin-babel/types/plugin";
import {
  EnvPluginContext,
  EnvPluginOptions,
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "@powerlines/plugin-env/types/plugin";

export interface NodeJsPluginOptions {
  /**
   * Options to pass to the [Babel plugin](https://npmjs.com/package/\@powerlines/plugin-babel).
   */
  babel?: Partial<BabelPluginOptions>;

  /**
   * Options to pass to the [Env plugin](https://npmjs.com/package/\@powerlines/plugin-env).
   */
  env?: Partial<Omit<EnvPluginOptions, "babel">>;
}

export type NodeJsPluginUserConfig = EnvPluginUserConfig;

export type NodeJsPluginResolvedConfig = EnvPluginResolvedConfig;

export type NodeJsPluginContext<
  TResolvedConfig extends NodeJsPluginResolvedConfig =
    NodeJsPluginResolvedConfig
> = EnvPluginContext<TResolvedConfig>;
