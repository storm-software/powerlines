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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { getParentPath } from "@stryke/fs/get-parent-path";
import { writeFile } from "@stryke/fs/write-file";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join";
import { defu } from "defu";
import { Plugin } from "powerlines/types/plugin";
import stylelint from "stylelint";
import { StylelintPluginContext, StylelintPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to assist in linting stylesheets with Stylelint.
 */
export function plugin(
  options: StylelintPluginOptions = {}
): Plugin<StylelintPluginContext> {
  return {
    name: "stylelint",
    async config() {
      this.log(
        LogLevelLabel.TRACE,
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
        this.config.projectRoot,
        {
          ignoreCase: true,
          skipCwd: false,
          includeNameInResults: true
        }
      );

      return {
        lint: {
          stylelint: defu(options, {
            configFile,
            cwd: joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot
            ),
            silent: this.config.logLevel !== null,
            fix: true
          })
        }
      };
    },
    async lint() {
      this.log(LogLevelLabel.TRACE, `Linting project files with Stylelint.`);

      const result = await stylelint.lint(options);

      if (this.config.lint.stylelint.outputFile) {
        await writeFile(
          appendPath(
            this.config.lint.stylelint.outputFile,
            this.config.projectRoot
          ),
          result.report
        );
      }

      if (!this.config.lint.stylelint.silent) {
        this.log(LogLevelLabel.INFO, result.report);

        const totalWarnings = result.results
          .map(res => res.warnings.filter(warn => warn.severity === "warning"))
          .reduce((prev, res) => prev + res.length, 0);
        if (totalWarnings > 0) {
          this.log(
            LogLevelLabel.WARN,
            `${totalWarnings} Stylelint linting warnings found in the listed files.`
          );
        } else if (result.errored) {
          this.log(
            LogLevelLabel.ERROR,
            "Stylelint linting errors found in the listed files."
          );
        } else {
          this.log(LogLevelLabel.INFO, "All files pass Stylelint linting.");
        }
      }
    }
  };
}

export default plugin;
