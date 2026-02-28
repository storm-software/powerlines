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

import { getParentPath } from "@stryke/fs/get-parent-path";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join";
import { defu } from "defu";
import { Plugin } from "powerlines";
import stylelint from "stylelint";
import {
  StylelintPluginContext,
  StylelintPluginOptions,
  StylelintPluginResolvedConfig
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    stylelint?: StylelintPluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in linting stylesheets with Stylelint.
 */
export function plugin(
  options: StylelintPluginOptions = {}
): Plugin<StylelintPluginContext> {
  return {
    name: "stylelint",
    async config() {
      this.debug(
        "Providing default configuration for the Powerlines `stylelint` build plugin."
      );

      const configFile = getParentPath(
        [
          "stylelint.config.js",
          "stylelint.config.mjs",
          "stylelint.config.cjs",
          "stylelint.config.ts",
          "stylelint.config.mts",
          "stylelint.config.cts",
          ".stylelintrc.js",
          ".stylelintrc.cjs",
          ".stylelintrc.yaml",
          ".stylelintrc.yml",
          ".stylelintrc.json",
          ".stylelintrc"
        ],
        this.config.root,
        {
          ignoreCase: true,
          skipCwd: false,
          includeNameInResults: true
        }
      );

      return {
        stylelint: defu(options, {
          configFile,
          cwd: joinPaths(this.workspaceConfig.workspaceRoot, this.config.root),
          silent: this.config.logLevel !== null,
          fix: true
        })
      } as Partial<StylelintPluginResolvedConfig>;
    },
    async lint() {
      this.debug(`Linting project files with Stylelint.`);

      const result = await stylelint.lint(options);

      if (this.config.stylelint.outputFile) {
        await this.fs.write(
          appendPath(this.config.stylelint.outputFile, this.config.root),
          result.report
        );
      }

      if (!this.config.stylelint.silent) {
        this.info(result.report);

        const totalWarnings = result.results
          .map(res => res.warnings.filter(warn => warn.severity === "warning"))
          .reduce((prev, res) => prev + res.length, 0);
        if (totalWarnings > 0) {
          this.warn(
            `${totalWarnings} Stylelint linting warnings found in the listed files.`
          );
        } else if (result.errored) {
          this.error("Stylelint linting errors found in the listed files.");
        } else {
          this.info("All files pass Stylelint linting.");
        }
      }
    }
  };
}

export default plugin;
