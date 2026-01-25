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

import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { joinPaths } from "@stryke/path/join";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { TypeDefinition } from "@stryke/types/configuration";
import { defu } from "defu";
import { extractTsdownConfig } from "powerlines/lib/build/tsdown";
import { createUnplugin } from "powerlines/lib/unplugin";
import { Plugin } from "powerlines/types/plugin";
import { build } from "tsdown";
import { createRolldownPlugin } from "unplugin";
import type { PluginPluginContext, PluginPluginOptions } from "./types/plugin";

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
      this.debug("Providing default configuration for the Powerlines plugin.");

      return {
        type: "library",
        output: {
          format: ["cjs", "esm"],
          dts: false
        },
        build: {
          variant: "tsdown",
          platform: "node",
          nodeProtocol: true,
          minify: false,
          export: true,
          skipNodeModulesBundle: true,
          external: [/^@?powerlines\//]
        }
      };
    },
    async configResolved() {
      if (
        !this.config.entry ||
        (Array.isArray(this.config.entry) && this.config.entry.length === 0)
      ) {
        let entry = "src/index.tsx";
        if (!this.fs.existsSync(joinPaths(this.config.projectRoot, entry))) {
          entry = "src/index.ts";
        }

        this.config.entry = entry;
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
          this.warn(
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
            plugins: [createPlugin<TContext>(this)]
          },
          extractTsdownConfig(this)
        )
      );
    }
  };
};

export default plugin;
