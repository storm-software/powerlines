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

export interface BiomePluginOptions {
  /**
   * A glob pattern or path to ignore files and directories.
   */
  ignorePatterns?: string | string[];

  /**
   * The path to the Biome configuration file.
   *
   * @defaultValue "biome.json"
   */
  configFile?: string;

  /**
   * Whether to write changes to disk.
   *
   * @defaultValue false
   */
  fix?: boolean | "unsafe";

  /**
   * Whether to enable the JavaScript linter.
   */
  javascriptLinterEnabled?: boolean;

  /**
   * Whether to enable the JSON linter.
   */
  jsonLinterEnabled?: boolean;

  /**
   * The maximum file size to lint.
   */
  filesMaxSize?: number;

  /**
   * Whether to ignore unknown files.
   */
  filesIgnoreUnknown?: boolean;

  /**
   * Set the formatting mode for markup: `false` prints everything as plain text, `“force”` forces the formatting of markup using ANSI even if the console output is determined to be incompatible.
   */
  colors?: false | "force";

  /**
   * The output format to use.
   *
   * @defaultValue "stylish"
   */
  format?: "stylish" | "compact" | "json" | "json-pretty" | "junit" | "github";

  /**
   * The maximum number of diagnostics to report.
   *
   * @defaultValue 20
   */
  maxDiagnostics?: number;

  /**
   * Skip over files containing syntax errors instead of emitting an error diagnostic.
   */
  skipParseErrors?: boolean;

  /**
   * Silence errors that would be emitted in case no files were processed during the execution of the command.
   */
  noErrorsOnUnmatched?: boolean;

  /**
   * Tell Biome to exit with an error code if some diagnostics emit warnings.
   */
  errorOnWarnings?: boolean;

  /**
   * Allows JSON files with comments to be used as configuration files.
   */
  jsonParseAllowComments?: true;

  /**
   * Allows JSON files with trailing commas to be used as configuration files.
   */
  jsonParseAllowTrailingCommas?: true;

  /**
   * Allows to change how diagnostics and summary are reported.
   */
  reporter?:
    | "json"
    | "json-pretty"
    | "github"
    | "junit"
    | "summary"
    | "gitlab"
    | "checkstyle"
    | "rdjson";

  /**
   * The output format to use.
   *
   * @defaultValue "pretty"
   */
  logKind?: "pretty" | "compact" | "json";

  /**
   * The level of diagnostics to report.
   *
   * @defaultValue "info"
   */
  diagnosticLevel?: "error" | "warn" | "info";

  /**
   * Fixes lint rule violations with comment suppressions instead of using a rule code action (fix)
   */
  suppress?: boolean;

  /**
   * The reason for suppressing a lint rule violation.
   */
  reason?: string;

  /**
   * Run only the given rule, group of rules or domain. If the severity level of a rule is `off`, then the severity level of the rule is set to `error` if it is a recommended rule or `warn` otherwise.
   */
  only?: string[];

  /**
   * Skip the given rule, group of rules or domain by setting the severity level of the rules to `off`. This option takes precedence over {@link only}.
   */
  skip?: string[];

  /**
   * Use this option when you want to format code piped from stdin, and print the output to stdout.
   */
  stdinFilePath?: string;

  /**
   * Whether to enable version control system integration.
   */
  vcsEnabled?: boolean;

  /**
   * The kind of version control system client.
   *
   * @defaultValue "git"
   */
  vcsClientKind?: string;

  /**
   * Whether to use the VCS ignore file to exclude files from linting.
   */
  vcsUseIgnoreFile?: boolean;

  /**
   * Whether to lint only staged files in the version control system.
   */
  staged?: boolean;

  /**
   * Whether to lint only changed files in the version control system.
   */
  changed?: boolean;

  /**
   * Additional parameters to pass to the Biome CLI
   */
  params?: string;

  /**
   * The path to the Biome binary
   */
  biomePath?: string;
}

export interface BiomePluginUserConfig extends UserConfig {
  /**
   * Options for the Biome plugin.
   */
  lint?: {
    biome?: BiomePluginOptions;
  };
}

export interface BiomePluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the Biome plugin.
   */
  lint: {
    biome: BiomePluginOptions;
  };
}

export type BiomePluginContext<
  TResolvedConfig extends BiomePluginResolvedConfig = BiomePluginResolvedConfig
> = PluginContext<TResolvedConfig>;
