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

import { transformAsync } from "@babel/core";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { isParentPath } from "@stryke/path/is-parent-path";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import defu from "defu";
import { ResolvedBabelTransformPluginOptions } from "powerlines/types/babel";
import { UserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { isDuplicatePlugin } from "./helpers/filters";
import { resolveBabelPlugin } from "./helpers/options";
import { BabelPluginContext, BabelPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * Babel plugin for Powerlines.
 *
 * @param options - The Babel plugin user configuration options.
 * @returns A Powerlines plugin that integrates Babel transformations.
 */
export const plugin = <
  TContext extends BabelPluginContext = BabelPluginContext
>(
  options: BabelPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "babel",
    config() {
      if (!isSetObject(options)) {
        return undefined;
      }

      return {
        transform: { babel: options }
      } as Partial<UserConfig>;
    },
    configResolved: {
      order: "pre",
      handler() {
        this.devDependencies["@babel/core"] = "^7.28.4";

        this.config.transform.babel = defu(this.config.transform.babel ?? {}, {
          plugins: [],
          presets: []
        });
      }
    },
    async transform(code: string, id: string) {
      if (
        isParentPath(id, this.powerlinesPath) ||
        code.includes("/* @storm-ignore */") ||
        code.includes("/* @storm-disable */")
      ) {
        this.log(
          LogLevelLabel.TRACE,
          `Skipping Babel transformation for: ${id}`
        );

        return { code, id };
      }

      this.log(LogLevelLabel.TRACE, `Babel transforming file: ${id}`);

      const plugins = this.config.transform.babel.plugins
        .map(plugin => resolveBabelPlugin(this, code, id, plugin))
        .filter(
          (plugin, _, arr) => plugin && !isDuplicatePlugin(arr, plugin)
        ) as ResolvedBabelTransformPluginOptions[];
      const presets = this.config.transform.babel.presets
        .map(preset => resolveBabelPlugin(this, code, id, preset))
        .filter(
          (preset, _, arr) => preset && !isDuplicatePlugin(arr, preset)
        ) as ResolvedBabelTransformPluginOptions[];

      if (
        Array.isArray(plugins) &&
        plugins.length === 0 &&
        Array.isArray(presets) &&
        presets.length === 0
      ) {
        // this.log(
        //   LogLevelLabel.TRACE,
        //   `No Babel plugins or presets configured for ${
        //     id
        //   }. Skipping Babel transformation.`
        // );

        return { code, id };
      }

      const result = await transformAsync(code, {
        highlightCode: true,
        code: true,
        ast: false,
        cloneInputAst: false,
        comments: true,
        sourceType: "module",
        configFile: false,
        babelrc: false,
        envName: this.config.mode,
        caller: {
          name: "powerlines"
        },
        ...(this.config.transform.babel ?? {}),
        filename: id,
        plugins: plugins
          .map(plugin => {
            return Array.isArray(plugin) && plugin.length >= 2
              ? [
                  plugin[0],
                  defu(plugin.length > 1 && plugin[1] ? plugin[1] : {}, {
                    options
                  })
                ]
              : plugin;
          })
          .filter(Boolean),
        presets: presets
          .map(preset => {
            return Array.isArray(preset) && preset.length >= 2
              ? [
                  preset[0],
                  defu(preset.length > 1 && preset[1] ? preset[1] : {}, {
                    options
                  })
                ]
              : preset;
          })
          .filter(Boolean)
      });
      if (!result?.code) {
        throw new Error(`Powerlines - Babel plugin failed to compile ${id}`);
      }

      return { code: result.code, id };
    }
  } as Plugin<TContext>;
};

export default plugin;
