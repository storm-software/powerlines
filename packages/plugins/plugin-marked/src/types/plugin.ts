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

import { marked, MarkedExtension, MarkedOptions } from "marked";
import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";

export type MarkedPluginOptions = MarkedOptions & MarkedExtension;

export type MarkedPluginUserConfig = UserConfig & {
  marked?: MarkedPluginOptions;
};

export type MarkedPluginResolvedConfig = ResolvedConfig & {
  marked: MarkedPluginOptions;
};

export type MarkedPluginContext<
  TResolvedConfig extends MarkedPluginResolvedConfig =
    MarkedPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  marked: {
    parse: (src: string, override?: Partial<MarkedOptions>) => Promise<string>;
    use: typeof marked.use;
  };
};
