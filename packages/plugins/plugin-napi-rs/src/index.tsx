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

import { NapiCli, parseTriple } from "@napi-rs/cli";
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { isString } from "@stryke/type-checks/is-string";
import { defu } from "defu";
import { Plugin } from "powerlines";
import { isVerbose } from "powerlines/plugin-utils";
import { formatPath } from "./helpers/format-path";
import { DEFAULT_TARGETS } from "./types";
import type { NapiPluginContext, NapiPluginOptions } from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    napi?: NapiPluginOptions;
  }
}

/**
 * A Powerlines plugin for integrating with N-API Rust modules, providing features such as automatic generation of bindings and runtime integration with N-API Rust modules.
 *
 * @see https://napi.rs/docs
 */
export const plugin = <TContext extends NapiPluginContext = NapiPluginContext>(
  options: NapiPluginOptions = {}
) => {
  return [
    {
      name: "napi-rs",
      config() {
        return {
          napi: {
            dts: "binding.d.ts",
            jsBinding: "binding.js",
            outputDir: this.config.root,
            platform: true,
            strip: false,
            ...options
          }
        };
      },
      async configResolved() {
        if (
          !this.config.napi.target &&
          this.additionalArgs.target &&
          (isString(this.additionalArgs.target) ||
            (Array.isArray(this.additionalArgs.target) &&
              this.additionalArgs.target.length > 0))
        ) {
          this.config.napi.target = parseTriple(
            (Array.isArray(this.additionalArgs.target) &&
            this.additionalArgs.target.length > 0
              ? this.additionalArgs.target[0]
              : String(this.additionalArgs.target))!
          );
        } else {
          this.config.napi.target = isString(this.config.napi.target)
            ? parseTriple(this.config.napi.target)
            : this.config.napi.target;
        }

        if (!this.config.napi.targets) {
          if (
            this.additionalArgs.targets &&
            (isString(this.additionalArgs.targets) ||
              (Array.isArray(this.additionalArgs.targets) &&
                this.additionalArgs.targets.length > 0))
          ) {
            this.config.napi.targets = toArray(this.additionalArgs.targets).map(
              (target: string) => parseTriple(target)
            );
          } else {
            this.config.napi.targets = DEFAULT_TARGETS.map(target =>
              parseTriple(target)
            );
          }
        }

        if (
          !this.config.napi.profile &&
          this.additionalArgs.profile &&
          (isString(this.additionalArgs.profile) ||
            (Array.isArray(this.additionalArgs.profile) &&
              this.additionalArgs.profile.length > 0))
        ) {
          this.config.napi.profile = (
            Array.isArray(this.additionalArgs.profile) &&
            this.additionalArgs.profile.length > 0
              ? this.additionalArgs.profile[0]
              : String(this.additionalArgs.profile)
          )!;
        }

        if (!this.config.napi.release && this.additionalArgs.release) {
          this.config.napi.release = Boolean(this.additionalArgs.release);
        }

        if (
          !this.config.napi.configPath &&
          this.additionalArgs.configPath &&
          (isString(this.additionalArgs.configPath) ||
            (Array.isArray(this.additionalArgs.configPath) &&
              this.additionalArgs.configPath.length > 0))
        ) {
          this.config.napi.configPath = (
            Array.isArray(this.additionalArgs.configPath) &&
            this.additionalArgs.configPath.length > 0
              ? this.additionalArgs.configPath[0]
              : String(this.additionalArgs.configPath)
          )!;
        }

        if (
          !this.config.napi.manifestPath &&
          this.additionalArgs.manifestPath &&
          (isString(this.additionalArgs.manifestPath) ||
            (Array.isArray(this.additionalArgs.manifestPath) &&
              this.additionalArgs.manifestPath.length > 0))
        ) {
          this.config.napi.manifestPath = (
            Array.isArray(this.additionalArgs.manifestPath) &&
            this.additionalArgs.manifestPath.length > 0
              ? this.additionalArgs.manifestPath[0]
              : String(this.additionalArgs.manifestPath)
          )!;
        }

        if (
          !this.config.napi.npmDir &&
          this.additionalArgs.npmDir &&
          (isString(this.additionalArgs.npmDir) ||
            (Array.isArray(this.additionalArgs.npmDir) &&
              this.additionalArgs.npmDir.length > 0))
        ) {
          this.config.napi.npmDir = (
            Array.isArray(this.additionalArgs.npmDir) &&
            this.additionalArgs.npmDir.length > 0
              ? this.additionalArgs.npmDir[0]
              : String(this.additionalArgs.npmDir)
          )!;
        }

        if (!this.config.napi.packageJsonPath) {
          if (
            this.additionalArgs.packageJsonPath &&
            (isString(this.additionalArgs.packageJsonPath) ||
              (Array.isArray(this.additionalArgs.packageJsonPath) &&
                this.additionalArgs.packageJsonPath.length > 0))
          ) {
            this.config.napi.packageJsonPath = (
              Array.isArray(this.additionalArgs.packageJsonPath) &&
              this.additionalArgs.packageJsonPath.length > 0
                ? this.additionalArgs.packageJsonPath[0]
                : String(this.additionalArgs.packageJsonPath)
            )!;
          }

          if (!this.config.napi.packageJsonPath) {
            this.config.napi.packageJsonPath = appendPath(
              this.config.root,
              "package.json"
            );
          }
        }

        if (this.config.napi.target?.platform === "wasm") {
          this.dependencies["@napi-rs/wasm-runtime"] = "^1.1.4";
        }

        let packageJson = {} as Record<string, any>;
        let originalPackageJson = {} as Record<string, any>;

        if (this.fs.existsSync(this.config.napi.packageJsonPath)) {
          packageJson = JSON.parse(
            (await this.fs.read(this.config.napi.packageJsonPath)) || "{}"
          );
        }

        originalPackageJson = { ...packageJson };
        packageJson.napi = {
          binaryName: this.config.napi.binaryName,
          packageName: this.config.napi.packageName,
          targets: this.config.napi.targets?.map(target => target.triple),
          npmClient: this.config.napi.npmClient,
          constEnum: this.config.napi.constEnum,
          dtsHeader: this.config.napi.dtsHeader,
          dtsHeaderFile: this.config.napi.dtsHeaderFile,
          ...packageJson.napi,
          wasm:
            this.config.napi.target?.platform === "wasm"
              ? defu(
                  packageJson.napi?.wasm ?? {},
                  this.config.napi.wasm ?? {},
                  { initialMemory: 16384 }
                )
              : undefined
        };

        if (
          JSON.stringify(packageJson) !== JSON.stringify(originalPackageJson)
        ) {
          await this.fs.write(
            this.config.napi.packageJsonPath,
            JSON.stringify(packageJson, null, 2)
          );
        }
      },
      async prepare() {
        this.debug(
          `Preparing the N-API Rust runtime artifacts for the Powerlines project.`
        );

        this.napi = new NapiCli();

        if (this.config.napi.npmDir) {
          await this.napi.createNpmDirs({
            cwd: appendPath(this.config.root, this.config.cwd),
            npmDir: formatPath(this, this.config.napi.npmDir),
            configPath: formatPath(this, this.config.napi.configPath),
            packageJsonPath: formatPath(this, this.config.napi.packageJsonPath)
          });
        }
      },
      async build() {
        this.debug(
          `Building the N-API Rust runtime artifacts for the Powerlines project.`
        );

        const { task } = await this.napi.build({
          cwd: appendPath(this.config.root, this.config.cwd),
          package: this.config.napi.packageName,
          outputDir: formatPath(this, this.config.napi.outputDir),
          configPath: formatPath(this, this.config.napi.configPath),
          manifestPath: formatPath(this, this.config.napi.manifestPath),
          packageJsonPath: formatPath(this, this.config.napi.packageJsonPath),
          target: this.config.napi.target?.triple,
          profile: this.config.napi.profile,
          release:
            this.config.napi.release ?? this.config.mode === "production",
          features: this.config.napi.features,
          noDefaultFeatures: this.config.napi.noDefaultFeatures,
          strip: this.config.napi.strip,
          platform: this.config.napi.platform,
          noDtsHeader: this.config.napi.noDtsHeader,
          jsBinding: this.config.napi.jsBinding,
          dts: this.config.napi.dts,
          dtsCache: this.config.napi.dtsCache ?? !this.config.skipCache,
          verbose: isVerbose(this)
        });

        const outputs = await task;
        for (const output of outputs) {
          const code = await this.fs.read(output.path);
          if (code) {
            await this.fs.write(output.path, code);
          }
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
