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

import type { ESLint as FlatESLint } from "eslint";
import { ESLint } from "eslint";
import type { LegacyESLint } from "eslint/use-at-your-own-risk";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export interface ESLintPluginOptions {
  /**
   * The path to the ESLint configuration file.
   */
  configFile?: string;

  /**
   * Whether to report errors only
   */
  reportErrorsOnly?: boolean;

  /**
   * The maximum number of warnings to allow before failing the process
   */
  maxWarnings?: number;

  /**
   * The output file to write the results to.
   */
  outputFile?: string | null;

  /**
   * Whether to automatically fix problems
   *
   * @defaultValue true
   */
  fix?: boolean;

  /**
   * The type of ESLint configuration to use.
   */
  type?: "base" | "recommended" | "strict";

  /**
   * Options to be passed to the ESLint generator.
   *
   * @remarks
   * These options will be override any other values passed to the ESLint generator.
   */
  override?: Partial<ESLint.Options>;
}

export interface ESLintPluginUserConfig extends UserConfig {
  /**
   * Options for the ESLint plugin.
   */
  lint?: {
    eslint?: ESLintPluginOptions;
  };
}

export interface ESLintPluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the ESLint plugin.
   */
  lint: {
    eslint: ESLintPluginOptions;
  };
}

export type ESLintPluginContext<
  TResolvedConfig extends
    ESLintPluginResolvedConfig = ESLintPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  /**
   * The initialized ESLint application.
   */
  eslint: FlatESLint | LegacyESLint;
};
