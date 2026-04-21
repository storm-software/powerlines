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

import { PluginItem, PresetItem, transformAsync } from "@babel/core";
import type { Plugin } from "@powerlines/core";
import {
  findFileExtension,
  findFileExtensionSafe
} from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import defu from "defu";
import { isDuplicatePlugin, isDuplicatePreset } from "./helpers/filters";
import {
  getUniquePlugins,
  getUniquePresets,
  resolveBabelPlugin,
  resolveBabelPreset
} from "./helpers/options";
import {
  ResolvedBabelTransformPluginOptions,
  ResolvedBabelTransformPresetOptions
} from "./types/config";
import { BabelPluginContext, BabelPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

declare module "@powerlines/core" {
  interface Config {
    babel?: BabelPluginOptions;
  }
}

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
        babel: options
      };
    },
    configResolved: {
      order: "pre",
      handler() {
        this.config.babel = defu(this.config.babel ?? {}, {
          plugins: [],
          presets: []
        });

        this.config.babel.plugins = getUniquePlugins(this.config.babel.plugins);
        this.config.babel.presets = getUniquePresets(this.config.babel.presets);
      }
    },
    async transform(code: string, id: string) {
      if (
        isParentPath(id, this.powerlinesPath) ||
        code.includes("/* @powerlines-ignore */") ||
        code.includes("/* @powerlines-disable */")
      ) {
        this.trace(`Skipping Babel transformation for: ${id}`);

        return { code, id };
      }

      const plugins = getUniquePlugins(
        this.config.babel.plugins
          .map(plugin => resolveBabelPlugin(this, code, id, plugin))
          .filter(Boolean) as ResolvedBabelTransformPluginOptions[]
      );
      const presets = getUniquePresets(
        this.config.babel.presets
          .map(preset => resolveBabelPreset(this, code, id, preset))
          .filter(Boolean) as ResolvedBabelTransformPresetOptions[]
      );

      if (
        Array.isArray(plugins) &&
        plugins.length === 0 &&
        Array.isArray(presets) &&
        presets.length === 0
      ) {
        return { code, id };
      }

      if (
        !this.config.babel?.skipConfigResolution &&
        /^(?:m|c)?tsx?$/.test(
          findFileExtensionSafe(id, {
            fullExtension: true
          })
        ) &&
        !isDuplicatePlugin(plugins, "@babel/plugin-syntax-typescript") &&
        !isDuplicatePreset(presets, "@babel/preset-typescript")
      ) {
        plugins.unshift([
          "@babel/plugin-syntax-typescript",
          { isTSX: findFileExtension(id) === "tsx" }
        ]);
      }

      this.trace(
        `Running babel transformations with ${plugins.length} plugins and ${
          presets.length
        } presets for file: ${id}`
      );

      const result = await transformAsync(code, {
        cwd: this.config.cwd,
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
          name: this.config.framework
        },
        ...(this.config.babel ?? {}),
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
          .filter(Boolean) as PluginItem<object>[],
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
          .filter(Boolean) as PresetItem<object>[]
      });
      if (!result?.code) {
        throw new Error(`Powerlines - Babel plugin failed to compile ${id}`);
      }

      this.trace(`Completed babel transformations for file: ${id}`);

      return { code: result.code, id };
    }
  } as Plugin<TContext>;
};

export default plugin;
