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
import alloy from "@powerlines/plugin-alloy";
import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import { isString } from "@stryke/type-checks/is-string";
import { Plugin } from "powerlines";
import { isVerbose, replacePathTokens } from "powerlines/plugin-utils";
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
    alloy(),
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
            packageJsonPath: appendPath(this.config.root, "package.json"),
            ...options
          }
        };
      },
      configResolved() {
        if (!this.config.napi.target && this.additionalArgs.target) {
          this.config.napi.target = parseTriple(this.additionalArgs.target);
        } else {
          this.config.napi.target = isString(this.config.napi.target)
            ? parseTriple(this.config.napi.target)
            : this.config.napi.target;
        }

        if (!this.config.napi.profile && this.additionalArgs.profile) {
          this.config.napi.profile = this.additionalArgs.profile;
        }

        if (!this.config.napi.release && this.additionalArgs.release) {
          this.config.napi.release = Boolean(this.additionalArgs.release);
        }

        if (!this.config.napi.configPath && this.additionalArgs.configPath) {
          this.config.napi.configPath = this.additionalArgs.configPath;
        }

        if (
          !this.config.napi.manifestPath &&
          this.additionalArgs.manifestPath
        ) {
          this.config.napi.manifestPath = this.additionalArgs.manifestPath;
        }

        if (
          !this.config.napi.packageJsonPath &&
          this.additionalArgs.packageJsonPath
        ) {
          this.config.napi.packageJsonPath =
            this.additionalArgs.packageJsonPath;
        }

        if (this.config.napi.target?.platform === "wasm") {
          this.dependencies["@napi-rs/wasm-runtime"] = "^1.1.4";
        }
      },
      async prepare() {
        this.debug(
          `Preparing the N-API Rust runtime artifacts for the Powerlines project.`
        );
      },
      async build() {
        this.debug(
          `Preparing the N-API Rust runtime artifacts for the Powerlines project.`
        );

        const cwd = appendPath(this.config.root, this.config.cwd);
        const cli = new NapiCli();

        const { task } = await cli.build({
          cwd,
          package: this.config.napi.packageName,
          outputDir: relativePath(
            cwd,
            appendPath(
              appendPath(this.config.napi.outputDir, this.config.root),
              this.config.cwd
            )
          ),
          configPath: this.config.napi.configPath
            ? relativePath(
                cwd,
                appendPath(
                  appendPath(
                    replacePathTokens(this, this.config.napi.configPath),
                    this.config.root
                  ),
                  this.config.cwd
                )
              )
            : undefined,
          manifestPath: this.config.napi.manifestPath
            ? relativePath(
                cwd,
                appendPath(
                  appendPath(
                    replacePathTokens(this, this.config.napi.manifestPath),
                    this.config.root
                  ),
                  this.config.cwd
                )
              )
            : undefined,
          packageJsonPath: this.config.napi.packageJsonPath
            ? relativePath(
                cwd,
                appendPath(
                  appendPath(
                    replacePathTokens(this, this.config.napi.packageJsonPath),
                    this.config.root
                  ),
                  this.config.cwd
                )
              )
            : undefined,
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
