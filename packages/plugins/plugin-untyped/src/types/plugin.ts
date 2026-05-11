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

import { getGenerateAction } from "@storm-software/untyped/generate";
import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";

export interface UntypedPluginOptions {
  /**
   * A path or glob pattern (or an array of paths and glob patterns) to schemas containing the Untyped type definitions used during generation.
   *
   * @defaultValue "\{root\}/**\/\{untyped.ts,*.untyped.ts\}"
   */
  schema?: string | string[];

  /**
   * The path for the generated Untyped output files
   *
   * @remarks
   * By default, it will generate the output files alongside each schema file.
   */
  outputPath?: string;
}

export interface UntypedPluginUserConfig extends UserConfig {
  untyped?: UntypedPluginOptions;
}

export interface UntypedPluginResolvedConfig extends ResolvedConfig {
  untyped: UntypedPluginOptions;
}

export interface UntypedPluginContext<
  TResolvedConfig extends UntypedPluginResolvedConfig =
    UntypedPluginResolvedConfig
> extends PluginContext<TResolvedConfig> {
  untyped: ReturnType<typeof getGenerateAction>;
}
