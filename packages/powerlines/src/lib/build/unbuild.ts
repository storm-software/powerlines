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

import type { Loader, LoaderResult } from "@storm-software/unbuild/types";
import { joinPaths } from "@stryke/path/join-paths";
import { isObject } from "@stryke/type-checks/is-object";
import defu from "defu";
import { transform } from "esbuild";
import { TransformResult } from "unplugin";
import {
  UnbuildBuildConfig,
  UnbuildResolvedBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";
import { UNSAFE_PluginContext } from "../../types/internal";
import { getString } from "../utilities/source-file";
import { extractRollupConfig } from "./rollup";

export const DEFAULT_UNBUILD_CONFIG = {
  dts: true,
  clean: false,
  includeSrc: false,
  treeShaking: true,
  splitting: true,
  stub: false,
  watchOptions: {},
  outputPath: "dist",
  generatePackageJson: true,
  banner: " ",
  rollup: {
    dts: {},
    emitCJS: true,
    replace: {},
    resolve: {},
    json: {},
    esbuild: { target: "es2020" },
    commonjs: {},
    alias: {}
  }
} as Partial<UnbuildBuildConfig>;

export const unbuildLoader = (context: UNSAFE_PluginContext): Loader => {
  return async (input, { options }) => {
    if (
      !/\.(?:c|m)?[jt]sx?$/.test(input.path) ||
      /\.d\.[cm]?ts$/.test(input.path)
    ) {
      return;
    }

    const output: LoaderResult = [];

    let contents = await input.getContents();

    // declaration
    if (options.declaration && !input.srcPath?.match(/\.d\.[cm]?ts$/)) {
      const cm = input.srcPath?.match(/(?<=\.)(?:c|m)(?=[jt]s$)/)?.[0] || "";
      const extension = `.d.${cm}ts`;
      output.push({
        contents,
        srcPath: input.srcPath,
        path: input.path,
        extension,
        declaration: true
      });
    }

    let transformed: TransformResult | string = contents;

    let result = await context.$$internal.callHook(
      "transform",
      {
        sequential: true,
        order: "pre"
      },
      transformed,
      input.path
    );
    if (result) {
      transformed = result;
    }

    result = await context.$$internal.callHook(
      "transform",
      {
        sequential: true,
        order: "normal"
      },
      getString(transformed),
      input.path
    );
    if (result) {
      transformed = result;
    }

    result = await context.$$internal.callHook(
      "transform",
      {
        sequential: true,
        order: "post"
      },
      getString(transformed),
      input.path
    );
    if (result) {
      transformed = result;
    }

    // typescript => js
    if ([".ts", ".mts", ".cts"].includes(input.extension)) {
      contents = await transform(getString(transformed), {
        ...Object.fromEntries(
          Object.entries(options.esbuild ?? {}).filter(
            ([key]) => key !== "absPaths"
          )
        ),
        loader: "ts"
      }).then(r => r.code);
    } else if ([".tsx", ".jsx"].includes(input.extension)) {
      contents = await transform(getString(transformed), {
        loader: input.extension === ".tsx" ? "tsx" : "jsx",
        ...Object.fromEntries(
          Object.entries(options.esbuild ?? {}).filter(
            ([key]) => key !== "absPaths"
          )
        )
      }).then(r => r.code);
    }

    // esm => cjs
    const isCjs = options.format === "cjs";
    if (isCjs) {
      contents = context.resolver
        .transform({
          source: contents,
          retainLines: false
        })
        .replace(/^exports.default = /gm, "module.exports = ")
        .replace(/^var _default = exports.default = /gm, "module.exports = ")
        .replace("module.exports = void 0;", "");
    }

    let extension = isCjs ? ".js" : ".mjs"; // TODO: Default to .cjs in next major version
    if (options.ext) {
      extension = options.ext.startsWith(".") ? options.ext : `.${options.ext}`;
    }

    output.push({
      contents,
      path: input.path,
      extension
    });

    return output;
  };
};

/**
 * Extracts the unbuild configuration from the context.
 *
 * @param context - The build context.
 * @returns The resolved unbuild configuration.
 */
export function extractUnbuildConfig(
  context: Context
): UnbuildResolvedBuildConfig {
  return defu(
    {
      alias: context.fs.builtinIdMap.keys().reduce(
        (ret, id) => {
          const path = context.fs.builtinIdMap.get(id);
          if (path) {
            ret[id] = path;
          }

          return ret;
        },
        {} as Record<string, string>
      )
    },
    context.config.build.variant === "unbuild" ? context.config.override : {},
    {
      projectName: context.config.name,
      name: context.config.name,
      orgName: isObject(context.workspaceConfig.organization)
        ? context.workspaceConfig.organization.name
        : context.workspaceConfig.organization,
      sourceRoot: context.config.sourceRoot,
      projectRoot: context.config.projectRoot,
      outputPath: context.config.output.outputPath || "dist",
      platform: context.config.build.platform,
      external: context.fs.builtinIdMap.keys().reduce((ret, id) => {
        if (!ret.includes(id)) {
          ret.push(id);
        }

        return ret;
      }, context.config.build.external ?? []) as string[],

      loaders: [unbuildLoader(context as UNSAFE_PluginContext)],
      jiti: {
        interopDefault: true,
        fsCache: joinPaths(context.envPaths.cache, "jiti"),
        moduleCache: true
      },
      rollup: extractRollupConfig(context) as any
    },
    context.config.build.variant === "unbuild" ? context.config.build : {},
    {
      debug: context.config.mode === "development",
      minify: context.config.mode !== "development",
      sourcemap: context.config.mode === "development"
    },
    DEFAULT_UNBUILD_CONFIG
  );
}
