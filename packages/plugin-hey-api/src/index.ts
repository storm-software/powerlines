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

import type { UserConfig } from "@hey-api/openapi-ts";
import { createClient, OpenApi } from "@hey-api/openapi-ts";
import { joinPaths } from "@stryke/path/join-paths";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import { replacePathTokens } from "powerlines/plugin-utils/paths";
import { Plugin } from "powerlines/types/plugin";
import { createOperationId } from "./helpers/create-operation-id";
import {
  HeyAPIPluginContext,
  HeyAPIPluginOptions,
  HeyAPIPluginOutputOptions,
  HeyAPIPluginUserConfig
} from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to integrate Hey API for code generation.
 *
 * @see https://heyapi.dev/
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends HeyAPIPluginContext = HeyAPIPluginContext
>(
  options: HeyAPIPluginOptions = {}
): Plugin<TContext> => {
  return {
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
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot,
              "schema.yaml"
            ),
            output: {
              path: joinPaths("{builtinPath}", "api")
            },
            logs: this.envPaths.log
          })
        }
      } as Partial<HeyAPIPluginUserConfig>;
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

      if (isSetString(this.config.heyApi.schema)) {
        const result = await this.fetch(this.config.heyApi.schema);
        this.config.heyApi.schema = (await result.json()) as OpenApi.V3_0_X;
      }

      if (
        isSetObject(this.config.heyApi.schema) &&
        (this.config.heyApi.schema as OpenApi.V3_0_X).paths
      ) {
        const schema = this.config.heyApi.schema as OpenApi.V3_0_X;
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
    },
    async prepare() {
      await createClient({
        ...this.config.heyApi,
        input: this.config.heyApi.schema!
      } as UserConfig);
    }
  };
};

export default plugin;
