/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import { isMatchFound } from "@powerlines/core/lib/typescript";
import { render } from "@powerlines/plugin-alloy/render";
import babel, { BabelPluginResolvedConfig } from "@powerlines/plugin-babel";
import env from "@powerlines/plugin-env";
import type { VitePluginResolvedConfig } from "@powerlines/plugin-vite/types/plugin";
import { addProperty } from "@powerlines/schema";
import rolldownBabel from "@rolldown/plugin-babel";
import { kebabCase } from "@stryke/string-format/kebab-case";
import viteReactPlugin from "@vitejs/plugin-react";
import type { LoggerEvent } from "babel-plugin-react-compiler";
import reactCompilerPreset from "babel-plugin-react-compiler";
import defu from "defu";
import type { Plugin } from "powerlines";
import { ReactOptimizedBuiltin } from "./components/react-optimized";
import type { ReactPluginContext, ReactPluginOptions } from "./types/plugin";

export * from "./components";
export * from "./types";

declare module "powerlines" {
  interface Config {
    react?: ReactPluginOptions;
  }
}

/**
 * A package containing a Powerlines plugin for building a React application.
 */
export const plugin = <
  TContext extends ReactPluginContext = ReactPluginContext
>(
  options: ReactPluginOptions = {}
) => {
  return [
    babel(options.babel),
    env(options.env),
    {
      name: "react",
      config() {
        return defu(
          {
            react: options
          },
          {
            react: {
              jsxImportSource: this.tsconfig.tsconfigJson.compilerOptions
                ?.jsxImportSource as string
            }
          },
          {
            react: {
              jsxRuntime: "automatic",
              jsxImportSource: "react",
              compiler: {
                target: "19",
                compilationMode: "infer",
                gating: {
                  source: `${
                    kebabCase(this.config.framework?.name) || "powerlines"
                  }:react/optimized`,
                  importSpecifierName: "isOptimizationEnabled"
                },
                enableReanimatedCheck: true,
                logger: {
                  logEvent: (filename: string | null, event: LoggerEvent) => {
                    this.logger.log(
                      event.kind === "CompileSuccess" ||
                        event.kind === "AutoDepsEligible" ||
                        event.kind === "AutoDepsDecorations"
                        ? "info"
                        : event.kind === "CompileSkip" ||
                            event.kind === "CompileDiagnostic"
                          ? "debug"
                          : event.kind === "Timing"
                            ? "trace"
                            : "error",
                      `(${filename}) ${
                        event.kind === "CompileSuccess"
                          ? `React Compiler Success`
                          : event.kind === "AutoDepsEligible"
                            ? `React AutoDeps Eligible - ${
                                event.depArrayLoc.identifierName ||
                                "No identifier"
                              }`
                            : event.kind === "AutoDepsDecorations"
                              ? `React AutoDeps Decorations - ${event.decorations
                                  .filter(dec => dec.identifierName)
                                  .map(dec => dec.identifierName)
                                  .join(", ")}`
                              : event.kind === "CompileSkip"
                                ? `React Compile Skip - ${event.reason}`
                                : event.kind === "CompileDiagnostic"
                                  ? `React Compile Diagnostic - (Category: ${
                                      event.detail.category
                                    }) ${event.detail.reason}${
                                      event.detail.description
                                        ? `\n${event.detail.description}`
                                        : ""
                                    }`
                                  : event.kind === "Timing"
                                    ? `React ${
                                        event.measurement.entryType
                                      } Timing (${event.measurement.name}) - ${
                                        event.measurement.duration
                                      }ms`
                                    : `React Compiler Error - ${
                                        event.fnLoc?.identifierName ||
                                        "unknown location"
                                      }`
                      }`
                    );
                  }
                }
              }
            } as ReactPluginOptions
          }
        );
      },
      configResolved() {
        this.dependencies.react = "^19.2.3";
        this.dependencies["react-dom"] = "^19.2.3";

        this.devDependencies["@types/react"] = "^19.2.3";
        this.devDependencies["@types/react-dom"] = "^19.2.3";

        const usesVite = Boolean(
          (this.config as unknown as VitePluginResolvedConfig).vite
        );

        if (this.config.react.compiler !== false && !usesVite) {
          (this.config as BabelPluginResolvedConfig).babel ??=
            {} as BabelPluginResolvedConfig["babel"];

          this.config.babel.plugins ??= [];
          this.config.babel.plugins.push([
            "babel-plugin-react-compiler",
            this.config.react.compiler ?? {}
          ]);
        }

        this.tsconfig.tsconfigJson.compilerOptions ??= {};
        this.tsconfig.tsconfigJson.compilerOptions.lib ??= [];
        this.tsconfig.tsconfigJson.compilerOptions.module ??= "esnext";
        this.tsconfig.tsconfigJson.compilerOptions.jsxImportSource =
          this.config.react.jsxImportSource;

        if (this.tsconfig.options.jsxImportSource === "react") {
          this.tsconfig.tsconfigJson.compilerOptions.jsx ??= "react-jsx";
        } else {
          this.tsconfig.tsconfigJson.compilerOptions.jsx ??= "preserve";
        }

        // Client platform
        if (this.config.environment.consumer === "client") {
          if (
            !isMatchFound("dom", this.tsconfig.tsconfigJson.compilerOptions.lib)
          ) {
            this.tsconfig.tsconfigJson.compilerOptions.lib.push("DOM");
          }

          if (
            !isMatchFound(
              "dom.iterable",
              this.tsconfig.tsconfigJson.compilerOptions.lib
            )
          ) {
            this.tsconfig.tsconfigJson.compilerOptions.lib.push("DOM.Iterable");
          }
        }

        if (
          !isMatchFound(
            "esnext",
            this.tsconfig.tsconfigJson.compilerOptions.lib
          )
        ) {
          this.tsconfig.tsconfigJson.compilerOptions.lib.push("ESNext");
        }

        if (this.tsconfig.options.resolveJsonModule !== true) {
          this.tsconfig.tsconfigJson.compilerOptions.resolveJsonModule = true;
        }

        if (usesVite) {
          this.tsconfig.tsconfigJson.compilerOptions.types ??= [];

          if (
            !isMatchFound(
              "vite/client",
              this.tsconfig.tsconfigJson.compilerOptions.types
            )
          ) {
            this.tsconfig.tsconfigJson.compilerOptions.types.push(
              "vite/client"
            );
          }

          const viteBuildConfig = (
            this.config as unknown as VitePluginResolvedConfig
          ).vite;
          viteBuildConfig.build ??= {};
          viteBuildConfig.build.target = "chrome95";

          viteBuildConfig.plugins ??= [];
          viteBuildConfig.plugins.unshift(
            viteReactPlugin({
              jsxImportSource: this.config.react.jsxImportSource,
              jsxRuntime: this.config.react.jsxRuntime,
              reactRefreshHost: this.config.react.reactRefreshHost
            })
          );

          if (this.config.react.compiler !== false) {
            viteBuildConfig.plugins.push(
              rolldownBabel({
                ...(this.config.react.compiler ?? {}),
                presets: [reactCompilerPreset]
              })
            );
          }
        }

        if (
          this.env?.config &&
          !this.env?.config.schema?.properties?.DISABLE_REACT_COMPILER
        ) {
          addProperty(this.env?.config, "DISABLE_REACT_COMPILER", {
            name: "DISABLE_REACT_COMPILER",
            readOnly: true,
            description: "Disables the React compiler optimizations.",
            type: "boolean",
            default: false
          });
        }
      },
      async prepare() {
        return render(
          this,
          <ReactOptimizedBuiltin
            override={this.config.react.compiler === false ? false : undefined}
          />
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
