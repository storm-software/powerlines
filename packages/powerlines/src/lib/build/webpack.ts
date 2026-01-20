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

import { omit } from "@stryke/helpers/omit";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import type { Configuration as ExternalWebpackOptions } from "webpack";
import { Context } from "../../types/context";

/**
 * Resolves the options for [webpack](https://webpack.js.org/).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function extractWebpackConfig(context: Context): ExternalWebpackOptions {
  return defu(
    {
      resolve: {
        alias: context.builtins.reduce(
          (ret, id) => {
            const moduleId = `${
              context.config.output?.builtinPrefix ||
              context.config?.framework ||
              "powerlines"
            }:${id.replace(/^.*?:/, "")}`;
            if (!ret[moduleId]) {
              const path = context.fs.paths[id];
              if (path) {
                ret[moduleId] = path;
              }
            }

            return ret;
          },
          context.config.build.alias
            ? Array.isArray(context.config.build.alias)
              ? context.config.build.alias.reduce(
                  (ret, alias) => {
                    if (!ret[alias.find.toString()]) {
                      ret[alias.find.toString()] = alias.replacement;
                    }

                    return ret;
                  },
                  {} as Record<string, string>
                )
              : context.config.build.alias
            : {}
        )
      }
    },
    context.config.build.variant === "webpack"
      ? context.config.build.override
      : {},
    context.config.build.variant === "webpack"
      ? omit(context.config.build, ["override", "variant"])
      : {},
    {
      output: {
        path: joinPaths(
          context.workspaceConfig.workspaceRoot,
          context.config.output.buildPath
        )
      },
      name: context.config.name,
      node:
        context.config.build.platform === "node"
          ? ({
              __dirname: true,
              __filename: true,
              global: true
            } as ExternalWebpackOptions["node"])
          : false,
      mode:
        context.config.mode === "development"
          ? ("development" as const)
          : ("production" as const),
      cache: {
        type: "filesystem" as const,
        cacheDirectory: joinPaths(context.cachePath, "webpack", "cache")
      },
      recordsInputPath: joinPaths(
        context.cachePath,
        "webpack",
        ".webpack-records.json"
      ),
      recordsOutputPath: joinPaths(
        context.cachePath,
        "webpack",
        ".webpack-records.json"
      ),
      context: joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot
      ),
      noExternal: context.builtins,
      devtool: (context.config.mode !== "development"
        ? false
        : "source-map") as string | false,
      optimization: {
        minimize: context.config.mode !== "development"
      }
    }
  );
}
