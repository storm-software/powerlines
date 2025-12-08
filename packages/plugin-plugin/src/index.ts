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

import alloyPlugin from "@alloy-js/rollup-plugin";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { StormJSON } from "@stryke/json/storm-json";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { TypeDefinition } from "@stryke/types/configuration";
import { defu } from "defu";
import { extractTsdownConfig } from "powerlines/lib/build/tsdown";
import { createUnplugin } from "powerlines/lib/unplugin";
import { Plugin } from "powerlines/types/plugin";
import { build } from "tsdown";
import { createRolldownPlugin } from "unplugin";
import { PluginPluginContext, PluginPluginOptions } from "./types/plugin";

export * from "./types";

function createPlugin<
  TContext extends PluginPluginContext = PluginPluginContext
>(context: TContext) {
  return createRolldownPlugin(createUnplugin(context))({});
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends PluginPluginContext = PluginPluginContext
>(
  options: PluginPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "plugin",
    config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines plugin."
      );

      return {
        type: "library",
        entry: options.alloy ? ["src/index.tsx"] : ["src/index.ts"],
        output: {
          format: ["cjs", "esm"]
        },
        build: {
          variant: "tsdown",
          platform: "node",
          unbundle: true,
          export: {
            all: true
          },
          skipNodeModulesBundle: true
        }
      };
    },
    async configResolved() {
      this.log(
        LogLevelLabel.TRACE,
        "The Powerlines plugin has resolved the final configuration."
      );

      if (options.alloy) {
        if (this.tsconfig.tsconfigJson.compilerOptions!.jsx !== "preserve") {
          this.tsconfig.tsconfigJson.compilerOptions!.jsx = "preserve";
        }

        await this.fs.write(
          this.tsconfig.tsconfigFilePath,
          StormJSON.stringify(this.tsconfig.tsconfigJson)
        );
      }
    },
    async types(code: string) {
      if (!options.types?.userConfig || !this.packageJson?.name) {
        return;
      }

      let typeDef: TypeDefinition | undefined;
      if (
        isSetString(options.types.userConfig) &&
        !options.types.userConfig.includes("#")
      ) {
        typeDef = {
          file: this.packageJson.name,
          name: options.types.userConfig
        };
      } else {
        typeDef = parseTypeDefinition(options.types.userConfig);
        if (!typeDef) {
          return;
        }

        if (!toArray(this.config.entry).includes(typeDef.file)) {
          this.log(
            LogLevelLabel.WARN,
            `The specified user configuration file "${
              typeDef.file
            }" is not included in the build entry points.`
          );
        }

        typeDef.file = `${this.packageJson.name}/${typeDef.file.replace(
          /^\.\//,
          ""
        )}`;
      }

      return `${code || ""}

// Extend \`UserConfig\` with the ${titleCase(this.config.name)} plugin's type definition
declare module "powerlines" {
  export interface UserConfig extends import("${
    typeDef.file
  }").${typeDef.name || "default"}
}
`.trim();
    },
    async build() {
      await build(
        defu(
          {
            config: false,
            plugins: [
              createPlugin<TContext>(this),
              options.alloy && alloyPlugin()
            ].filter(Boolean)
          },
          extractTsdownConfig(this)
        )
      );
    }
  };
};

export default plugin;
