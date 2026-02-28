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

import { toArray } from "@stryke/convert/to-array";
import { isDirectory } from "@stryke/fs/is-file";
import { listFiles } from "@stryke/fs/list-files";
import { appendPath } from "@stryke/path/append";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import {
  Config,
  GenerateContext,
  GenerateResult,
  loadConfig,
  resolveConfig,
  transform
} from "automd";
import { loadConfig as loadConfigFile } from "c12";
import defu from "defu";
import toc from "markdown-toc";
import type { Plugin } from "powerlines";
import {
  AutoMDPluginContext,
  AutoMDPluginOptions,
  AutoMDPluginUserConfig
} from "./types/plugin";
import { TOCOptions } from "./types/toc";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    automd?: AutoMDPluginOptions;
  }
}

/**
 * AutoMD Plugin
 *
 * @remarks
 * A Powerlines plugin to use the AutoMD markdown transformer during the prepare task.
 *
 * @see https://automd.unjs.io/
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends AutoMDPluginContext = AutoMDPluginContext
>(
  options: AutoMDPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "automd",
    async config() {
      const config = await loadConfig(
        joinPaths(this.workspaceConfig.workspaceRoot, this.config.root),
        options
      );

      if (!config.prefix || !Array.isArray(config.prefix)) {
        config.prefix = toArray(config.prefix ?? []);
      }

      if (!config.prefix.includes("automd")) {
        config.prefix.push("automd");
      }
      if (!config.prefix.includes("powerlines")) {
        config.prefix.push("powerlines");
      }

      return {
        automd: defu(config ?? {}, {
          configFile: options.configFile,
          allowIssues: true,
          dir: this.config.root,
          watch: false,
          input: "README.md",
          toc: {
            maxDepth: 6,
            bullets: "-"
          }
        })
      } as Partial<AutoMDPluginUserConfig>;
    },
    async configResolved() {
      if (
        this.config.framework &&
        !toArray(this.config.automd.prefix).includes(this.config.framework)
      ) {
        this.config.automd.prefix = toArray(this.config.automd.prefix).concat(
          this.config.framework
        );
      }

      if (this.config.automd.configFile) {
        const { config } = await loadConfigFile<Config>({
          cwd: this.config.automd.dir,
          configFile: this.config.automd.configFile,
          defaults: {
            ignore: ["**/node_modules", "**/dist", "**/.*"],
            dir: this.config.automd.dir
          }
        });

        this.config.automd = resolveConfig(
          defu(this.config.automd, {
            ...config,
            prefix: toArray(config.prefix ?? [])
          }) as Config
        );
      }

      this.config.automd.input = (
        await Promise.all(
          toArray(this.config.automd.input).map(async input => {
            if (input.includes("*")) {
              return listFiles(
                isAbsolutePath(input)
                  ? input
                  : appendPath(input, this.config.root),
                {
                  ignore: this.config.automd.ignore
                }
              );
            }

            return isAbsolutePath(input)
              ? input
              : appendPath(input, this.config.root);
          })
        )
      ).flat();

      if (
        this.config.automd.output &&
        !isAbsolutePath(this.config.automd.output)
      ) {
        this.config.automd.output = appendPath(
          this.config.automd.output,
          this.config.root
        );
      }

      this.config.automd.generators ??= {};

      if (this.config.automd.toc !== false) {
        this.config.automd.generators.toc ??= {
          name: "toc",
          generate: (ctx: GenerateContext): GenerateResult => {
            const opts = (this.config.automd.toc ?? {}) as TOCOptions;

            return {
              contents: toc(ctx.block.contents, {
                ...opts,
                maxdepth: opts.maxDepth,
                first1: opts.firstH1
              }).content
            };
          }
        };
      }
    },
    async docs() {
      await Promise.all(
        toArray(this.config.automd.input).map(async input => {
          const contents = await this.fs.read(input);
          if (contents) {
            const result = await transform(contents, this.config.automd);
            if (result.hasIssues && this.config.automd.allowIssues === false) {
              throw new Error(
                `AutoMD found issues in file "${
                  input
                }". Please resolve the issues or set \`allowIssues\` to true in the plugin configuration to ignore them.`
              );
            }

            if (result.hasChanged) {
              await this.fs.write(
                appendPath(
                  this.config.automd.output
                    ? isDirectory(this.config.automd.output)
                      ? replacePath(input, this.config.automd.output)
                      : this.config.automd.output
                    : input,
                  this.config.root
                ),
                result.contents
              );
            }
          }
        })
      );
    }
  };
};

export default plugin;
