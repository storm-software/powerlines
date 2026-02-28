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

import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { build, UserConfig as BuildOptions } from "tsdown";
import { ResolvedConfig, UserConfig } from "./types/config";
import { PluginContext } from "./types/context";
import { Plugin } from "./types/plugin";

export interface BasePluginOptions {
  tsdown?: Partial<BuildOptions>;
}

export type BasePluginUserConfig = UserConfig & {
  tsdown: BasePluginOptions;
};

export type BasePluginResolvedConfig = ResolvedConfig & {
  tsdown: Required<BasePluginOptions>;
};

export type BasePluginContext<
  TResolvedConfig extends BasePluginResolvedConfig = BasePluginResolvedConfig
> = PluginContext<TResolvedConfig>;

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <TContext extends BasePluginContext = BasePluginContext>(
  options: BasePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "base",
    config() {
      return {
        type: "library",
        input: ["src/index.ts", "src/types/*.ts", "src/helpers/*.ts"],
        output: {
          format: ["cjs", "esm"],
          dts: false
        },
        resolve: {
          external: ["powerlines", /^powerlines\/.*$/, /^@powerlines\//],
          noExternal: ["@powerlines/core"]
        },
        platform: "node",
        tsdown: {
          logLevel: "silent",
          target: "node22",
          cjsDefault: true,
          treeshake: true,
          exports: {
            all: true
          },
          fixedExtension: true,
          nodeProtocol: true,
          minify: false,
          dts: true,
          shims: true,
          outDir: "dist",
          clean: true,
          skipNodeModulesBundle: true,
          unbundle: true,
          ...options.tsdown
        }
      };
    },
    async build() {
      await build({
        name: this.config.name,
        cwd: appendPath(this.config.root, this.workspaceConfig.workspaceRoot),
        entry:
          this.entry.filter(entry => entry?.file).length > 0
            ? Object.fromEntries(
                this.entry
                  .filter(entry => entry?.file)
                  .map(entry => [
                    entry.output ||
                      replaceExtension(
                        replacePath(
                          replacePath(
                            entry.file,
                            joinPaths(this.config.root, "src")
                          ),
                          this.entryPath
                        )
                      ),
                    entry.file
                  ])
              )
            : [
                joinPaths(
                  this.workspaceConfig.workspaceRoot,
                  this.config.root,
                  "src",
                  "**/*.ts"
                ),
                joinPaths(
                  this.workspaceConfig.workspaceRoot,
                  this.config.root,
                  "src",
                  "**/*.tsx"
                )
              ],
        platform: this.config.platform,
        tsconfig: this.tsconfig.tsconfigFilePath,
        outDir: this.config.output.buildPath,
        ...this.config.tsdown
      });
    }
  };
};

export default plugin;
