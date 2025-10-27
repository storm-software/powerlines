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
import { execute, executePackage } from "@stryke/cli/execute";
import { existsSync } from "@stryke/fs/exists";
import { isPackageListed } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { Plugin } from "powerlines/types/plugin";
import { BiomePluginContext, BiomePluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to assist in linting a project with Biome.
 */
export function plugin(
  options: BiomePluginOptions = {}
): Plugin<BiomePluginContext> {
  return {
    name: "biome",
    async config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `biome` linting plugin."
      );

      let configFile = options.configFile;
      if (!configFile) {
        if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "biome.json"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "biome.json"
          );
        } else if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "biome.jsonc"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "biome.jsonc"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "biome.json")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "biome.json"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "biome.jsonc")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "biome.jsonc"
          );
        } else {
          throw new Error(
            `No Biome configuration file found. Please specify a valid config file path in the Biome plugin's \`configFile\` options.`
          );
        }
      }

      return {
        lint: {
          biome: {
            configFile,
            maxDiagnostics: 20,
            diagnosticLevel: "info",
            fix: true,
            logKind: "pretty",
            format: "stylish",
            vcsEnabled: true,
            vcsDefaultBranch: this.workspaceConfig.branch || "main",
            ...options
          }
        }
      };
    },
    async lint() {
      this.log(LogLevelLabel.TRACE, `Linting project files with Biome.`);

      const args: string[] = [];

      if (this.config.lint.biome.params) {
        args.push(...this.config.lint.biome.params.split(" ").filter(Boolean));
      }

      if (!args.includes("--log-level")) {
        args.push(
          "--log-level",
          !this.config.logLevel ||
            this.config.logLevel === "trace" ||
            this.config.logLevel === "debug"
            ? "info"
            : this.config.logLevel
        );
      }

      if (
        !args.includes("--verbose") &&
        (this.config.logLevel === "trace" ||
          this.config.logLevel === "debug" ||
          this.config.mode === "development")
      ) {
        args.push("--verbose");
      }

      if (this.config.lint.biome.fix !== false && !args.includes("--fix")) {
        args.push("--fix");
        if (
          this.config.lint.biome.fix === "unsafe" &&
          !args.includes("--unsafe")
        ) {
          args.push("--unsafe");
        }
      }

      if (
        this.config.lint.biome.configFile &&
        !args.includes("--config-path")
      ) {
        args.push("--config-path", this.config.lint.biome.configFile);
      }

      if (this.config.lint.biome.changed && !args.includes("--changed")) {
        args.push("--changed");
      }

      if (this.config.lint.biome.staged && !args.includes("--staged")) {
        args.push("--staged");
      }

      if (this.config.lint.biome.ignorePatterns && !args.includes("--ignore")) {
        args.push(
          "--ignore",
          Array.isArray(this.config.lint.biome.ignorePatterns)
            ? this.config.lint.biome.ignorePatterns.join(",")
            : this.config.lint.biome.ignorePatterns
        );
      }

      if (this.config.lint.biome.suppress && !args.includes("--suppress")) {
        args.push("--suppress");
      }

      if (this.config.lint.biome.only && !args.includes("--only")) {
        args.push(
          "--only",
          Array.isArray(this.config.lint.biome.only)
            ? this.config.lint.biome.only.join(",")
            : this.config.lint.biome.only
        );
      }

      if (this.config.lint.biome.skip && !args.includes("--skip")) {
        args.push(
          "--skip",
          Array.isArray(this.config.lint.biome.skip)
            ? this.config.lint.biome.skip.join(",")
            : this.config.lint.biome.skip
        );
      }

      if (
        this.config.lint.biome.stdinFilePath &&
        !args.includes("--stdin-file-path")
      ) {
        args.push("--stdin-file-path", this.config.lint.biome.stdinFilePath);
      }

      if (
        this.config.lint.biome.maxDiagnostics !== undefined &&
        !args.includes("--max-diagnostics")
      ) {
        args.push(
          "--max-diagnostics",
          this.config.lint.biome.maxDiagnostics.toString()
        );
      }

      if (
        this.config.lint.biome.diagnosticLevel &&
        !args.includes("--diagnostic-level")
      ) {
        args.push("--diagnostic-level", this.config.lint.biome.diagnosticLevel);
      }

      if (
        this.config.lint.biome.errorOnWarnings &&
        !args.includes("--error-on-warnings")
      ) {
        args.push("--error-on-warnings");
      }

      if (
        this.config.lint.biome.jsonParseAllowComments &&
        !args.includes("--json-parse-allow-comments")
      ) {
        args.push("--json-parse-allow-comments");
      }

      if (
        this.config.lint.biome.jsonParseAllowTrailingCommas &&
        !args.includes("--json-parse-allow-trailing-commas")
      ) {
        args.push("--json-parse-allow-trailing-commas");
      }

      if (this.config.lint.biome.reporter && !args.includes("--reporter")) {
        args.push("--reporter", this.config.lint.biome.reporter);
      }

      if (this.config.lint.biome.logKind && !args.includes("--log-kind")) {
        args.push("--log-kind", this.config.lint.biome.logKind);
      }

      if (
        this.config.lint.biome.filesMaxSize &&
        !args.includes("--files-max-size")
      ) {
        args.push(
          "--files-max-size",
          this.config.lint.biome.filesMaxSize.toString()
        );
      }

      if (
        this.config.lint.biome.filesIgnoreUnknown &&
        !args.includes("--files-ignore-unknown")
      ) {
        args.push("--files-ignore-unknown");
      }

      if (
        this.config.lint.biome.vcsEnabled &&
        !args.includes("--vcs-enabled")
      ) {
        args.push("--vcs-enabled");

        if (!args.includes("--vcs-root")) {
          args.push("--vcs-root", this.workspaceConfig.workspaceRoot);
        }

        if (
          this.config.lint.biome.vcsClientKind &&
          !args.includes("--vcs-client-kind")
        ) {
          args.push("--vcs-client-kind", this.config.lint.biome.vcsClientKind);
        }

        if (
          this.config.lint.biome.vcsUseIgnoreFile &&
          !args.includes("--vcs-use-ignore-file")
        ) {
          args.push("--vcs-use-ignore-file");
        }

        if (
          this.config.lint.biome.vcsDefaultBranch &&
          !args.includes("--vcs-default-branch")
        ) {
          args.push(
            "--vcs-default-branch",
            this.config.lint.biome.vcsDefaultBranch
          );
        }
      }

      if (!this.config.lint.biome.biomePath) {
        const isBiomeListed = await isPackageListed(
          "@biomejs/biome",
          this.config.projectRoot
        );

        args.unshift(
          isBiomeListed
            ? replacePath(this.config.sourceRoot, this.config.projectRoot)
            : this.config.sourceRoot
        );

        const result = await executePackage(
          "biome",
          args,
          isBiomeListed
            ? joinPaths(
                this.workspaceConfig.workspaceRoot,
                this.config.projectRoot
              )
            : this.workspaceConfig.workspaceRoot
        );
        if (result.failed) {
          throw new Error(`Biome process exited with code ${result.exitCode}.`);
        }
      } else {
        args.unshift(this.config.lint.biome.biomePath, this.config.sourceRoot);

        const result = await execute(
          args.join(" "),
          this.workspaceConfig.workspaceRoot
        );
        if (result.failed) {
          throw new Error(`Biome process exited with code ${result.exitCode}.`);
        }
      }
    }
  };
}

export default plugin;
