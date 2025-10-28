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

import { Generator } from "@asyncapi/generator";
import { isAsyncAPIDocument } from "@asyncapi/parser/esm/document";
import { bufferToString } from "@stryke/convert/buffer-to-string";
import { existsSync } from "@stryke/fs/exists";
import { isPackageExists } from "@stryke/fs/package-fns";
import { fetchRequest } from "@stryke/http/fetch";
import { joinPaths } from "@stryke/path/join";
import defu from "defu";
import { Plugin } from "powerlines/types/plugin";
import {
  AsyncAPIPluginContext,
  AsyncAPIPluginOptions,
  AsyncAPIPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate Open-API for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends AsyncAPIPluginContext = AsyncAPIPluginContext
>(
  options: AsyncAPIPluginOptions
): Plugin<TContext> => {
  return {
    name: "asyncapi",
    config() {
      return {
        asyncapi: defu(options, {
          schema: joinPaths(
            this.workspaceConfig.workspaceRoot,
            this.config.projectRoot,
            "schema.yaml"
          ),
          output: "string",
          install: false,
          compile: false,
          debug:
            this.config.mode === "development" ||
            this.config.logLevel === "debug" ||
            this.config.logLevel === "trace",
          targetDir: joinPaths(this.builtinsPath, "asyncapi")
        })
      } as Partial<AsyncAPIPluginUserConfig>;
    },
    async configResolved() {
      if (!this.config.asyncapi.schema) {
        throw new Error(
          'AsyncAPI schema is required. Please specify it in the plugin options or your Powerlines configuration under "asyncapi.schema".'
        );
      }

      if (
        !this.config.asyncapi.document ||
        !isAsyncAPIDocument(this.config.asyncapi.document)
      ) {
        if (isAsyncAPIDocument(this.config.asyncapi.schema)) {
          this.config.asyncapi.document = this.config.asyncapi.schema;
        } else if (existsSync(this.config.asyncapi.schema.toString())) {
          const document = await this.fs.readFile(
            this.config.asyncapi.schema.toString()
          );
          if (!document) {
            throw new Error(
              `Failed to read AsyncAPI schema from file: ${this.config.asyncapi.schema.toString()}`
            );
          }

          this.config.asyncapi.document = document;
        } else {
          const document = await fetchRequest(
            this.config.asyncapi.schema.toString()
          );
          if (!document) {
            throw new Error(
              `Failed to fetch AsyncAPI schema from endpoint: ${this.config.asyncapi.schema.toString()}`
            );
          }

          this.config.asyncapi.document = bufferToString(document);
        }
      }

      if (!this.config.asyncapi.templateName) {
        throw new Error(
          'AsyncAPI template name is required. Please specify it in the plugin options or your Powerlines configuration under "asyncapi.templateName".'
        );
      }

      if (!this.config.asyncapi.targetDir) {
        throw new Error(
          'AsyncAPI target directory is required. Please specify it in the plugin options or your Powerlines configuration under "asyncapi.targetDir".'
        );
      }

      if (
        !existsSync(this.config.asyncapi.templateName) &&
        !isPackageExists(this.config.asyncapi.templateName)
      ) {
        this.devDependencies[this.config.asyncapi.templateName] = "latest";
      }

      this.config.asyncapi.targetDir = this.config.asyncapi.targetDir.replace(
        "{builtinPath}",
        this.builtinsPath
      );
    },
    async prepare() {
      const generator = new Generator(
        this.config.asyncapi.templateName,
        this.config.asyncapi.targetDir,
        this.config.asyncapi
      );

      await generator.generate(this.config.asyncapi.document);
    }
  };
};

export default plugin;
