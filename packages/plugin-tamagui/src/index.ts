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

import { resolvePackage } from "@stryke/fs/resolve";
import { murmurhash } from "@stryke/hash/neutral";
import { joinPaths } from "@stryke/path/join";
import type { ExtractedResponse, TamaguiOptions } from "@tamagui/static-worker";
import * as Static from "@tamagui/static-worker";
import {
  getPragmaOptions,
  loadTamaguiBuildConfig
} from "@tamagui/static-worker";
import defu from "defu";
import { getConfigPath } from "powerlines/plugin-utils/get-config-path";
import { replacePathTokens } from "powerlines/plugin-utils/paths";
import {
  BuildResolvedConfig,
  ViteResolvedBuildConfig
} from "powerlines/types/build";
import { EnvironmentConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { transformWithEsbuild, ViteDevServer } from "vite";
import { TamaguiPluginContext, TamaguiPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * Tamagui plugin for Powerlines.
 *
 * @param options - The Tamagui plugin user configuration options.
 * @returns A Powerlines plugin that integrates Tamagui into an existing Powerlines project.
 */
export const plugin = <
  TContext extends TamaguiPluginContext = TamaguiPluginContext
>(
  options: TamaguiPluginOptions = {}
): Plugin<TContext> => {
  let memoryCache = {} as Record<string, { code: string; map?: any }>;
  let cacheSize = 0;

  const clearCompilerCache = () => {
    memoryCache = {};
    cacheSize = 0;
  };

  const cssMap = new Map<string, string>();
  let server: ViteDevServer | null = null;

  return {
    name: "tamagui",
    async config() {
      const configPath = getConfigPath(this, "tamagui");

      const tamaguiOptions = await loadTamaguiBuildConfig(
        defu(
          {
            ...options,
            components: [joinPaths("{projectRoot}", "src/components")]
          },
          {
            config: configPath,
            disableExtraction: false,
            platform: "web" as const,
            logTimings:
              this.config.logLevel === "debug" ||
              this.config.logLevel === "trace",
            prefixLogs: "Powerlines"
          } as Partial<TamaguiOptions>
        )
      );

      const alias: BuildResolvedConfig["alias"] = [];
      if (tamaguiOptions.platform !== "native") {
        alias.push({
          find: "react-native/Libraries/Renderer/shims/ReactFabric",
          replacement:
            (await resolvePackage("@tamagui/proxy-worm")) ||
            "@tamagui/proxy-worm"
        });

        alias.push({
          find: "react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry",
          replacement:
            (await resolvePackage("@tamagui/proxy-worm")) ||
            "@tamagui/proxy-worm"
        });
        alias.push({
          find: "react-native-svg",
          replacement:
            (await resolvePackage("react-native-svg")) || "react-native-svg"
        });

        if (tamaguiOptions?.useReactNativeWebLite) {
          alias.push({
            find: "react-native",
            replacement:
              (await resolvePackage("react-native-web-lite")) ||
              "react-native-web-lite"
          });

          const reactNativeWebLite =
            (await resolvePackage(
              tamaguiOptions?.useReactNativeWebLite === "without-animated"
                ? "@tamagui/react-native-web-lite/without-animated"
                : "@tamagui/react-native-web-lite"
            )) || tamaguiOptions?.useReactNativeWebLite === "without-animated"
              ? "@tamagui/react-native-web-lite/without-animated"
              : "@tamagui/react-native-web-lite";
          alias.push({
            find: /^react-native$/,
            replacement: reactNativeWebLite
          });

          alias.push({
            find: /^react-native\/(.+)$/,
            replacement: `${reactNativeWebLite}/$1`
          });
          alias.push({
            find: /^react-native-web$/,
            replacement: reactNativeWebLite
          });
          alias.push({
            find: /^react-native-web\/(.+)$/,
            replacement: `${reactNativeWebLite}/$1`
          });

          alias.push({
            find: /react-native.*\/dist\/exports\/StyleSheet\/compiler\/createReactDOMStyle/,
            replacement:
              (await resolvePackage(
                "@tamagui/react-native-web-lite/dist/exports/StyleSheet/compiler/createReactDOMStyle"
              )) ||
              "@tamagui/react-native-web-lite/dist/exports/StyleSheet/compiler/createReactDOMStyle"
          });
        }
      }

      return {
        tamagui: tamaguiOptions,
        build: {
          platform: "browser",
          extensions: [
            `.web.mjs`,
            `.web.js`,
            `.web.jsx`,
            `.web.ts`,
            `.web.tsx`,
            ".mjs",
            ".js",
            ".mts",
            ".ts",
            ".jsx",
            ".tsx",
            ".json"
          ],
          define: {
            _frameTimestamp: undefined,
            _WORKLET: false,
            __DEV__: `${this.config.mode === "development"}`,
            "process.env.NODE_ENV": JSON.stringify(
              process.env.NODE_ENV || this.config.mode
            ),
            "process.env.ENABLE_RSC": JSON.stringify(
              process.env.ENABLE_RSC || ""
            ),
            "process.env.ENABLE_STEPS": JSON.stringify(
              process.env.ENABLE_STEPS || ""
            ),
            "process.env.IS_STATIC": JSON.stringify(false),
            ...(this.config.mode === "production" && {
              "process.env.TAMAGUI_OPTIMIZE_THEMES": JSON.stringify(true)
            })
          },
          alias
        }
      };
    },
    configEnvironment(name: string, environment: EnvironmentConfig) {
      if (environment.consumer === "client" || name === "client") {
        return {
          build: {
            define: {
              "process.env.TAMAGUI_IS_CLIENT": JSON.stringify(true),
              "process.env.TAMAGUI_ENVIRONMENT": '"client"'
            }
          }
        };
      }

      return null;
    },
    configResolved() {
      if (
        !this.config.tamagui.components ||
        this.config.tamagui.components.length === 0
      ) {
        throw new Error(
          `Tamagui Plugin: No components paths defined in Tamagui configuration. Please ensure that the 'components' option is set correctly.`
        );
      }

      this.config.tamagui.components = this.config.tamagui.components
        .map(path => replacePathTokens(this, path))
        .filter(Boolean);

      if (this.config.build.variant === "vite") {
        (this.config.build as ViteResolvedBuildConfig).optimizeDeps ??= {};
        (this.config.build as ViteResolvedBuildConfig).optimizeDeps!.include ??=
          [];
        (
          this.config.build as ViteResolvedBuildConfig
        ).optimizeDeps!.include!.push("@tamagui/core/inject-styles");
      }
    },
    async resolveId(id: string) {
      if (
        this.environment?.name &&
        (this.environment.name === "ios" || this.environment.name === "android")
      ) {
        return;
      }

      if (
        this.config?.tamagui?.disableServerOptimization &&
        this.environment?.name &&
        this.environment.name !== "client"
      ) {
        // only optimize on client - server should produce identical styles anyway!
        return;
      }

      const [validId, query] = id.split("?");
      if (!validId?.endsWith(".tamagui.css")) {
        return;
      }

      // Absolute paths seem to occur often in monorepos, where files are
      // imported from outside the config root.
      let absoluteId = id;
      if (!id.startsWith(this.config.projectRoot)) {
        absoluteId = joinPaths(this.config.projectRoot, validId);
      }

      // There should always be an entry in the `cssMap` here.
      // The only valid scenario for a missing one is if someone had written
      // a file in their app using the .tamagui.js/.tamagui.css extension
      if (cssMap.has(absoluteId)) {
        // Keep the original query string for HMR.
        return absoluteId + (query ? `?${query}` : "");
      }

      return null;
    },
    async load(id) {
      if (this.config?.tamagui?.disableExtraction) {
        // only optimize on client - server should produce identical styles anyway!
        return;
      }

      if (
        this.environment?.name &&
        (this.environment.name === "ios" || this.environment.name === "android")
      ) {
        return;
      }

      if (
        this.config?.tamagui?.disableServerOptimization &&
        this.environment?.name &&
        this.environment.name !== "client"
      ) {
        return;
      }

      const [validId] = id.split("?");

      return validId ? cssMap.get(validId) : null;
    },
    transform: {
      order: "pre",
      async handler(code, id) {
        if (id.includes("expo-linear-gradient")) {
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic"
          });
        }

        if (this.config?.tamagui?.disableExtraction) {
          // only optimize on client - server should produce identical styles anyway!
          return;
        }

        if (
          this.environment?.name &&
          (this.environment.name === "ios" ||
            this.environment.name === "android")
        ) {
          return;
        }

        if (
          this.config?.tamagui?.disableServerOptimization &&
          this.environment?.name &&
          this.environment.name !== "client"
        ) {
          return;
        }

        const [validId] = id.split("?");
        if (!validId?.endsWith(".tsx")) {
          return;
        }

        const firstCommentIndex = code.indexOf("// ");
        const { shouldDisable, shouldPrintDebug } = await getPragmaOptions({
          source: firstCommentIndex >= 0 ? code.slice(firstCommentIndex) : "",
          path: validId
        });

        if (shouldPrintDebug) {
          this.trace(
            `Current file: ${id} in environment: ${this.environment?.name}, shouldDisable: ${shouldDisable}\n\nOriginal source:\n${code}\n\n`
          );
        }

        if (shouldDisable) {
          return;
        }

        const cacheKey = murmurhash({
          cacheEnv:
            this.environment.name === "client" ||
            this.environment.name === "ssr"
              ? // same cache key for ssr and web since they are the same
                "web"
              : this.environment.name,
          code,
          id
        });

        const cached = memoryCache[cacheKey];
        if (cached) {
          return cached;
        }

        let extracted: ExtractedResponse | null;
        try {
          extracted = await Static.extractToClassNames({
            source: code,
            sourcePath: validId,
            options: this.config.tamagui,
            shouldPrintDebug
          });
        } catch (err) {
          // Log the error but don't fail the build - just skip optimization
          this.error(err instanceof Error ? err.message : String(err));
          return;
        }

        if (!extracted) {
          return;
        }

        const rootRelativeId = `${validId}.tamagui.css`;

        let absoluteId = rootRelativeId;
        if (!absoluteId.startsWith(this.config.projectRoot)) {
          absoluteId = joinPaths(this.config.projectRoot, rootRelativeId);
        }

        let source = extracted.js;
        if (extracted.styles) {
          this.addWatchFile(rootRelativeId);

          if (server && cssMap.has(absoluteId)) {
            if (server) {
              const { moduleGraph } = server;
              const modules = moduleGraph.getModulesByFile(rootRelativeId);

              if (modules) {
                for (const module of modules) {
                  moduleGraph.invalidateModule(module);

                  // Vite uses this timestamp to add `?t=` query string automatically for HMR.
                  module.lastHMRTimestamp =
                    module.lastInvalidationTimestamp || Date.now();
                }
              }
            }
          }

          source = `${source.toString()}\nimport "${rootRelativeId}";`;
          cssMap.set(absoluteId, extracted.styles);
        }

        const result = {
          code: source.toString(),
          map: extracted.map
        };

        cacheSize += result.code.length;
        // ~50Mb cache for recently compiler files
        if (cacheSize > 26214400) {
          clearCompilerCache();
        }

        memoryCache[cacheKey] = result;

        return result;
      }
    },
    async finalize() {
      // Only destroy the pool at the very end of the entire build
      await Static?.destroyPool();
    },
    vite: {
      configureServer(_server) {
        server = _server;
      }
    }
  } as Plugin<TContext>;
};

export default plugin;
