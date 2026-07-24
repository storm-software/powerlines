/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { OpenAPISchema } from "@power-plant/openapi-schema";
import type { Options as PowerPlantOpenAPITypeScriptOptions } from "@power-plant/openapi-typescript";
import openapiTypeScriptGenerator from "@power-plant/openapi-typescript";
import powerPlant from "@powerlines/plugin-power-plant";
import { existsSync } from "@stryke/fs/exists";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import { parse as parseYaml } from "yaml";
import type {
  OpenAPIPluginContext,
  OpenAPIPluginOptions
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  interface Config {
    openapi?: OpenAPIPluginOptions;
  }
}

function isLoadedDocument(value: unknown): value is OpenAPISchema {
  return typeof value === "object" && value !== null && !(value instanceof URL);
}

function parseOpenAPISchema(content: string): OpenAPISchema {
  return parseYaml(content) as OpenAPISchema;
}

/**
 * A Powerlines plugin to integrate OpenAPI TypeScript via Power Plant.
 *
 * @see https://openapi-ts.dev
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/openapi-typescript
 *
 * @param options - The plugin options.
 * @returns Powerlines plugin instances.
 */
export const plugin = <
  TContext extends OpenAPIPluginContext = OpenAPIPluginContext
>(
  options: OpenAPIPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    powerPlant<OpenAPISchema, PowerPlantOpenAPITypeScriptOptions, TContext>(
      openapiTypeScriptGenerator
    ),
    {
      name: "openapi",
      config() {
        return {
          openapi: defu(options, {
            schema: joinPaths(
              this.config.cwd ?? "./",
              this.config.root,
              "schema.yaml"
            ),
            outputPath: joinPaths("{builtinPath}", "api.ts"),
            silent: this.config.logLevel === null
          })
        };
      },
      async configResolved() {
        if (!this.config.openapi.schema) {
          throw new Error(
            'OpenAPI schema is required. Please specify it in the plugin options or your Powerlines configuration under "openapi.schema".'
          );
        }

        let document: OpenAPISchema | undefined;

        if (isLoadedDocument(this.config.openapi.schema)) {
          document = this.config.openapi.schema;
        } else {
          const schemaRef = (
            this.config.openapi.schema as URL | string
          ).toString();

          if (existsSync(schemaRef)) {
            const content = await this.fs.read(schemaRef);
            if (!content) {
              throw new Error(
                `Failed to read OpenAPI schema from file: ${schemaRef}`
              );
            }

            document = parseOpenAPISchema(content);
          } else {
            const response = await this.fetch(schemaRef);
            if (!response) {
              throw new Error(
                `Failed to fetch OpenAPI schema from endpoint: ${schemaRef}`
              );
            }

            document = parseOpenAPISchema(await response.text());
          }
        }

        if (!document) {
          throw new Error(
            "Failed to resolve OpenAPI schema. Provide a loaded OpenAPI document, a local file path, or a fetchable schema URL."
          );
        }

        this.config.openapi.outputPath = replacePathTokens(
          this,
          this.config.openapi.outputPath
        );
        this.config.openapi.document = document;

        const {
          schema: _schema,
          document: loadedDocument,
          outputPath,
          ...rest
        } = this.config.openapi;

        this.config.powerplant = {
          ...generatorConfig,
          input: loadedDocument
        };

        this.powerplant.options = {
          ...rest,
          output: outputPath
        } as TContext["powerplant"]["options"];
      }
    }
  ];
};

export default plugin;
