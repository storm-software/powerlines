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

import { Context } from "@powerlines/core";
import type { Configuration as ExternalRspackOptions } from "@rspack/core";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { RspackPluginResolvedConfig } from "../types";

/**
 * Resolves the options for [rspack](https://rspack.rs/).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(context: Context): ExternalRspackOptions {
  return defu(
    {
      resolve: {
        alias: context.alias
      }
    },
    (context.config as RspackPluginResolvedConfig).rspack
      ? (context.config as RspackPluginResolvedConfig).rspack
      : {},
    {
      external: context.config.resolve.external,
      noExternal: context.config.resolve.noExternal,
      skipNodeModulesBundle: context.config.resolve.skipNodeModulesBundle
    },
    {
      output: {
        path: context.config.output.path
      },
      name: context.config.name,
      node:
        context.config.platform === "node"
          ? {
              __dirname: true,
              __filename: true,
              global: true
            }
          : false,
      mode:
        context.config.mode === "development"
          ? ("development" as const)
          : ("production" as const),
      recordsInputPath: joinPaths(
        context.cachePath,
        "rspack",
        ".rspack-records.json"
      ),
      recordsOutputPath: joinPaths(
        context.cachePath,
        "rspack",
        ".rspack-records.json"
      ),
      context: joinPaths(context.config.cwd, context.config.root),
      noExternal: context.builtins,
      cache: context.config.mode === "development",
      devtool: context.config.output.sourceMap ? "source-map" : false,
      optimization: {
        minimize: context.config.output.minify
      }
    }
  ) as ExternalRspackOptions;
}
