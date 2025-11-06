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

import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import { SatoriOptions } from "satori";

export interface SatoriPluginOptions {
  /**
   * A path or glob pattern (or an array of paths and glob patterns) to files that have a Satori component default export.
   */
  path: string | string[];

  /**
   * The path for the generated Satori output images
   *
   * @remarks
   * By default, it will generate the output files alongside each satori component file.
   */
  outputPath?: string;

  /**
   * Default Satori options to apply to all components.
   *
   * @remarks
   * These options can be overridden by individual component modules that export their own options.
   */
  defaultOptions?: Partial<SatoriOptions>;
}

export interface SatoriPluginUserConfig extends UserConfig {
  satori?: Omit<SatoriPluginOptions, "defaultOptions"> &
    Required<Pick<SatoriPluginOptions, "defaultOptions">>;
}

export interface SatoriPluginResolvedConfig extends ResolvedConfig {
  satori: Omit<SatoriPluginOptions, "defaultOptions"> &
    Required<Pick<SatoriPluginOptions, "defaultOptions">> & {
      /**
       * An array of resolved input file paths containing Satori components.
       *
       * @remarks
       * These paths are determined based on the {@link SatoriPluginOptions.path} option provided in the plugin configuration. These are **not** glob patterns, but the actual resolved file paths.
       */
      inputs: string[];
    };
}

export type SatoriPluginContext<
  TResolvedConfig extends
    SatoriPluginResolvedConfig = SatoriPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
