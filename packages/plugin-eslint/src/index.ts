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
import { existsSync } from "@stryke/fs/exists";
import { getParentPath } from "@stryke/fs/get-parent-path";
import { isPackageExists } from "@stryke/fs/package-fns";
import { readFile } from "@stryke/fs/read-file";
import { parseVersion } from "@stryke/fs/semver-fns";
import { writeFile } from "@stryke/fs/write-file";
import { findFileName } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join-paths";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { defu } from "defu";
import type { ESLint as FlatESLint } from "eslint";
import type { LegacyESLint } from "eslint/use-at-your-own-risk";
import { Plugin } from "powerlines/types/plugin";
import { formatMessage } from "./helpers/format-message";
import { ESLintPluginContext, ESLintPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in generating documentation with TypeDoc.
 */
export function plugin(
  options: ESLintPluginOptions = {}
): Plugin<ESLintPluginContext> {
  return {
    name: "eslint",
    async config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `eslint` build plugin."
      );

      const configFile = getParentPath(
        [
          "eslint.config.js",
          "eslint.config.mjs",
          "eslint.config.cjs",
          "eslint.config.ts",
          "eslint.config.mts",
          "eslint.config.cts",
          ".eslintrc.js",
          ".eslintrc.cjs",
          ".eslintrc.yaml",
          ".eslintrc.yml",
          ".eslintrc.json",
          ".eslintrc"
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
          eslint: defu(options, {
            configFile,
            reportErrorsOnly: false,
            maxWarnings: 5,
            fix: true,
            outputFile: null,
            type: "recommended"
          })
        }
      };
    },
    async configResolved() {
      let generateReason: string | undefined;
      if (
        !isSetObject(this.packageJson.eslintConfig) &&
        (!this.config.lint.eslint.configFile ||
          !existsSync(this.config.lint.eslint.configFile))
      ) {
        generateReason = "No ESLint configuration file found";
      } else if (
        this.config.lint.eslint.configFile &&
        existsSync(this.config.lint.eslint.configFile)
      ) {
        const content = await readFile(this.config.lint.eslint.configFile);
        if (
          content?.trim().replace(/\s/g, "") ||
          content?.trim().replace(/\s/g, "") === "---" ||
          content?.trim().replace(/\s/g, "") === "{}" ||
          content?.trim().replace(/\s/g, "") === "module.exports={}"
        ) {
          generateReason = `The ESLint configuration file at "${this.config.lint.eslint.configFile}" is empty`;
        }
      }

      const isInstalled = isPackageExists("eslint", {
        paths: [this.workspaceConfig.workspaceRoot, this.config.projectRoot]
      });
      if (!isInstalled) {
        throw new Error(
          `ESLint must be installed to use the Powerlines ESLint plugin. Please run: npm install --save-dev eslint`
        );
      }

      if (generateReason) {
        this.log(
          LogLevelLabel.WARN,
          `${generateReason}. Generating a default configuration at the project root.`
        );

        this.devDependencies["eslint-config-powerlines"] = "*";
        this.config.lint.eslint.configFile = joinPaths(
          this.config.projectRoot,
          "eslint.config.js"
        );

        await writeFile(
          this.config.lint.eslint.configFile,
          `import { defineConfig } from "eslint-config-powerlines";

Error.stackTraceLimit = Number.POSITIVE_INFINITY;

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig({${
            this.config.name
              ? `
  name: "${this.config.name}", `
              : ""
          }
  powerlines: ${this.config.lint.eslint.type}
});

`
        );
      }

      const module = await this.resolver.import<typeof import("eslint")>(
        this.resolver.esmResolve("eslint")
      );

      const useFlatConfig = this.config.lint.eslint.configFile
        ? findFileName(this.config.lint.eslint.configFile).startsWith(
            "eslint.config."
          )
        : true;

      let ESLint!: typeof FlatESLint | typeof LegacyESLint;
      // loadESLint is >= 8.57.0
      // PR https://github.com/eslint/eslint/pull/18098
      // Release https://github.com/eslint/eslint/releases/tag/v8.57.0
      if ("loadESLint" in module) {
        // By default, configType is `flat`. If `useFlatConfig` is false, the return value is `LegacyESLint`.
        // https://github.com/eslint/eslint/blob/1def4cdfab1f067c5089df8b36242cdf912b0eb6/lib/types/index.d.ts#L1609-L1613
        ESLint = await module.loadESLint({
          useFlatConfig
        });
      }

      const eslintVersion = parseVersion(ESLint?.version);
      if (!eslintVersion || eslintVersion.compare("8.57.0") < 0) {
        throw new Error(
          `Error - Your project has an older version of ESLint installed${
            eslintVersion
              ? ` (${eslintVersion.major}.${eslintVersion.minor}.${eslintVersion.patch})`
              : ""
          }. Please upgrade to ESLint version 8.57.0 or above`
        );
      }

      const options: any = {
        useEslintrc: !useFlatConfig,
        baseConfig: {},
        errorOnUnmatchedPattern: false,
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        cache: true
      };

      if (eslintVersion?.compare("9.0.0") && useFlatConfig) {
        for (const option of [
          "useEslintrc",
          "extensions",
          "ignorePath",
          "reportUnusedDisableDirectives",
          "resolvePluginsRelativeTo",
          "rulePaths",
          "inlineConfig",
          "maxWarnings"
        ]) {
          if (option in options) {
            delete options[option];
          }
        }
      }

      this.eslint = new ESLint(options);
    },
    async lint() {
      this.log(LogLevelLabel.TRACE, `Linting project files with ESLint.`);

      let results = await this.eslint.lintFiles(
        this.tsconfig.fileNames.filter(
          fileName =>
            !fileName.includes(this.artifactsPath) &&
            !fileName.includes("node_modules")
        )
      );

      const module = await this.resolver.import<typeof import("eslint")>(
        this.resolver.esmResolve("eslint")
      );

      let ESLint!: typeof FlatESLint | typeof LegacyESLint;
      // loadESLint is >= 8.57.0
      // PR https://github.com/eslint/eslint/pull/18098
      // Release https://github.com/eslint/eslint/releases/tag/v8.57.0
      if ("loadESLint" in module) {
        // By default, configType is `flat`. If `useFlatConfig` is false, the return value is `LegacyESLint`.
        // https://github.com/eslint/eslint/blob/1def4cdfab1f067c5089df8b36242cdf912b0eb6/lib/types/index.d.ts#L1609-L1613
        ESLint = await module.loadESLint({
          useFlatConfig: this.config.lint.eslint.configFile
            ? findFileName(this.config.lint.eslint.configFile).startsWith(
                "eslint.config."
              )
            : true
        });
      }

      if (this.config.lint.eslint.fix) {
        await ESLint.outputFixes(results);
      }

      if (this.config.lint.eslint.reportErrorsOnly) {
        results = ESLint.getErrorResults(results);
      }

      const resultsWithMessages = results.filter(
        ({ messages }) => messages?.length
      );

      const output = resultsWithMessages
        .map(({ messages, filePath }) =>
          formatMessage(this.config.projectRoot, messages, filePath)
        )
        .join("\n");

      if (this.config.lint.eslint.outputFile) {
        await writeFile(this.config.lint.eslint.outputFile, output);
      } else {
        this.log(LogLevelLabel.INFO, output);
      }
    }
  };
}

export default plugin;
