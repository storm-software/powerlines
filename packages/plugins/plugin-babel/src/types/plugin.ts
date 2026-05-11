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

import type {
  PluginContext,
  ResolvedConfig,
  UserConfig
} from "@powerlines/core";
import type { BabelResolvedConfig, BabelUserConfig } from "./config";

export type BabelPluginOptions = Partial<BabelUserConfig> & {
  /**
   * Whether to skip resolving the Babel configuration. If true, the plugin will use the provided options as-is without attempting to resolve them against the file system or environment. This can be useful for performance optimization if you already have a fully resolved configuration or want to provide a custom configuration object directly.
   *
   * @defaultValue false
   */
  skipConfigResolution?: boolean;

  /**
   * Whether to only run the babel plugin without actually transforming the code. This can be useful for performance optimization if you only want to use the plugin's features without modifying the code, such as for collecting metadata or performing side effects.
   *
   * @defaultValue false
   */
  skipTransform?: boolean;
};

export type BabelPluginUserConfig = UserConfig & {
  babel?: BabelPluginOptions;
};

export interface BabelPluginResolvedConfig extends ResolvedConfig {
  babel: BabelResolvedConfig & {
    /**
     * Whether to skip resolving the Babel configuration. If true, the plugin will use the provided options as-is without attempting to resolve them against the file system or environment. This can be useful for performance optimization if you already have a fully resolved configuration or want to provide a custom configuration object directly.
     *
     * @defaultValue false
     */
    skipConfigResolution?: boolean;

    /**
     * Whether to only run the babel plugin without actually transforming the code. This can be useful for performance optimization if you only want to use the plugin's features without modifying the code, such as for collecting metadata or performing side effects.
     *
     * @defaultValue false
     */
    skipTransform?: boolean;
  };
}

export type BabelPluginContext<
  TResolvedConfig extends BabelPluginResolvedConfig = BabelPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
