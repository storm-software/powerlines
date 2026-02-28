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
import { existsSync } from "@stryke/fs/exists";
import { isPackageListed } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join";
import { Plugin } from "powerlines";
import {
  BiomePluginContext,
  BiomePluginOptions,
  BiomePluginUserConfig
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    biome?: BiomePluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in linting a project with Biome.
 */
export function plugin(
  options: BiomePluginOptions = {}
): Plugin<BiomePluginContext> {
  return {
    name: "biome",
    async config() {
      this.debug(
        "Providing default configuration for the Powerlines `biome` linting plugin."
      );

      let configFile = options.configFile;
      if (!configFile) {
        if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.root,
              "biome.json"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.root,
            "biome.json"
          );
        } else if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.root,
              "biome.jsonc"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.root,
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
      } as BiomePluginUserConfig;
    },
    async lint() {
      this.debug(`Linting project files with Biome.`);

      const args: string[] = [];

      if (this.config.biome.params) {
        args.push(...this.config.biome.params.split(" ").filter(Boolean));
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

      if (this.config.biome.fix !== false && !args.includes("--fix")) {
        args.push("--fix");
        if (this.config.biome.fix === "unsafe" && !args.includes("--unsafe")) {
          args.push("--unsafe");
        }
      }

      if (this.config.biome.configFile && !args.includes("--config-path")) {
        args.push("--config-path", this.config.biome.configFile);
      }

      if (this.config.biome.changed && !args.includes("--changed")) {
        args.push("--changed");
      }

      if (this.config.biome.staged && !args.includes("--staged")) {
        args.push("--staged");
      }

      if (this.config.biome.ignorePatterns && !args.includes("--ignore")) {
        args.push(
          "--ignore",
          Array.isArray(this.config.biome.ignorePatterns)
            ? this.config.biome.ignorePatterns.join(",")
            : this.config.biome.ignorePatterns
        );
      }

      if (this.config.biome.suppress && !args.includes("--suppress")) {
        args.push("--suppress");
      }

      if (this.config.biome.only && !args.includes("--only")) {
        args.push(
          "--only",
          Array.isArray(this.config.biome.only)
            ? this.config.biome.only.join(",")
            : this.config.biome.only
        );
      }

      if (this.config.biome.skip && !args.includes("--skip")) {
        args.push(
          "--skip",
          Array.isArray(this.config.biome.skip)
            ? this.config.biome.skip.join(",")
            : this.config.biome.skip
        );
      }

      if (
        this.config.biome.stdinFilePath &&
        !args.includes("--stdin-file-path")
      ) {
        args.push("--stdin-file-path", this.config.biome.stdinFilePath);
      }

      if (
        this.config.biome.maxDiagnostics !== undefined &&
        !args.includes("--max-diagnostics")
      ) {
        args.push(
          "--max-diagnostics",
          this.config.biome.maxDiagnostics.toString()
        );
      }

      if (
        this.config.biome.diagnosticLevel &&
        !args.includes("--diagnostic-level")
      ) {
        args.push("--diagnostic-level", this.config.biome.diagnosticLevel);
      }

      if (
        this.config.biome.errorOnWarnings &&
        !args.includes("--error-on-warnings")
      ) {
        args.push("--error-on-warnings");
      }

      if (
        this.config.biome.jsonParseAllowComments &&
        !args.includes("--json-parse-allow-comments")
      ) {
        args.push("--json-parse-allow-comments");
      }

      if (
        this.config.biome.jsonParseAllowTrailingCommas &&
        !args.includes("--json-parse-allow-trailing-commas")
      ) {
        args.push("--json-parse-allow-trailing-commas");
      }

      if (this.config.biome.reporter && !args.includes("--reporter")) {
        args.push("--reporter", this.config.biome.reporter);
      }

      if (this.config.biome.logKind && !args.includes("--log-kind")) {
        args.push("--log-kind", this.config.biome.logKind);
      }

      if (
        this.config.biome.filesMaxSize &&
        !args.includes("--files-max-size")
      ) {
        args.push(
          "--files-max-size",
          this.config.biome.filesMaxSize.toString()
        );
      }

      if (
        this.config.biome.filesIgnoreUnknown &&
        !args.includes("--files-ignore-unknown")
      ) {
        args.push("--files-ignore-unknown");
      }

      if (this.config.biome.vcsEnabled && !args.includes("--vcs-enabled")) {
        args.push("--vcs-enabled");

        if (!args.includes("--vcs-root")) {
          args.push("--vcs-root", this.workspaceConfig.workspaceRoot);
        }

        if (
          this.config.biome.vcsClientKind &&
          !args.includes("--vcs-client-kind")
        ) {
          args.push("--vcs-client-kind", this.config.biome.vcsClientKind);
        }

        if (
          this.config.biome.vcsUseIgnoreFile &&
          !args.includes("--vcs-use-ignore-file")
        ) {
          args.push("--vcs-use-ignore-file");
        }

        if (
          this.config.biome.vcsDefaultBranch &&
          !args.includes("--vcs-default-branch")
        ) {
          args.push("--vcs-default-branch", this.config.biome.vcsDefaultBranch);
        }
      }

      if (!this.config.biome.biomePath) {
        const isBiomeListed = await isPackageListed(
          "@biomejs/biome",
          this.config.root
        );

        args.unshift(isBiomeListed ? "./" : joinPaths(this.config.root, "src"));

        const result = await executePackage(
          "biome",
          args,
          isBiomeListed
            ? joinPaths(this.workspaceConfig.workspaceRoot, this.config.root)
            : this.config.root
        );
        if (result.failed) {
          throw new Error(`Biome process exited with code ${result.exitCode}.`);
        }
      } else {
        args.unshift(
          this.config.biome.biomePath,
          joinPaths(this.config.root, "src")
        );

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
