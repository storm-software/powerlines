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
  Provider,
  ProviderWrapper,
  ServerProviderStatus
} from "@openfeature/server-sdk";
import type {
  AlloyPluginContext,
  AlloyPluginOptions,
  AlloyPluginResolvedConfig,
  AlloyPluginUserConfig
} from "@powerlines/plugin-alloy/types";
import type { AutoMDPluginOptions } from "@powerlines/plugin-automd/types/plugin";
import type {
  BabelPluginContext,
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types";

export interface OpenFeaturePluginOptions {
  /**
   * A path to the type definition for the expected env configuration parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#ConfigConfiguration"`.
   */
  providers?: Map<string, ProviderWrapper<Provider, ServerProviderStatus>>;

  /**
   * AutoMD configuration options to allow injecting environment variables documentation into a markdown file such as a README.md.
   *
   * @remarks
   * The README.md file should contain the `<!-- automd:env --><!-- /automd -->` comment block where the documentation will be injected.
   */
  automd?: AutoMDPluginOptions;

  /**
   * Alloy configuration options to use when injecting environment variables into the source code.
   *
   * @remarks
   * This option allows you to customize the Alloy transformation process used to inject environment variables into the source code. If not provided, the plugin will use default Alloy settings.
   */
  alloy?: AlloyPluginOptions;
}

export type OpenFeaturePluginUserConfig = BabelPluginUserConfig &
  AlloyPluginUserConfig & {
    openFeature: OpenFeaturePluginOptions;
  };

export type OpenFeaturePluginResolvedConfig = BabelPluginResolvedConfig &
  AlloyPluginResolvedConfig & {
    openFeature: OpenFeaturePluginOptions;
  };

export interface OpenFeaturePluginContext<
  TResolvedConfig extends OpenFeaturePluginResolvedConfig =
    OpenFeaturePluginResolvedConfig
>
  extends
    BabelPluginContext<TResolvedConfig>,
    AlloyPluginContext<TResolvedConfig> {}
