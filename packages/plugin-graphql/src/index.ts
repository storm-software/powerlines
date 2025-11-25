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
import { getConfigPath } from "powerlines/plugin-utils/get-config-path";
import { replacePathTokens } from "powerlines/plugin-utils/paths";
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
        configFile = getConfigPath(this, "codegen");
        if (!configFile) {
          configFile = getConfigPath(this, "graphql-codegen");
          if (!configFile) {
            throw new Error(
              `No GraphQL Codegen configuration file found. Please specify a valid config file path in the Biome plugin's \`configFile\` options.`
            );
          }
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
          outputPath: joinPaths("{builtinPath}", "graphql")
        })
      } as Partial<GraphQLPluginUserConfig>;
    },
    async configResolved() {
      this.dependencies.graphql = "latest";

      this.config.graphql.outputPath = replacePathTokens(
        this,
        this.config.graphql.outputPath
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

      if (isParentPath(this.config.graphql.outputPath, this.builtinsPath)) {
        await Promise.all(
          result.map(async output =>
            this.emitBuiltin(
              output.content,
              findFileName(
                joinPaths(
                  replacePath(
                    this.config.graphql.outputPath,
                    this.builtinsPath
                  ),
                  output.filename
                ),
                { withExtension: false }
              ),
              joinPaths(this.config.graphql.outputPath, output.filename)
            )
          )
        );
      } else {
        await Promise.all(
          result.map(async output =>
            this.fs.write(
              joinPaths(this.config.graphql.outputPath, output.filename),
              output.content
            )
          )
        );
      }
    }
  };
};

export default plugin;
