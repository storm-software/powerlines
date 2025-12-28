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

import type { UserConfig as ExternalFarmOptions } from "@farmfe/core";
import type { Configuration as ExternalRspackOptions } from "@rspack/core";
import type { BuildOptions as ExternalTsupOptions } from "@storm-software/tsup/types";
import type { UnbuildOptions as ExternalUnbuildOptions } from "@storm-software/unbuild/types";
import type { BuildOptions as ExternalESBuildOptions } from "esbuild";
import type { RolldownOptions as ExternalRolldownOptions } from "rolldown";
import type {
  RollupOptions as ExternalRollupOptions,
  OutputOptions as ExternalRollupOutputOptions
} from "rollup";
import type { UserConfig as ExternalTsdownOptions } from "tsdown";
import type {
  DepOptimizationOptions,
  UserConfig as ExternalViteUserConfig
} from "vite";
import type { Configuration as ExternalWebpackOptions } from "webpack";

export type UnpluginBuildVariant =
  | "rollup"
  | "webpack"
  | "rspack"
  | "vite"
  | "esbuild"
  | "farm"
  | "unloader"
  | "rolldown";

export const UNPLUGIN_BUILD_VARIANTS: UnpluginBuildVariant[] = [
  "rollup",
  "webpack",
  "rspack",
  "vite",
  "esbuild",
  "farm",
  "unloader",
  "rolldown"
];

export type BuildVariant = UnpluginBuildVariant | "tsup" | "tsdown" | "unbuild";

export type InferUnpluginVariant<TBuildVariant extends BuildVariant> =
  TBuildVariant extends "tsup"
    ? "esbuild"
    : TBuildVariant extends "tsdown"
      ? "rolldown"
      : TBuildVariant extends "unbuild"
        ? "rollup"
        : TBuildVariant;

export interface BuildConfig {
  /**
   * The platform to build the project for
   *
   * @defaultValue "neutral"
   */
  platform?: "node" | "browser" | "neutral";

  /**
   * Array of strings indicating the polyfills to include for the build.
   *
   * @remarks
   * This option allows you to specify which polyfills should be included in the build process to ensure compatibility with the target environment. The paths for the polyfills can use placeholder tokens (the `replacePathTokens` helper function will be used to resolve the actual values).
   *
   * @example
   * ```ts
   * {
   *   polyfill: ['{projectRoot}/custom-polyfill.ts']
   * }
   * ```
   */
  polyfill?: string[];

  /**
   * Array of strings indicating the order in which fields in a package.json file should be resolved to determine the entry point for a module.
   *
   * @defaultValue `['browser', 'module', 'jsnext:main', 'jsnext']`
   */
  mainFields?: string[];

  /**
   * Array of strings indicating what conditions should be used for module resolution.
   */
  conditions?: string[];

  /**
   * Array of strings indicating what file extensions should be used for module resolution.
   *
   * @defaultValue `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`
   */
  extensions?: string[];

  /**
   * Array of strings indicating what modules should be deduplicated to a single version in the build.
   *
   * @remarks
   * This option is useful for ensuring that only one version of a module is included in the bundle, which can help reduce bundle size and avoid conflicts.
   */
  dedupe?: string[];

  /**
   * Array of strings or regular expressions that indicate what modules are builtin for the environment.
   */
  builtins?: (string | RegExp)[];

  /**
   * Define global variable replacements.
   *
   * @remarks
   * This option allows you to specify global constants that will be replaced in the code during the build process. It is similar to the `define` option in esbuild and Vite, enabling you to replace specific identifiers with constant expressions at build time.
   *
   * @example
   * ```ts
   * {
   *   define: {
   *     __VERSION__: '"1.0.0"',
   *     __DEV__: 'process.env.NODE_ENV !== "production"'
   *   }
   * }
   * ```
   *
   * @see https://esbuild.github.io/api/#define
   * @see https://vitejs.dev/config/build-options.html#define
   * @see https://github.com/rollup/plugins/tree/master/packages/replace
   */
  define?: Record<string, any>;

  /**
   * Global variables that will have import statements injected where necessary
   *
   * @remarks
   * This option allows you to specify global variables that should be automatically imported from specified modules whenever they are used in the code. This is particularly useful for polyfilling Node.js globals in a browser environment.
   *
   * @example
   * ```ts
   * {
   *   inject: {
   *     process: 'process/browser',
   *     Buffer: ['buffer', 'Buffer'],
   *   }
   * }
   * ```
   *
   * @see https://github.com/rollup/plugins/tree/master/packages/inject
   */
  inject?: Record<string, string | string[]>;

  /**
   * The alias mappings to use for module resolution during the build process.
   *
   * @remarks
   * This option allows you to define custom path aliases for modules, which can be useful for simplifying imports and managing dependencies.
   *
   * @example
   * ```ts
   * {
   *   alias: {
   *     "@utils": "./src/utils",
   *     "@components": "./src/components"
   *   }
   * }
   * ```
   *
   * @see https://github.com/rollup/plugins/tree/master/packages/alias
   */
  alias?:
    | Record<string, string>
    | Array<{
        find: string | RegExp;
        replacement: string;
      }>;

  /**
   * A list of modules that should not be bundled, even if they are external dependencies.
   *
   * @remarks
   * This option is useful for excluding specific modules from the bundle, such as Node.js built-in modules or other libraries that should not be bundled.
   */
  external?: (string | RegExp)[];

  /**
   * A list of modules that should always be bundled, even if they are external dependencies.
   */
  noExternal?: (string | RegExp)[];

  /**
   * Should the Powerlines CLI processes skip bundling the `node_modules` directory?
   */
  skipNodeModulesBundle?: boolean;

  /**
   * If true, `process.env` referenced in code will be preserved as-is and evaluated in runtime. Otherwise, it is statically replaced as an empty object.
   *
   * @defaultValue false
   */
  keepProcessEnv?: boolean;

  /**
   * An optional set of override options to apply to the selected build variant.
   *
   * @remarks
   * This option allows you to provide configuration options with the guarantee that they will **not** be overridden and will take precedence over other build configurations.
   */
  override?: Record<string, any>;
}

export type BuildResolvedConfig = Omit<BuildConfig, "override">;

// ESBuild
export type ESBuildBuildConfig = Omit<
  ExternalESBuildOptions,
  | "entryPoints"
  | "sourceRoot"
  | "platform"
  | "outdir"
  | "env"
  | "assets"
  | "external"
  | "inject"
  | "tsconfig"
  | "tsconfigRaw"
  | "logLevel"
> &
  BuildConfig;
export type ESBuildResolvedBuildConfig = Omit<
  ExternalESBuildOptions,
  "inject"
> &
  BuildResolvedConfig;

// Vite
export type ViteBuildConfig = Omit<
  ExternalViteUserConfig,
  | "entry"
  | "entryPoints"
  | "tsconfig"
  | "tsconfigRaw"
  | "environments"
  | "output"
> &
  BuildConfig & {
    /**
     * Optimize deps config
     */
    optimizeDeps?: Omit<DepOptimizationOptions, "extensions">;
  };
export type ViteResolvedBuildConfig = ExternalViteUserConfig &
  BuildResolvedConfig;

// Webpack
export type WebpackBuildConfig = Omit<
  ExternalWebpackOptions,
  "name" | "entry" | "entryPoints" | "tsconfig" | "tsconfigRaw"
> &
  BuildConfig;
export type WebpackResolvedBuildConfig = ExternalWebpackOptions &
  BuildResolvedConfig;

// Rspack
export type RspackBuildConfig = Omit<
  ExternalRspackOptions,
  "name" | "entry" | "entryPoints" | "tsconfig" | "tsconfigRaw"
> &
  BuildConfig;
export type RspackResolvedBuildConfig = ExternalRspackOptions &
  BuildResolvedConfig;

// Rollup
export type RollupBuildOutputConfig = Omit<
  ExternalRollupOutputOptions,
  "dir" | "format"
>;
export type RollupBuildConfig = Omit<
  ExternalRollupOptions,
  "entry" | "external" | "input" | "output" | "logLevel"
> & {
  output: RollupBuildOutputConfig | RollupBuildOutputConfig[];
} & BuildConfig;
export type RollupResolvedBuildConfig = ExternalRollupOptions &
  BuildResolvedConfig;

// Rolldown
export type RolldownBuildConfig = Omit<
  ExternalRolldownOptions,
  "input" | "external" | "tsconfig" | "logLevel" | "output"
> &
  BuildConfig;
export type RolldownResolvedBuildConfig = ExternalRolldownOptions &
  BuildResolvedConfig;

// Tsup
export type TsupBuildConfig = Partial<
  Omit<
    ExternalTsupOptions,
    | "userOptions"
    | "tsconfig"
    | "tsconfigRaw"
    | "assets"
    | "outputPath"
    | "mode"
    | "format"
    | "platform"
    | "projectRoot"
    | "clean"
    | "env"
    | "entry"
    | "entryPoints"
    | "external"
    | "noExternal"
    | "skipNodeModulesBundle"
  >
> &
  BuildConfig;
export type TsupResolvedBuildConfig = ExternalTsupOptions & BuildResolvedConfig;

// Tsdown
export type TsdownBuildConfig = Partial<
  Omit<
    ExternalTsdownOptions,
    | "name"
    | "outDir"
    | "clean"
    | "cwd"
    | "tsconfig"
    | "publicDir"
    | "copy"
    | "alias"
    | "format"
    | "platform"
    | "env"
    | "define"
    | "entry"
    | "external"
    | "noExternal"
    | "skipNodeModulesBundle"
  >
> &
  BuildConfig;
export type TsdownResolvedBuildConfig = ExternalTsdownOptions &
  BuildResolvedConfig;

// Unbuild
export type UnbuildBuildConfig = Partial<
  Omit<
    ExternalUnbuildOptions,
    | "tsconfig"
    | "tsconfigRaw"
    | "assets"
    | "outputPath"
    | "mode"
    | "format"
    | "platform"
    | "projectRoot"
    | "env"
    | "entry"
    | "entryPoints"
  >
> &
  BuildConfig;
export type UnbuildResolvedBuildConfig = ExternalUnbuildOptions &
  BuildResolvedConfig;

// Farm
export type FarmBuildConfig = Partial<
  Omit<
    ExternalFarmOptions,
    | "tsconfig"
    | "tsconfigRaw"
    | "assets"
    | "outputPath"
    | "mode"
    | "format"
    | "platform"
    | "projectRoot"
    | "env"
    | "entry"
    | "entryPoints"
  >
> &
  BuildConfig;
export type FarmResolvedBuildConfig = ExternalFarmOptions & BuildResolvedConfig;
