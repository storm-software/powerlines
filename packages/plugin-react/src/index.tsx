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

import {
  ReflectionKind,
  ReflectionVisibility
} from "@powerlines/deepkit/vendor/type";
import babel from "@powerlines/plugin-babel";
import env from "@powerlines/plugin-env";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import viteReactPlugin from "@vitejs/plugin-react";
import type { LoggerEvent } from "babel-plugin-react-compiler";
import defu from "defu";
import { isMatchFound } from "powerlines/lib/typescript/tsconfig";
import type { ViteResolvedBuildConfig } from "powerlines/types/build";
import { Plugin } from "powerlines/types/plugin";
import type { BabelResolvedConfig } from "powerlines/types/resolved";
import { ReactOptimizedBuiltin } from "./components/react-optimized";
import type { ReactPluginContext, ReactPluginOptions } from "./types/plugin";

export * from "./components";
export * from "./types";

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
                  source: `${this.config.framework}:react/optimized`,
                  importSpecifierName: "isOptimizationEnabled"
                },
                enableReanimatedCheck: true,
                logger: {
                  logEvent: (filename: string | null, event: LoggerEvent) => {
                    this.log(
                      event.kind === "CompileSuccess"
                        ? LogLevelLabel.SUCCESS
                        : event.kind === "AutoDepsEligible" ||
                            event.kind === "AutoDepsDecorations"
                          ? LogLevelLabel.INFO
                          : event.kind === "CompileSkip" ||
                              event.kind === "CompileDiagnostic"
                            ? LogLevelLabel.DEBUG
                            : event.kind === "Timing"
                              ? LogLevelLabel.TRACE
                              : LogLevelLabel.ERROR,
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
                                    ? `React ${event.measurement.entryType} Timing (${event.measurement.name}) - ${event.measurement.duration}ms`
                                    : `React Compiler Error - ${event.fnLoc?.identifierName || "unknown location"}`
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

        if (this.config.react.compiler !== false) {
          this.config.transform.babel ??= {} as BabelResolvedConfig;

          this.config.transform.babel.plugins ??= [];
          this.config.transform.babel.plugins.push([
            "babel-plugin-react-compiler",
            this.config.react.compiler
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
        if (this.environment.consumer === "client") {
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

        if (this.config.build.variant === "vite") {
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

          const viteBuildConfig = this.config.build as ViteResolvedBuildConfig;
          viteBuildConfig.build ??= {};
          viteBuildConfig.build.target = "chrome95";

          viteBuildConfig.plugins ??= [];
          viteBuildConfig.plugins.unshift(
            viteReactPlugin({
              babel: this.config.transform.babel,
              jsxImportSource: this.config.react.jsxImportSource,
              jsxRuntime: this.config.react.jsxRuntime,
              reactRefreshHost: this.config.react.reactRefreshHost
            })
          );
        }

        if (
          this.env?.types?.env &&
          !this.env.types.env.hasProperty("DISABLE_REACT_COMPILER")
        ) {
          this.env.types.env.addProperty({
            name: "DISABLE_REACT_COMPILER",
            optional: true,
            readonly: true,
            description: "Disables the React compiler optimizations.",
            visibility: ReflectionVisibility.public,
            type: {
              kind: ReflectionKind.boolean
            },
            default: false
          });
        }
      },
      async prepare() {
        return this.render(() => (
          <ReactOptimizedBuiltin
            override={this.config.react.compiler === false ? false : undefined}
          />
        ));
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
