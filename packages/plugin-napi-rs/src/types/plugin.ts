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

import { NapiCli } from "@napi-rs/cli";
import type {
  AlloyPluginContext,
  AlloyPluginResolvedConfig,
  AlloyPluginUserConfig
} from "@powerlines/plugin-alloy/types";
import type {
  BabelPluginContext,
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types";
import { RequiredKeys } from "@stryke/types/base";
import { Target, TargetTriple } from "./targets";
import { WasmOptions } from "./wasm";

/**
 * The options for the N-API Rust plugin.
 *
 * @remarks
 * These options are based on the options for the N-API Rust CLI, and are used to configure the plugin's behavior when building and generating bindings for N-API Rust modules.
 *
 * @see https://napi.rs/docs/cli/build#options
 */
export interface NapiPluginOptions {
  /**
   * Build only the specified binary
   */
  binaryName?: string;

  /**
   * Package name in generated JS binding file. Works only with --platform
   */
  packageName?: string;

  /**
   * Path to the build output dir, only needed when targets contains wasm32-wasi-*
   *
   * @remarks
   * This is used by the [Artifacts command](https://napi.rs/docs/cli/artifacts). This is required because the plugin needs to copy the generated wasm file to the output dir, and the default output dir is the crate folder, which is not suitable for wasm files. Relative to the project root. If not specified, it will default to the crate folder. This is only used for wasm targets, and will be ignored for non-wasm targets.
   */
  buildOutputDir?: string;

  /**
   * Path to the folder where the npm packages are located.
   *
   * @remarks
   * This is used by the [Artifacts command](https://napi.rs/docs/cli/artifacts)
   */
  npmDir?: string;

  /**
   * Build for the target triple, bypassed to `cargo build --target`
   */
  target?: TargetTriple | Target;

  /**
   * Specify multiple targets to build for, bypassed to `cargo build --target` with cargo-multi-target. If specified, the plugin will build for all the specified targets and generate bindings for each target. The generated binding files will have the target triple as a suffix, e.g. [name].linux-x64-gnu.node and [name].wasm32-wasi.node.
   */
  targets?: (TargetTriple | Target)[];

  /**
   * Build artifacts with the specified Cargo profile
   */
  profile?: string;

  /**
   * Wasm compilation options. If specified, the plugin will compile the N-API Rust module to WebAssembly and generate the corresponding bindings.
   */
  wasm?: WasmOptions;

  /**
   * Build in release mode
   */
  release?: boolean;

  /**
   * List of Cargo features to activate
   */
  features?: Array<string>;

  /**
   * Activate all available Cargo features
   */
  allFeatures?: boolean;

  /**
   * Do not activate the default features
   *
   * @defaultValue false
   */
  noDefaultFeatures?: boolean;

  /**
   * Path and filename of generated JS binding file. Only works with {@link platform} flag. Relative to {@link outputPath}.
   *
   * @defaultValue "binding.js"
   */
  jsBinding?: string;

  /**
   * DTS Binding File
   *
   * The path to the output TypeScript declaration file
   *
   * @defaultValue "binding.d.ts"
   */
  dts?: string;

  /**
   * The path to the Cargo.toml manifest file
   */
  manifestPath?: string;

  /**
   * Path to [NAPI-RS config file](https://napi.rs/docs/cli/napi-config)
   */
  configPath?: string;

  /**
   * Path to where all the built files would be put. Default to the crate folder if not specified. Relative to the project root.
   */
  outputDir?: string;

  /**
   * 	Directory for all crate generated artifacts, see `cargo build --target-dir`
   */
  targetDir?: string;

  /**
   * Path to the package.json file to read the version and other metadata from, used for generating the JS binding file. If not specified, it will default to the package.json file in the project root.
   */
  packageJsonPath?: string;

  /**
   * Add platform triple suffix to generated Node.js binding file, e.g. [name].linux-x64-gnu.node
   *
   * @defaultValue true
   */
  platform?: boolean;

  /**
   * Specify a different NPM client for usage when executing NPM actions such as publishing.
   */
  npmClient?: string;

  /**
   * Whether to generate const enum for TypeScript bindings
   */
  constEnum?: boolean;

  /**
   * Disable generation of JS binding file. Works only with --platform
   */
  noJsBinding?: boolean;

  /**
   * Custom file header for generated type def file (requires typedef feature)
   */
  dtsHeader?: string;

  /**
   * Path to the custom file header for generated type def file (requires typedef feature)
   */
  dtsHeaderFile?: string;

  /**
   * Disable default file header for generated type def file (requires typedef feature)
   */
  noDtsHeader?: boolean;

  /**
   * Enable the DTS cache
   */
  dtsCache?: boolean;

  /**
   * Strip the library to minimize file size
   */
  strip?: boolean;

  /**
   * Cross-compile for the specified target with cargo-xwin on Windows and cargo-zigbuild on other platforms
   */
  crossCompile?: boolean;

  /**
   * Use [cross-rs](https://github.com/cross-rs/cross) instead of cargo
   */
  useCross?: boolean;

  /**
   * Use \@napi-rs/cross-toolchain to cross-compile Linux arm/arm64/x64 gnu targets
   */
  useNapiCross?: boolean;
}

export type NapiPluginUserConfig = BabelPluginUserConfig &
  AlloyPluginUserConfig & {
    napi: NapiPluginOptions;
  };

export type NapiResolvedPluginOptions = Omit<
  RequiredKeys<
    NapiPluginOptions,
    | "dts"
    | "jsBinding"
    | "manifestPath"
    | "outputDir"
    | "platform"
    | "packageJsonPath"
  >,
  "target" | "targets"
> & {
  /**
   * The resolved target triple to build for, with additional metadata such as platform, architecture, and ABI information. These are derived from the `target` option, and are used internally by the plugin to determine how to build the N-API Rust module for the target.
   */
  target: Target;

  /**
   * The resolved list of target triples to build for, with additional metadata such as platform, architecture, and ABI information. These are derived from the `targets` option, and are used internally by the plugin to determine how to build the N-API Rust module for each target.
   */
  targets: Target[];
};

export type NapiPluginResolvedConfig = BabelPluginResolvedConfig &
  AlloyPluginResolvedConfig & {
    napi: NapiResolvedPluginOptions;
  };

export interface NapiPluginContext<
  TResolvedConfig extends NapiPluginResolvedConfig = NapiPluginResolvedConfig
>
  extends
    BabelPluginContext<TResolvedConfig>,
    AlloyPluginContext<TResolvedConfig> {
  napi: NapiCli;
}
