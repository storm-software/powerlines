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

import type { Options as PowerPlantAsyncAPIOptions } from "@power-plant/asyncapi";
import asyncapiGenerator from "@power-plant/asyncapi";
import type { GeneratorConfigObject } from "@power-plant/core";
import powerPlant from "@powerlines/plugin-power-plant";
import { existsSync } from "@stryke/fs/exists";
import { isPackageExists } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join";
import defu from "defu";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import type {
  AsyncAPIPluginContext,
  AsyncAPIPluginOptions
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  interface Config {
    asyncapi?: AsyncAPIPluginOptions;
  }
}

function isLoadedDocument(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !(value instanceof URL);
}

/**
 * A Powerlines plugin to integrate AsyncAPI for code generation via Power Plant.
 *
 * @param options - The plugin options.
 * @returns Powerlines plugin instances.
 */
export const plugin = <
  TContext extends AsyncAPIPluginContext = AsyncAPIPluginContext
>(
  options: AsyncAPIPluginOptions
): Plugin<TContext>[] => {
  const generatorConfig = {
    ...(asyncapiGenerator as GeneratorConfigObject<
      Record<string, unknown>,
      PowerPlantAsyncAPIOptions
    >)
  } as GeneratorConfigObject<
    Record<string, unknown>,
    PowerPlantAsyncAPIOptions
  >;

  return [
    powerPlant<Record<string, unknown>, PowerPlantAsyncAPIOptions, TContext>(
      generatorConfig
    ),
    {
      name: "asyncapi",
      config() {
        return {
          asyncapi: defu(options, {
            schema: joinPaths(
              this.config.cwd ?? "./",
              this.config.root,
              "schema.yaml"
            ),
            output: "string",
            install: false,
            compile: false,
            debug:
              this.config.mode === "development" ||
              this.config.logLevel.general === "debug" ||
              this.config.logLevel.general === "trace",
            outputPath: joinPaths(this.builtinsPath, "asyncapi")
          })
        };
      },
      async configResolved() {
        if (!this.config.asyncapi.schema) {
          throw new Error(
            'AsyncAPI schema is required. Please specify it in the plugin options or your Powerlines configuration under "asyncapi.schema".'
          );
        }

        if (
          !this.config.asyncapi.document ||
          !isLoadedDocument(this.config.asyncapi.document)
        ) {
          if (isLoadedDocument(this.config.asyncapi.schema)) {
            this.config.asyncapi.document = this.config.asyncapi.schema;
          } else if (existsSync(this.config.asyncapi.schema.toString())) {
            const document = await this.fs.read(
              this.config.asyncapi.schema.toString()
            );
            if (!document) {
              throw new Error(
                `Failed to read AsyncAPI schema from file: ${this.config.asyncapi.schema.toString()}`
              );
            }

            this.config.asyncapi.document = document;
          } else {
            const document = await this.fetch(
              this.config.asyncapi.schema.toString()
            );
            if (!document) {
              throw new Error(
                `Failed to fetch AsyncAPI schema from endpoint: ${this.config.asyncapi.schema.toString()}`
              );
            }

            this.config.asyncapi.document = await document.text();
          }
        }

        if (!this.config.asyncapi.templateName) {
          throw new Error(
            'AsyncAPI template name is required. Please specify it in the plugin options or your Powerlines configuration under "asyncapi.templateName".'
          );
        }

        if (!this.config.asyncapi.outputPath) {
          throw new Error(
            'AsyncAPI output path is required. Please specify it in the plugin options or your Powerlines configuration under "asyncapi.outputPath".'
          );
        }

        if (
          !existsSync(this.config.asyncapi.templateName) &&
          !isPackageExists(this.config.asyncapi.templateName)
        ) {
          this.devDependencies[this.config.asyncapi.templateName] = "latest";
        }

        this.config.asyncapi.outputPath = replacePathTokens(
          this,
          this.config.asyncapi.outputPath
        );

        const {
          schema: _schema,
          document,
          templateName,
          outputPath,
          entrypoint,
          templateParams,
          noOverwriteGlobs,
          disabledHooks,
          registry,
          forceWrite,
          debug,
          compile,
          mapBaseUrlToFolder,
          ...rest
        } = this.config.asyncapi;

        this.config.powerplant = {
          ...generatorConfig,
          input: document
        };

        this.powerplant.options = {
          ...rest,
          templateName,
          outputPath,
          entrypoint,
          templateParams,
          noOverwriteGlobs,
          disabledHooks,
          registry,
          forceWrite,
          debug,
          compile,
          mapBaseUrlToFolder,
          output: "string",
          install: false
        } as TContext["powerplant"]["options"];
      }
    }
  ];
};

export default plugin;
