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

import type { PrintTreeOptions } from "@alloy-js/core";
import { TypeDefinitionParameter } from "@stryke/types/configuration";
import type {
  TsupBuildConfig,
  TsupResolvedBuildConfig
} from "powerlines/types/build";
import type { UserConfig } from "powerlines/types/config";
import type { PluginContext } from "powerlines/types/context";
import type { ResolvedConfig } from "powerlines/types/resolved";

export type PluginPluginAlloyOptions = Partial<PrintTreeOptions> & {
  /**
   * If true, the Alloy framework is used to generate JSON output files.
   *
   * @defaultValue false
   */
  generatesJson?: boolean;

  /**
   * If true, the Alloy framework is used to generate Markdown output files.
   *
   * @defaultValue false
   */
  generatesMarkdown?: boolean;
};

export interface PluginPluginTypesOptions {
  /**
   * The type definition for the plugin's options.
   */
  options?: TypeDefinitionParameter;

  /**
   * The type definition for the plugin's user config.
   */
  userConfig?: TypeDefinitionParameter;
}

export interface PluginPluginOptions {
  /**
   * The options applied to the [Alloy framework](https://alloy-framework.github.io/alloy/) for rendering templates.
   *
   * @remarks
   * If set to `false`, the Alloy processing step will be skipped. If set to `true`, the Alloy processing step will be enabled with its default settings.
   *
   * @defaultValue false
   */
  alloy?: PluginPluginAlloyOptions | boolean;

  /**
   * The type definitions for the Plugin plugin.
   */
  types?: PluginPluginTypesOptions;
}

export type PluginPluginUserConfig = UserConfig<
  TsupBuildConfig,
  TsupResolvedBuildConfig,
  "tsup"
> & {
  plugin: PluginPluginOptions;
};

export type PluginPluginResolvedConfig =
  ResolvedConfig<PluginPluginUserConfig> & {
    plugin: PluginPluginOptions;
  };

export type PluginPluginContext<
  TResolvedConfig extends PluginPluginResolvedConfig =
    PluginPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
