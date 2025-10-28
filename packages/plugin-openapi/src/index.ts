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

import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import openapiTS, { astToString } from "openapi-typescript";
import { Plugin } from "powerlines/types/plugin";
import {
  OpenAPIPluginContext,
  OpenAPIPluginOptions,
  OpenAPIPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate OpenAPI for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends OpenAPIPluginContext = OpenAPIPluginContext
>(
  options: OpenAPIPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "openapi",
    config() {
      return {
        openapi: defu(options, {
          schema: joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "schema.yaml"
          ),
          cwd: joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot
          ),
          silent: this.config.logLevel === null
        })
      } as Partial<OpenAPIPluginUserConfig>;
    },
    async prepare() {
      const ast = await openapiTS(
        this.config.openapi.schema,
        this.config.openapi
      );

      if (this.config.openapi.generatedPath) {
        await this.fs.writeFile(
          this.config.openapi.generatedPath,
          astToString(ast, {
            fileName: this.config.openapi.generatedPath
          })
        );
      } else {
        await this.writeBuiltin(astToString(ast), "openapi");
      }
    }
  };
};

export default plugin;
