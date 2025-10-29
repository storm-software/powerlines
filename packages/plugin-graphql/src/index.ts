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

import {
  generate,
  loadContext,
  updateContextWithCliFlags
} from "@graphql-codegen/cli";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { findFileName } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import defu from "defu";
import { existsSync } from "node:fs";
import { Plugin } from "powerlines/types/plugin";
import {
  GraphQLPluginContext,
  GraphQLPluginOptions,
  GraphQLPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate GraphQL for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends GraphQLPluginContext = GraphQLPluginContext
>(
  options: GraphQLPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "graphql",
    config() {
      let configFile = options.configFile;
      if (!configFile) {
        if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "codegen.yml"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "codegen.yml"
          );
        } else if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "codegen.yaml"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "codegen.yaml"
          );
        } else if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "codegen.json"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "codegen.json"
          );
        } else if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "codegen.js"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "codegen.js"
          );
        } else if (
          existsSync(
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "codegen.cjs"
            )
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "codegen.cjs"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "codegen.yml")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "codegen.yml"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "codegen.yaml")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "codegen.yaml"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "codegen.json")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "codegen.json"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "codegen.js")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "codegen.js"
          );
        } else if (
          existsSync(
            joinPaths(this.workspaceConfig.workspaceRoot, "codegen.cjs")
          )
        ) {
          configFile = joinPaths(
            this.workspaceConfig.workspaceRoot,
            "codegen.cjs"
          );
        } else {
          throw new Error(
            `No GraphQL Codegen configuration file found. Please specify a valid config file path in the Biome plugin's \`configFile\` options.`
          );
        }
      }

      return {
        graphql: defu(options, {
          configFile,
          silent: this.config.logLevel === null,
          verbose:
            this.config.logLevel === LogLevelLabel.DEBUG ||
            this.config.logLevel === LogLevelLabel.TRACE,
          debug: this.config.mode === "development",
          generatedPath: joinPaths("{builtinPath}", "graphql")
        })
      } as Partial<GraphQLPluginUserConfig>;
    },
    async configResolved() {
      this.dependencies.graphql = "latest";

      this.config.graphql.generatedPath =
        this.config.graphql.generatedPath.replace(
          "{builtinPath}",
          this.builtinsPath
        );

      this.graphql ??= {} as GraphQLPluginContext["graphql"];

      this.graphql.codegen = await loadContext(this.config.graphql.configFile);
      updateContextWithCliFlags(this.graphql.codegen, {
        require: [],
        overwrite: true,
        project: this.config.projectRoot,
        ...this.config.graphql,
        config: this.config.graphql.configFile,
        watch: false
      });
    },
    async prepare() {
      const result = await generate(
        {
          ...this.graphql.codegen,
          cwd: joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot
          )
        } as Parameters<typeof generate>[0],
        false
      );

      if (isParentPath(this.config.graphql.generatedPath, this.builtinsPath)) {
        await Promise.all(
          result.map(async output =>
            this.writeBuiltin(
              output.content,
              findFileName(
                joinPaths(
                  replacePath(
                    this.config.graphql.generatedPath,
                    this.builtinsPath
                  ),
                  output.filename
                ),
                { withExtension: false }
              ),
              joinPaths(this.config.graphql.generatedPath, output.filename)
            )
          )
        );
      } else {
        await Promise.all(
          result.map(async output =>
            this.fs.writeFile(
              joinPaths(this.config.graphql.generatedPath, output.filename),
              output.content
            )
          )
        );
      }
    }
  };
};

export default plugin;
