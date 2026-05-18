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
  CustomLogger,
  ExecutionContext,
  Options,
  UnpluginBuilderVariant,
  UnpluginOptions
} from "@powerlines/core";
import {
  formatFolder,
  handleTypes,
  initializeTsconfig,
  installDependencies,
  isUnpluginBuilderVariant,
  loadParsedConfig,
  resolveRoot,
  resolveTsconfig,
  writeMetaFile
} from "@powerlines/core";
import { UNPLUGIN_BUILDER_VARIANTS } from "@powerlines/core/constants";
import { PowerlinesExecutionContext } from "@powerlines/core/context/execution-context";
import { resolvePluginConfig } from "@powerlines/core/lib/context-helpers";
import { executeEnvironments } from "@powerlines/core/lib/environment";
import { getString } from "@powerlines/core/lib/utilities/source-file";
import {
  addVirtualPrefix,
  formatConfig,
  removeVirtualPrefix,
  VIRTUAL_MODULE_PREFIX_REGEX
} from "@powerlines/core/plugin-utils";
import { toArray } from "@stryke/convert/to-array";
import { getWorkspaceRoot } from "@stryke/fs/get-workspace-root";
import { createDirectory } from "@stryke/fs/helpers";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { uuid } from "@stryke/unique-id/uuid";
import { LoadResult } from "rolldown";
import type {
  TransformResult,
  UnpluginBuildContext,
  UnpluginContext
} from "unplugin";
import { UnpluginFactory } from "./types";

export * from "@powerlines/core/lib/unplugin";

/**
 * The options required to create a Powerlines unplugin factory, which generates a plugin instance for a specific build variant and allows for optional customization of logging and framework identification.
 */
export interface UnpluginFactoryOptions extends Options {
  /**
   * The build variant for which to create the unplugin.
   *
   * @remarks
   * This option is required to ensure that the unplugin is built with the correct configuration and behavior for the intended build tool or framework. The variant will determine how the unplugin integrates with the build process and which hooks it will call during execution.
   */
  variant: UnpluginBuilderVariant;

  /**
   * An optional string prefix to use for virtual module IDs. This can be useful for ensuring that virtual modules are only processed by the plugin and not by other plugins or the bundler itself. If not provided, the default prefix `__powerlines-virtual:` will be used.
   *
   * @defaultValue "\\0"
   */
  virtualModulePrefix?: string | false;

  /**
   * A custom logger instance that implements the {@link CustomLogger} interface, which can be used for logging messages during the build process instead of the default Powerlines logger.
   *
   * @remarks
   * Providing a custom logger allows you to integrate Powerlines logging with your own logging system or to customize the logging behavior, such as formatting log messages differently or sending logs to an external service. If a custom logger is not provided, Powerlines will use its default logger implementation.
   */
  customLogger?: CustomLogger;
}

export type UnpluginFactoryDecorator<TContext extends ExecutionContext> = (
  options: UnpluginOptions<TContext>
) => Partial<UnpluginOptions<TContext>>;

/**
 * Creates a Powerlines unplugin factory that generates a plugin instance.
 *
 * @remarks
 * The factory will handle loading the Powerlines configuration, resolving the plugin configuration, and executing the appropriate hooks during the build process. It also allows for optional customization of logging and framework identification through the provided options.
 *
 * @example
 * ```ts
 * import { createUnpluginFactory } from "@powerlines/unplugin";
 *
 * const factory = createUnpluginFactory({
 *  variant: "vite",
 *  framework: "my-framework",
 *  orgId: "my-org",
 *  customLogger: myCustomLogger
 * });
 *
 * const plugin = createVitePlugin(factory);
 * export default plugin;
 * ```
 *
 * @param options - The options for the unplugin factory, including the build variant and an optional custom logger.
 * @param decorate - An optional function to decorate the unplugin options.
 * @returns The unplugin factory that generates a plugin instance.
 */
export function createUnpluginFactory<
  TContext extends ExecutionContext = ExecutionContext
>(
  options: UnpluginFactoryOptions,
  decorate: UnpluginFactoryDecorator<TContext> = options => options
): UnpluginFactory<TContext> {
  if (!isUnpluginBuilderVariant(options.variant)) {
    throw new Error(
      `Invalid unplugin builder variant: ${String(options.variant)}. Expected one of: ${UNPLUGIN_BUILDER_VARIANTS.join(
        ", "
      )}.`
    );
  }

  const cwd = getWorkspaceRoot(process.cwd());
  const virtualModulePrefix = options.virtualModulePrefix ?? "\\0";

  return (params = {}): UnpluginOptions<TContext> => {
    let context!: PowerlinesExecutionContext<
      TContext["config"],
      TContext["system"]
    >;
    try {
      const framework =
        (params.framework?.name ?? options.framework?.name) || "powerlines";
      const orgId =
        (params.framework?.orgId ?? options.framework?.orgId) ||
        "storm-software";

      const root = resolveRoot(cwd, params.root, params.configFile);

      async function buildStart(this: UnpluginBuildContext): Promise<void> {
        const config = await loadParsedConfig(cwd, root, framework, orgId, {
          ...params,
          command: "build"
        });
        if (!config) {
          throw new Error("Failed to load configuration");
        }

        const configs = toArray(config.config);
        if (
          params.configIndex !== undefined &&
          params.configIndex >= configs.length
        ) {
          throw new Error(
            `Invalid execution index: ${params.configIndex}. The configuration file contains ${configs.length} execution(s).`
          );
        }

        const _options = {
          cwd,
          root,
          ...params,
          command: "build",
          configFile: config.configFile!,
          executionId: uuid(),
          configIndex: 0
        };

        context = await PowerlinesExecutionContext.from(
          {
            ...options,
            ..._options,
            configFile: config.configFile!
          },
          _options
        );
        context.logger.info(
          `Starting ${titleCase(framework)} ${titleCase(options.variant)} plugin execution`
        );

        context.logger.debug({
          meta: { category: "config" },
          message: `Invoking ${titleCase(framework)} ${titleCase(
            options.variant
          )} plugin with the following execution parameters: \n --- Execution Options --- \n${formatConfig(
            params
          )}`
        });

        await resolvePluginConfig(context);

        const timer = context.timer("Preparation");

        await executeEnvironments(context, async env => {
          env.debug(
            `Initializing the processing options for the Powerlines project.`
          );

          await context.callHook("configResolved", {
            environment: env,
            order: "pre"
          });

          await initializeTsconfig(env);

          await context.callHook("configResolved", {
            environment: env,
            order: "normal"
          });

          if (env.entry.length > 0) {
            env.debug(
              `The configuration provided ${
                isObject(env.config.input)
                  ? Object.keys(env.config.input).length
                  : toArray(env.config.input).length
              } entry point(s), Powerlines has found ${
                env.entry.length
              } entry files(s) for the ${env.config.title} project${
                env.entry.length > 0 && env.entry.length < 10
                  ? `: \n${env.entry
                      .map(
                        entry =>
                          `- ${entry.file}${
                            entry.output ? ` -> ${entry.output}` : ""
                          }`
                      )
                      .join(" \n")}`
                  : ""
              }`
            );
          } else {
            env.warn(
              `No entry files were found for the ${
                env.config.title
              } project. Please ensure this is correct. Powerlines plugins generally require at least one entry point to function properly.`
            );
          }

          await resolveTsconfig(env);
          await installDependencies(env);

          await context.callHook("configResolved", {
            environment: env,
            order: "post"
          });

          env.trace({
            meta: {
              category: "config"
            },
            message: `Powerlines configuration after configResolved hook: \n${formatConfig(
              env.config
            )}`
          });

          if (!env.fs.existsSync(env.cachePath)) {
            await createDirectory(env.cachePath);
          }

          if (!env.fs.existsSync(env.dataPath)) {
            await createDirectory(env.dataPath);
          }

          await context.callHook("prepare", {
            environment: env,
            order: "pre"
          });
          await context.callHook("prepare", {
            environment: env,
            order: "normal"
          });

          await context.callHook("prepare", {
            environment: env,
            order: "post"
          });

          if (env.config.output.types !== false) {
            await handleTypes(context, env);
          }

          context.debug("Formatting files generated during the prepare step.");

          await Promise.all([
            formatFolder(env, env.builtinsPath),
            formatFolder(env, env.entryPath)
          ]);

          await writeMetaFile(env);
          env.persistedMeta = env.meta;
        });

        timer();
      }

      async function resolveId(
        this: UnpluginBuildContext & UnpluginContext,
        id: string,
        importer?: string,
        opts: {
          isEntry: boolean;
        } = { isEntry: false }
      ) {
        const normalizedId = removeVirtualPrefix(id);
        const normalizedImporter = importer
          ? removeVirtualPrefix(importer)
          : undefined;

        let result = await context.callHook(
          "resolveId",
          {
            sequential: true,
            result: "first",
            order: "pre"
          },
          normalizedId,
          normalizedImporter,
          opts
        );
        if (isSetString(result)) {
          return result;
        } else if (isSetObject(result)) {
          return {
            ...result,
            id:
              result.virtual && virtualModulePrefix !== false
                ? addVirtualPrefix(result.id)
                : result.id
          };
        }

        result = await context.callHook(
          "resolveId",
          {
            sequential: true,
            result: "first",
            order: "normal"
          },
          normalizedId,
          normalizedImporter,
          opts
        );
        if (isSetString(result)) {
          return result;
        } else if (isSetObject(result)) {
          return {
            ...result,
            id:
              result.virtual && virtualModulePrefix !== false
                ? addVirtualPrefix(result.id)
                : result.id
          };
        }

        result = await context.resolve(normalizedId, normalizedImporter, {
          isFile: true,
          ...opts
        });
        if (isSetObject(result)) {
          return {
            ...result,
            id:
              result.virtual && virtualModulePrefix !== false
                ? addVirtualPrefix(result.id)
                : result.id
          };
        }

        result = await context.callHook(
          "resolveId",
          {
            sequential: true,
            result: "first",
            order: "post"
          },
          normalizedId,
          normalizedImporter,
          opts
        );
        if (isSetString(result)) {
          return result;
        } else if (isSetObject(result)) {
          return {
            ...result,
            id:
              result.virtual && virtualModulePrefix !== false
                ? addVirtualPrefix(result.id)
                : result.id
          };
        }

        return null;
      }

      const load = {
        filter:
          virtualModulePrefix !== false
            ? {
                id: VIRTUAL_MODULE_PREFIX_REGEX
              }
            : undefined,
        async handler(
          this: UnpluginBuildContext & UnpluginContext,
          id: string
        ): Promise<LoadResult | null | undefined> {
          const normalizedId = removeVirtualPrefix(id);

          let result = await context.callHook(
            "load",
            {
              sequential: true,
              result: "first",
              order: "pre"
            },
            normalizedId
          );
          if (result) {
            return result;
          }

          result = await context.callHook(
            "load",
            {
              sequential: true,
              result: "first",
              order: "normal"
            },
            normalizedId
          );
          if (result) {
            return result;
          }

          result = await context.load(normalizedId);
          if (result) {
            return result;
          }

          return context.callHook(
            "load",
            {
              sequential: true,
              result: "first",
              order: "post"
            },
            normalizedId
          );
        }
      } as UnpluginOptions<TContext>["load"];

      async function transform(
        code: string,
        id: string
      ): Promise<TransformResult> {
        return context.callHook(
          "transform",
          {
            environment: await context.getEnvironment(),
            result: "merge",
            asNextParam: previousResult => getString(previousResult)
          },
          getString(code),
          id
        );
      }

      async function writeBundle(): Promise<void> {
        context.logger.debug("Finalizing Powerlines project output...");

        await context.callHook("writeBundle", {
          environment: await context.getEnvironment()
        });
      }

      context.logger.debug("Unplugin initialized successfully.");

      const result = {
        name: `${kebabCase(framework)}:${kebabCase(options.variant)}-plugin`,
        context,
        resolveId,
        load,
        transform,
        buildStart,
        writeBundle
      } as unknown as UnpluginOptions<TContext>;

      return {
        ...result,
        ...decorate(result)
      };
    } catch (error) {
      if (isFunction(context?.logger?.error)) {
        context.logger.error((error as Error)?.message);
      }

      throw error;
    }
  };
}
