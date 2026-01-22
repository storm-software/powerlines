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

import { appendPath } from "@stryke/path/append";
import defu from "defu";
import { createNitro } from "nitro/builder";
import { NitroConfig } from "nitro/types";
import { getConfigPath } from "powerlines/plugin-utils/get-config-path";
import { Plugin } from "powerlines/types/plugin";
import {
  NitroContext,
  NitroPluginContext,
  NitroPluginOptions,
  NitroPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate with Nitro.
 */
export const plugin = <
  TContext extends NitroPluginContext = NitroPluginContext
>(
  options: NitroPluginOptions = {}
) => {
  return [
    // nitroInit(options),
    // nitroEnv(options),
    // nitroMain(options),
    // nitroPrepare(options),
    // nitroService(options),
    // nitroPreviewPlugin(options),
    {
      name: "nitro:config",
      async config() {
        this.debug(
          "Providing default configuration for the Powerlines `nitro` plugin."
        );

        let configFile = options.configFile;
        if (!configFile) {
          configFile = getConfigPath(this, "nitro");
        }

        return {
          nitro: {
            configFile: configFile
              ? appendPath(configFile, this.workspaceConfig.workspaceRoot)
              : undefined,
            ...options
          }
        } as NitroPluginUserConfig;
      },
      configResolved() {
        this.config.nitro.compatibilityDate = this.config.compatibilityDate;
        this.config.nitro.workspaceDir = this.workspaceConfig.workspaceRoot;

        this.config.nitro.alias = this.config.build
          .alias as NitroConfig["alias"];

        switch (this.config.logLevel) {
          case "error":
            this.config.nitro.logLevel = 1;
            break;
          case "warn":
            this.config.nitro.logLevel = 2;
            break;
          case "info":
            this.config.nitro.logLevel = 3;
            break;
          case "debug":
            this.config.nitro.logLevel = 4;
            break;
          case "trace":
            this.config.nitro.logLevel = 5;
            break;
          case null:
            this.config.nitro.logLevel = 0;
            break;
          default:
            this.config.nitro.logLevel = 2;
            break;
        }
      }
    },
    {
      name: "nitro:init",
      configResolved: {
        order: "post",
        async handler() {
          this.nitro ??= {} as NitroContext;
          this.nitro.nitro = await createNitro(this.config.nitro);
        }
      }
    },
    {
      name: "nitro:vite",
      vite: {
        config(_, configEnv) {
          this.config.nitro.dev = configEnv.command === "serve";
          this.config.nitro.builder = "vite";
          this.config.nitro.rootDir = this.config.projectRoot;
          this.config.nitro = defu(
            this.config.nitro,
            this.config
          ) as NitroConfig;
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;

// function nitroInit(
//   options: NitroPluginOptions = {}
// ): Plugin<NitroPluginContext> {
//   return {
//     name: "nitro:init",
//     sharedDuringBuild: true,

//     async config(config, configEnv) {
//       this.isRolldown = !!(this.meta as Record<string, string>).rolldownVersion;
//       if (!this.isInitialized) {
//         debug("[init] Initializing nitro");
//         this.isInitialized = true;
//         await setupNitroContext(this, configEnv, config);
//       }
//     },

//     applyToEnvironment(env) {
//       if (env.name === "nitro" && ctx.nitro?.options.dev) {
//         debug("[init] Adding rollup plugins for dev");
//         return [...((ctx.rollupConfig?.config.plugins as VitePlugin[]) || [])];
//       }
//     },
//     vite: {
//       apply: (_, configEnv) => !configEnv.isPreview
//     }
//   };
// }

// function nitroEnv(ctx: NitroPluginContext): VitePlugin {
//   return {
//     name: "nitro:env",
//     sharedDuringBuild: true,
//     apply: (_config, configEnv) => !configEnv.isPreview,

//     async config(userConfig, _configEnv) {
//       debug("[env]  Extending config (environments)");
//       const environments: Record<string, EnvironmentOptions> = {
//         ...createServiceEnvironments(ctx),
//         nitro: createNitroEnvironment(ctx)
//       };
//       environments.client = {
//         consumer: userConfig.environments?.client?.consumer ?? "client",
//         build: {
//           rollupOptions: {
//             input:
//               userConfig.environments?.client?.build?.rollupOptions?.input ??
//               useNitro(ctx).options.renderer?.template
//           }
//         }
//       };
//       debug("[env]  Environments:", Object.keys(environments).join(", "));
//       return {
//         environments
//       };
//     },

//     configEnvironment(name, config) {
//       if (config.consumer === "client") {
//         debug(
//           "[env]  Configuring client environment",
//           name === "client" ? "" : ` (${name})`
//         );
//         config.build!.emptyOutDir = false;
//         config.build!.outDir = useNitro(ctx).options.output.publicDir;
//       }
//     }
//   };
// }

// function nitroMain(ctx: NitroPluginContext): VitePlugin {
//   return {
//     name: "nitro:main",
//     sharedDuringBuild: true,
//     apply: (_config, configEnv) => !configEnv.isPreview,

//     async config(userConfig, _configEnv) {
//       debug("[main] Extending config (appType, resolve, server)");
//       if (!ctx.rollupConfig) {
//         throw new Error("Nitro rollup config is not initialized yet.");
//       }
//       return {
//         appType: userConfig.appType || "custom",
//         resolve: {
//           // TODO: environment specific aliases not working
//           // https://github.com/vitejs/vite/pull/17583 (seems not effective)
//           alias: ctx.rollupConfig.base.aliases
//         },
//         builder: {
//           sharedConfigBuild: true
//         },
//         server: {
//           port:
//             Number.parseInt(process.env.PORT || "") ||
//             userConfig.server?.port ||
//             useNitro(ctx).options.devServer?.port ||
//             3000,
//           // #3673, disable Vite's `cors` by default as Nitro handles all requests
//           cors: false
//         }
//       };
//     },

//     buildApp: {
//       order: "post",
//       handler(builder) {
//         debug("[main] Building environments");
//         return buildEnvironments(ctx, builder);
//       }
//     },

//     generateBundle: {
//       handler(_options, bundle) {
//         const environment = this.environment;
//         debug(
//           "[main] Generating manifest and entry points for environment:",
//           environment.name
//         );
//         const serviceNames = Object.keys(ctx.services);
//         const isRegisteredService = serviceNames.includes(environment.name);

//         // Find entry point of this service
//         let entryFile: string | undefined;
//         for (const [_name, file] of Object.entries(bundle)) {
//           if (file.type === "chunk" && isRegisteredService && file.isEntry) {
//             if (entryFile === undefined) {
//               entryFile = file.fileName;
//             } else {
//               this.warn(
//                 `Multiple entry points found for service "${environment.name}"`
//               );
//             }
//           }
//         }
//         if (isRegisteredService) {
//           if (entryFile === undefined) {
//             this.error(
//               `No entry point found for service "${this.environment.name}".`
//             );
//           }
//           ctx._entryPoints![this.environment.name] = entryFile!;
//         }
//       }
//     },

//     configureServer: server => {
//       debug("[main] Configuring dev server");
//       return configureViteDevServer(ctx, server);
//     },

//     // Automatically reload the client when a server module is updated
//     // see: https://github.com/vitejs/vite/issues/19114
//     async hotUpdate({ server, modules, timestamp }) {
//       const env = this.environment;
//       if (
//         ctx.pluginConfig.experimental?.vite.serverReload === false ||
//         env.config.consumer === "client"
//       ) {
//         return;
//       }
//       const clientEnvs = Object.values(server.environments).filter(
//         env => env.config.consumer === "client"
//       );
//       let hasServerOnlyModule = false;
//       const invalidated = new Set<EnvironmentModuleNode>();
//       for (const mod of modules) {
//         if (
//           mod.id &&
//           !clientEnvs.some(env => env.moduleGraph.getModuleById(mod.id))
//         ) {
//           hasServerOnlyModule = true;
//           env.moduleGraph.invalidateModule(mod, invalidated, timestamp, false);
//         }
//       }
//       if (hasServerOnlyModule) {
//         env.hot.send({ type: "full-reload" });
//         server.ws.send({ type: "full-reload" });
//         return [];
//       }
//     }
//   };
// }

// function nitroPrepare(ctx: NitroPluginContext): VitePlugin {
//   return {
//     name: "nitro:prepare",
//     sharedDuringBuild: true,
//     applyToEnvironment: env => env.name === "nitro",

//     buildApp: {
//       // Clean the output directory before any environment is built
//       order: "pre",
//       async handler() {
//         debug("[prepare] Preparing output directory");
//         const nitro = ctx.nitro;
//         await prepare(nitro);
//       }
//     }
//   };
// }

// function nitroService(ctx: NitroPluginContext): VitePlugin {
//   return {
//     name: "nitro:service",
//     enforce: "pre",
//     sharedDuringBuild: true,
//     applyToEnvironment: env => env.name === "nitro",

//     resolveId: {
//       filter: { id: /^#nitro-vite-setup$/ },
//       async handler(id) {
//         // Virtual modules
//         if (id === "#nitro-vite-setup") {
//           return { id, moduleSideEffects: true };
//         }
//       }
//     },

//     load: {
//       filter: { id: /^#nitro-vite-setup$/ },
//       async handler(id) {
//         // Virtual modules
//         if (id === "#nitro-vite-setup") {
//           return prodSetup(ctx);
//         }
//       }
//     }
//   };
// }
