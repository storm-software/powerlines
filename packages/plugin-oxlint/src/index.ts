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

import { execute, executePackage } from "@stryke/cli/execute";
import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { getParentPath } from "@stryke/fs/get-parent-path";
import { isPackageListed } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { Plugin } from "powerlines/types/plugin";
import { OxlintPluginContext, OxlintPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to assist in linting a project with Biome.
 */
export function plugin(
  options: OxlintPluginOptions = {}
): Plugin<OxlintPluginContext> {
  return {
    name: "oxlint",
    async config() {
      this.debug(
        "Providing default configuration for the Powerlines `oxlint` linting plugin."
      );

      return {
        lint: {
          oxlint: {
            configFile: ".oxlintrc.json",
            deny: [],
            allow: [],
            warn: [],
            typeAware: true,
            fix: true,
            format: "stylish",
            ...options
          }
        }
      };
    },
    configResolved() {
      this.devDependencies.oxlint = "^1.24.0";
      if (this.config.lint.oxlint.typeAware) {
        this.devDependencies["oxlint-tsgolint"] = "^0.2.1";
      }
    },
    async lint() {
      this.debug("Linting project files with Oxlint.");

      const args: string[] = [];

      if (this.config.lint.oxlint.params) {
        args.push(...this.config.lint.oxlint.params.split(" ").filter(Boolean));
      }

      if (
        !args.includes("--ignore-pattern") &&
        this.config.lint.oxlint.ignorePatterns
      ) {
        args.push(
          `--ignore-pattern=${toArray(this.config.lint.oxlint.ignorePatterns).join(",")}`
        );
      }

      this.config.lint.oxlint.deny.forEach(d => args.push("-D", d));
      this.config.lint.oxlint.allow.forEach(a => args.push("-A", a));
      this.config.lint.oxlint.warn.forEach(w => args.push("-W", w));

      if (!args.includes("-c") && !args.includes("--config")) {
        let configFile = getParentPath(
          this.config.lint.oxlint.configFile,
          this.config.projectRoot,
          {
            ignoreCase: true,
            skipCwd: false,
            includeNameInResults: true
          }
        );
        if (
          configFile &&
          !existsSync(configFile) &&
          this.config.lint.oxlint.configFile !== ".oxlintrc.json"
        ) {
          configFile = getParentPath(
            ".oxlintrc.json",
            this.config.projectRoot,
            {
              ignoreCase: true,
              skipCwd: false,
              includeNameInResults: true
            }
          );
        }

        if (configFile && existsSync(configFile)) {
          args.push("-c", configFile);
        }
      }

      if (!args.includes("--type-aware") && this.config.lint.oxlint.typeAware) {
        args.push("--type-aware");
      }

      if (!args.includes("--tsconfig")) {
        args.push("--tsconfig", this.tsconfig.tsconfigFilePath);
      }

      if (!args.includes("-f") && !args.includes("--format")) {
        args.push("-f", this.config.lint.oxlint.format || "stylish");
      }

      if (
        this.config.lint.oxlint.fix !== false &&
        !args.includes("--fix") &&
        !args.includes("--fix-suggestions") &&
        !args.includes("--fix-dangerously")
      ) {
        if (this.config.lint.oxlint.fix === true) {
          args.push("--fix");
        } else if (this.config.lint.oxlint.fix === "suggestions") {
          args.push("--fix-suggestions");
        } else if (this.config.lint.oxlint.fix === "dangerously") {
          args.push("--fix-dangerously");
        }
      }

      if (!this.config.lint.oxlint.oxlintPath) {
        const isOxlintListed = await isPackageListed(
          "oxlint",
          this.config.projectRoot
        );

        args.unshift(
          isOxlintListed
            ? replacePath(this.config.sourceRoot, this.config.projectRoot)
            : this.config.sourceRoot
        );

        const result = await executePackage(
          "oxlint",
          args,
          isOxlintListed
            ? joinPaths(
                this.workspaceConfig.workspaceRoot,
                this.config.projectRoot
              )
            : this.workspaceConfig.workspaceRoot
        );
        if (result.failed) {
          throw new Error(
            `Oxlint process exited with code ${result.exitCode}.`
          );
        }
      } else {
        args.unshift(
          this.config.lint.oxlint.oxlintPath,
          this.config.sourceRoot
        );

        const result = await execute(
          args.join(" "),
          this.workspaceConfig.workspaceRoot
        );
        if (result.failed) {
          throw new Error(
            `Oxlint process exited with code ${result.exitCode}.`
          );
        }
      }
    }
  };
}

export default plugin;
