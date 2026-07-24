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

import { OpenApi } from "@hey-api/openapi-ts";
import type { GeneratorConfigObject } from "@power-plant/core";
import heyApiGenerator from "@power-plant/hey-api";
import powerPlant from "@powerlines/plugin-power-plant";
import { joinPaths } from "@stryke/path/join-paths";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import { createOperationId } from "./helpers/create-operation-id";
import type {
  HeyAPIPluginContext,
  HeyAPIPluginOptions,
  HeyAPIPluginOutputOptions,
  PowerPlantHeyAPIOptions
} from "./types/plugin";

export * from "./helpers";
export * from "./types";

declare module "powerlines" {
  interface Config {
    heyApi?: HeyAPIPluginOptions;
  }
}

function isLoadedDocument(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !(value instanceof URL);
}

/**
 * A Powerlines plugin to integrate Hey API for code generation via Power Plant.
 *
 * @see https://heyapi.dev/
 *
 * @param options - The plugin options.
 * @returns Powerlines plugin instances.
 */
export const plugin = <
  TContext extends HeyAPIPluginContext = HeyAPIPluginContext
>(
  options: HeyAPIPluginOptions = {}
): Plugin<TContext>[] => {
  const generatorConfig = {
    ...(heyApiGenerator as GeneratorConfigObject<
      Record<string, unknown>,
      PowerPlantHeyAPIOptions
    >)
  } as GeneratorConfigObject<Record<string, unknown>, PowerPlantHeyAPIOptions>;

  return [
    powerPlant<Record<string, unknown>, PowerPlantHeyAPIOptions, TContext>(
      generatorConfig
    ),
    {
      name: "hey-api",
      config() {
        return {
          heyApi: {
            plugins: [
              {
                name: "@hey-api/typescript",
                exportFromIndex: false
              },
              {
                name: "@hey-api/sdk",
                instance: "PrismaClient",
                exportFromIndex: false,
                auth: false
              },
              {
                name: "@hey-api/client-fetch",
                throwOnError: true
              }
            ],
            ...defu(options, {
              schema: joinPaths(
                this.config.cwd ?? "./",
                this.config.root,
                "schema.yaml"
              ),
              output: {
                path: joinPaths("{builtinPath}", "api")
              },
              logs: this.envPaths.log
            })
          }
        };
      },
      async configResolved() {
        this.config.heyApi.output ??= {} as HeyAPIPluginOutputOptions;
        this.config.heyApi.output.path = replacePathTokens(
          this,
          this.config.heyApi.output.path
        );

        if (!this.config.heyApi.schema) {
          throw new Error(
            "The `schema` option is required by the Hey API plugin."
          );
        }

        let document: Record<string, unknown> | undefined;

        if (isLoadedDocument(this.config.heyApi.schema)) {
          document = this.config.heyApi.schema;
        } else if (isSetString(this.config.heyApi.schema)) {
          const result = await this.fetch(this.config.heyApi.schema);
          document = (await result.json()) as Record<string, unknown>;
        }

        if (!document) {
          throw new Error(
            "Failed to resolve Hey API schema. Provide a loaded OpenAPI document or a fetchable schema URL."
          );
        }

        if (
          isSetObject(document) &&
          (document as unknown as OpenApi.V3_0_X).paths
        ) {
          const schema = document as unknown as OpenApi.V3_0_X;
          for (const pathItem of Object.values(schema.paths)) {
            if (!pathItem || "$ref" in pathItem) {
              continue;
            }

            for (const method of [
              "get",
              "put",
              "post",
              "delete",
              "options",
              "head",
              "patch",
              "trace"
            ] as const) {
              const operation = pathItem[method];
              if (!isSetString(operation?.summary)) {
                continue;
              }

              operation.operationId = createOperationId(operation.summary);
            }
          }
        }

        this.config.heyApi.schema = document;

        const { schema: _schema, output, ...rest } = this.config.heyApi;

        this.config.powerplant = {
          ...generatorConfig,
          input: document
        };

        this.powerplant.options = {
          ...rest,
          output
        } as TContext["powerplant"]["options"];
      }
    }
  ];
};

export default plugin;
