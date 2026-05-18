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

import type {
  ExecutionContext,
  ResolvedEntryTypeDefinition,
  UnpluginOptions,
  UnresolvedContext
} from "@powerlines/core";
import { resolveEntryOutput } from "@powerlines/core/lib/entry";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { isString } from "@stryke/type-checks/is-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { DeepPartial } from "@stryke/types/base";
import defu from "defu";
import type { BuildOptions, PluginBuild } from "esbuild";
import { Format } from "esbuild";
import { createEsbuildPlugin } from "unplugin";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

export const DEFAULT_OPTIONS: Partial<BuildOptions> = {
  target: "esnext",
  platform: "neutral",
  format: "esm",
  write: true,
  minify: true,
  sourcemap: false,
  bundle: true,
  treeShaking: true,
  keepNames: true,
  splitting: true,
  logLevel: "silent"
};

/**
 * Resolves the entry options for esbuild.
 *
 * @param context - The build context.
 * @param entryPoints - The entry points to resolve.
 * @returns The resolved entry options.
 */
export function resolveEntry<TContext extends UnresolvedContext>(
  context: TContext,
  entryPoints: ResolvedEntryTypeDefinition[] | string[] = []
): BuildOptions["entryPoints"] {
  return entryPoints.reduce(
    (ret, entry) => {
      if (isString(entry)) {
        ret[replaceExtension(replacePath(entry, context.config.root))] =
          replacePath(entry, context.config.root);
      } else {
        ret[entry.output || resolveEntryOutput(context, entry)] = entry.file;
      }

      return ret;
    },
    {} as Record<string, string>
  );
}

/**
 * Resolves the esbuild options.
 *
 * @param context - The build context.
 * @param override - Optional esbuild options to override the resolved options.
 * @returns The resolved esbuild options.
 */
export function resolveOptions<TContext extends UnresolvedContext>(
  context: TContext,
  override: DeepPartial<BuildOptions> = {}
): BuildOptions {
  if (context.config.inject && Object.keys(context.config.inject).length > 0) {
    context.fs.writeSync(
      joinPaths(
        context.config.cwd,
        context.config.root,
        context.artifactsPath,
        "inject-shim.js"
      ),
      Object.entries(context.config.inject)
        .map(([key, value]) => {
          if (value) {
            if (Array.isArray(value)) {
              if (camelCase(key) !== key) {
                if (value.length === 1) {
                  return `
import ${camelCase(key)} from "${value[0]}";
export { ${camelCase(key)} as "${key}" }`;
                } else if (value.length > 1) {
                  return `
import ${value[1] === "*" ? `* as ${camelCase(key)}` : `{ ${value[1]} as ${camelCase(key)} }`} from "${value[0]}";
export { ${camelCase(key)} as "${key}" }`;
                }
              } else if (value.length === 1) {
                return `
import ${key} from "${value[0]}";
export { ${key} };`;
              } else if (value.length > 1) {
                return `
import ${value[1] === "*" ? `* as ${key}` : `{ ${value[1]} as ${key} }`} from "${value[0]}";
export { ${key} };`;
              }
            } else if (camelCase(key) !== key) {
              return `
import ${camelCase(key)} from "${value[0]}";
export { ${camelCase(key)} as "${key}" }`;
            } else {
              return `
import ${key} from "${value}";
export { ${key} };`;
            }
          }

          return "";
        })
        .join("\n")
    );
  }

  return defu(
    {
      alias: context.alias,
      inject:
        context.config.inject && Object.keys(context.config.inject).length > 0
          ? [
              joinPaths(
                context.config.cwd,
                context.config.root,
                context.artifactsPath,
                "inject-shim.js"
              )
            ]
          : undefined
    },
    override,
    {
      mainFields: context.config.resolve.mainFields,
      conditions: context.config.resolve.conditions,
      define: context.config.define,
      resolveExtensions: context.config.resolve.extensions,
      packages: context.config.resolve.skipNodeModulesBundle
        ? "external"
        : "bundle",
      format: (Array.isArray(context.config.output.format)
        ? context.config.output.format[0]
        : context.config.output.format) as Format,
      platform: context.config.platform,
      outdir: context.config.output.path,
      tsconfig: context.tsconfig.tsconfigFilePath,
      minify: context.config.output.minify,
      metafile: context.config.mode === "development",
      sourcemap: context.config.output.sourceMap
    },
    DEFAULT_OPTIONS
  ) as BuildOptions;
}

/**
 * Creates an ESBuild plugin factory that generates a plugin instance.
 *
 * @see https://esbuild.github.io/plugins/
 *
 * @example
 * ```ts
 * // esbuild.config.ts
 * import { createEsbuildFactory } from "@powerlines/unplugin/esbuild";
 *
 * const powerlinesPlugin = createEsbuildFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates an ESBuild plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your ESBuild build.
 */
export function createEsbuildFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "esbuild" }, unplugin =>
    decorate({
      ...(unplugin as UnpluginOptions<TContext>),
      esbuild: {
        config: opts => {
          opts ??= {};

          const result = resolveOptions(unplugin.context);
          for (const key in result) {
            if (
              isUndefined(opts[key as keyof BuildOptions]) &&
              !isUndefined(result[key as keyof BuildOptions])
            ) {
              opts[key as keyof BuildOptions] = result[
                key as keyof BuildOptions
              ] as any;
            }
          }
        },
        setup: async (build: PluginBuild) => {
          const environment = await unplugin.context.getEnvironment();

          return unplugin.context.callHook(
            "esbuild:setup",
            { environment },
            build
          );
        }
      }
    })
  );
}

/**
 * An ESBuild plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://esbuild.github.io/plugins/
 *
 * @example
 * ```js
 * // esbuild.config.js
 * import powerlines from "@powerlines/unplugin/esbuild";
 *
 * export default {
 *  plugins: [powerlines({ name: "example-app", ... })],
 * };
 *
 * ```
 */
const plugin = createEsbuildPlugin(createEsbuildFactory());

export default plugin;
