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

import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";

export interface OxlintPluginOptions {
  /**
   * A glob pattern or path to ignore files and directories.
   */
  ignorePatterns?: string | string[];

  /**
   * The path to the Oxlint configuration file.
   *
   * @defaultValue ".oxlintrc.json"
   */
  configFile?: string;

  /**
   * An array of rules to deny
   */
  deny?: string[];

  /**
   * An array of rules to allow
   */
  allow?: string[];

  /**
   * An array of rules to warn about
   */
  warn?: string[];

  /**
   * Additional parameters to pass to the Oxlint CLI
   */
  params?: string;

  /**
   * The path to the Oxlint binary
   */
  oxlintPath?: string;

  /**
   * Whether to enable [type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware.html)
   *
   * @defaultValue true
   */
  typeAware?: boolean;

  /**
   * Whether to automatically fix fixable issues.
   *
   * - `true` - Automatically fix fixable issues.
   * - `false` - Do not fix any issues.
   * - `"suggestions"` - Only apply fixes that are considered suggestions.
   * - `"dangerously"` - Apply all fixes, including those that may change code behavior.
   *
   * @defaultValue true
   */
  fix?: boolean | "suggestions" | "dangerously";

  /**
   * The output format for linting results.
   *
   * @defaultValue "stylish"
   */
  format?:
    | "stylish"
    | "checkstyle"
    | "github"
    | "gitlab"
    | "json"
    | "junit"
    | "unix";
}

export interface OxlintPluginUserConfig extends UserConfig {
  /**
   * Options for the Oxlint plugin.
   */
  oxlint?: OxlintPluginOptions;
}

export interface OxlintPluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the Oxlint plugin.
   */
  oxlint: Omit<
    OxlintPluginOptions,
    "configFile" | "deny" | "allow" | "warn" | "typeAware" | "fix" | "format"
  > &
    Required<
      Pick<
        OxlintPluginOptions,
        | "configFile"
        | "deny"
        | "allow"
        | "warn"
        | "typeAware"
        | "fix"
        | "format"
      >
    >;
}

export type OxlintPluginContext<
  TResolvedConfig extends OxlintPluginResolvedConfig =
    OxlintPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
