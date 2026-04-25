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
import { Plugin } from "powerlines";
import type { NapiRsPluginContext, NapiRsPluginOptions } from "./types/plugin";
import { DEFAULT_TARGETS, Target } from "./types/targets";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    napi?: NapiRsPluginOptions;
  }
}

/**
 * A Powerlines plugin for integrating with N-API Rust modules, providing features such as automatic generation of bindings and runtime integration with N-API Rust modules.
 *
 * @see https://napi.rs/docs
 */
export const plugin = <
  TContext extends NapiRsPluginContext = NapiRsPluginContext
>(
  options: NapiRsPluginOptions = {}
) => {
  return [
    alloy(),
    {
      name: "napi-rs",
      config() {
        return {
          napi: {
            targets: DEFAULT_TARGETS,
            dts: "binding.d.ts",
            jsBinding: "binding.js",
            outputDir: this.config.root,
            platform: true,
            strip: false,
            ...options
          }
        };
      },
      configResolved() {
        this.config.napi.targets = this.config.napi.targets?.map(target =>
          typeof target === "string" ? parseTriple(target) : target
        );
        if (
          this.config.napi.targets.some(
            (target: Target) => target.arch === "wasm32"
          )
        ) {
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
        await Promise.all(
          this.config.napi?.targets?.map(async (target: Target) => {
            this.debug(
              `Configured target: ${target.triple} (platform: ${target.platform}, arch: ${target.arch}, abi: ${target.abi})`
            );

            const { task } = await cli.build({
              cwd,
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
                      appendPath(this.config.napi.configPath, this.config.root),
                      this.config.cwd
                    )
                  )
                : undefined,
              manifestPath: this.config.napi.manifestPath
                ? relativePath(
                    cwd,
                    appendPath(
                      appendPath(
                        this.config.napi.manifestPath,
                        this.config.root
                      ),
                      this.config.cwd
                    )
                  )
                : undefined,
              target: target.triple,
              profile: this.config.napi.profile,
              release: this.config.napi.release,
              features: this.config.napi.features,
              noDefaultFeatures: this.config.napi.noDefaultFeatures,
              strip: this.config.napi.strip,
              platform: this.config.napi.platform,
              noDtsHeader: this.config.napi.noDtsHeader,
              jsBinding: this.config.napi.jsBinding,
              dts: this.config.napi.dts,
              dtsCache: this.config.napi.dtsCache ?? !this.config.skipCache
            });

            const outputs = await task;
            for (const output of outputs) {
              if (output.kind !== "node") {
                const code = await this.fs.read(output.path);
                if (code) {
                  await this.fs.write(output.path, code);
                }
              }
            }
          })
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
