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

import type { ArrayValues } from "@stryke/types/array";
import type { FunctionLike, MaybePromise } from "@stryke/types/base";
import type {
  ExternalIdResult,
  HookFilter,
  TransformResult,
  UnpluginOptions
} from "unplugin";
import type { UnpluginBuildVariant } from "./build";
import type { CommandType } from "./commands";
import type { EnvironmentConfig, PluginConfig } from "./config";
import type {
  BuildPluginContext,
  PluginContext,
  UnresolvedContext
} from "./context";
import type { EnvironmentResolvedConfig, ResolvedConfig } from "./resolved";

export interface PluginHookObject<
  THookFunction extends FunctionLike,
  TFilter extends keyof HookFilter = never
> {
  /**
   * The order in which the plugin should be applied.
   */
  order?: "pre" | "post" | null | undefined;

  /**
   * A filter to determine when the hook should be called.
   */
  filter?: Pick<HookFilter, TFilter>;

  /**
   * The hook function to be called.
   */
  handler: THookFunction;
}

export type PluginHook<
  THookFunction extends FunctionLike,
  TFilter extends keyof HookFilter = never
> = THookFunction | PluginHookObject<THookFunction, TFilter>;

/**
 * A result returned by the plugin from the `generateTypes` hook that describes the declaration types output file.
 */
export interface GenerateTypesResult {
  directives?: string[];
  code: string;
}

type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

export type ConfigResult<TContext extends PluginContext = PluginContext> =
  DeepPartial<TContext["config"]> & Record<string, any>;

export interface BasePluginHookFunctions<
  TContext extends PluginContext = PluginContext
> extends Record<CommandType, (this: TContext) => MaybePromise<void>> {
  /**
   * A function that returns configuration options to be merged with the build context's options.
   *
   * @remarks
   * Modify config before it's resolved. The hook can either mutate {@link Context.config} on the passed-in context directly, or return a partial config object that will be deeply merged into existing config.
   *
   * @warning User plugins are resolved before running this hook so injecting other plugins inside the config hook will have no effect. If you want to add plugins, consider doing so in the {@link Plugin.dependsOn} property instead.
   *
   * @see https://vitejs.dev/guide/api-plugin#config
   *
   * @param this - The build context.
   * @param config - The partial configuration object to be modified.
   * @returns A promise that resolves to a partial configuration object.
   */
  config: (
    this: UnresolvedContext<TContext["config"]>
  ) => MaybePromise<ConfigResult<TContext>>;

  /**
   * Modify environment configs before it's resolved. The hook can either mutate the passed-in environment config directly, or return a partial config object that will be deeply merged into existing config.
   *
   * @remarks
   * This hook is called for each environment with a partially resolved environment config that already accounts for the default environment config values set at the root level. If plugins need to modify the config of a given environment, they should do it in this hook instead of the config hook. Leaving the config hook only for modifying the root default environment config.
   *
   * @see https://vitejs.dev/guide/api-plugin#configenvironment
   *
   * @param this - The build context.
   * @param name - The name of the environment being configured.
   * @param environment - The Vite-like environment object containing information about the current build environment.
   * @returns A promise that resolves when the hook is complete.
   */
  configEnvironment: (
    this: TContext,
    name: string,
    environment: EnvironmentConfig
  ) => MaybePromise<Partial<EnvironmentResolvedConfig> | undefined | null>;

  /**
   * A hook that is called when the plugin is resolved.
   *
   * @see https://vitejs.dev/guide/api-plugin#configresolved
   *
   * @param this - The build context.
   * @returns A promise that resolves when the hook is complete.
   */
  configResolved: (this: TContext) => MaybePromise<void>;

  /**
   * A hook that is called to overwrite the generated declaration types file (.d.ts). The generated type definitions should describe the built-in modules/logic added during the `prepare` task.
   *
   * @param this - The build context.
   * @param code - The source code to generate types for.
   * @returns A promise that resolves when the hook is complete.
   */
  generateTypes: (
    this: TContext,
    code: string
  ) => MaybePromise<GenerateTypesResult | string | undefined | null>;

  /**
   * A hook that is called at the start of the build process.
   *
   * @param this - The build context and unplugin build context.
   * @returns A promise that resolves when the hook is complete.
   */
  buildStart: (
    this: BuildPluginContext<TContext["config"]> & TContext
  ) => MaybePromise<void>;

  /**
   * A hook that is called at the end of the build process.
   *
   * @param this - The build context and unplugin build context.
   * @returns A promise that resolves when the hook is complete.
   */
  buildEnd: (
    this: BuildPluginContext<TContext["config"]> & TContext
  ) => MaybePromise<void>;

  /**
   * A hook that is called to transform the source code.
   *
   * @param this - The build context, unplugin build context, and unplugin context.
   * @param code - The source code to transform.
   * @param id - The identifier of the source code.
   * @returns A promise that resolves when the hook is complete.
   */
  transform: (
    this: BuildPluginContext<TContext["config"]> & TContext,
    code: string,
    id: string
  ) => MaybePromise<TransformResult>;

  /**
   * A hook that is called to load the source code.
   *
   * @param this - The build context, unplugin build context, and unplugin context.
   * @param id - The identifier of the source code.
   * @returns A promise that resolves when the hook is complete.
   */
  load: (
    this: BuildPluginContext<TContext["config"]> & TContext,
    id: string
  ) => MaybePromise<TransformResult>;

  /**
   * A hook that is called to resolve the identifier of the source code.
   *
   * @param this - The build context, unplugin build context, and unplugin context.
   * @param id - The identifier of the source code.
   * @param importer - The importer of the source code.
   * @param options - The options for resolving the identifier.
   * @returns A promise that resolves when the hook is complete.
   */
  resolveId: (
    this: BuildPluginContext<TContext["config"]> & TContext,
    id: string,
    importer: string | undefined,
    options: { isEntry: boolean }
  ) => MaybePromise<string | ExternalIdResult | null | undefined>;

  /**
   * A hook that is called to write the bundle to disk.
   *
   * @param this - The build context.
   * @returns A promise that resolves when the hook is complete.
   */
  writeBundle: (this: TContext) => MaybePromise<void>;
}

export type BuildPlugin<
  TContext extends PluginContext = PluginContext,
  TBuildVariant extends UnpluginBuildVariant = UnpluginBuildVariant,
  TOptions extends
    Required<UnpluginOptions>[TBuildVariant] = Required<UnpluginOptions>[TBuildVariant]
> = {
  [TKey in keyof TOptions]: TOptions[TKey] extends FunctionLike
    ? (
        this: ThisParameterType<TOptions[TKey]> & TContext,
        ...args: Parameters<TOptions[TKey]>
      ) => ReturnType<TOptions[TKey]> | MaybePromise<ReturnType<TOptions[TKey]>>
    : TOptions[TKey];
};

export type ExternalPluginHookFunctionsVariant<
  TContext extends PluginContext = PluginContext,
  TBuildVariant extends UnpluginBuildVariant = UnpluginBuildVariant
> = {
  [TKey in keyof BuildPlugin<TContext, TBuildVariant> &
    string as `${TBuildVariant}:${TKey}`]: BuildPlugin<
    TContext,
    TBuildVariant
  >[TKey];
};

export type ExternalPluginHookFunctions<TContext extends PluginContext> =
  ExternalPluginHookFunctionsVariant<TContext, "vite"> &
    ExternalPluginHookFunctionsVariant<TContext, "esbuild"> &
    ExternalPluginHookFunctionsVariant<TContext, "rolldown"> &
    ExternalPluginHookFunctionsVariant<TContext, "rollup"> &
    ExternalPluginHookFunctionsVariant<TContext, "webpack"> &
    ExternalPluginHookFunctionsVariant<TContext, "rspack"> &
    ExternalPluginHookFunctionsVariant<TContext, "farm">;

export type PluginHookFunctions<
  TContext extends PluginContext = PluginContext
> = BasePluginHookFunctions<TContext> & ExternalPluginHookFunctions<TContext>;

export type PluginHooks<TContext extends PluginContext = PluginContext> = {
  [TKey in keyof BasePluginHookFunctions<TContext>]: PluginHook<
    BasePluginHookFunctions<TContext>[TKey]
  >;
} & {
  /**
   * A function that returns configuration options to be merged with the build context's options.
   *
   * @remarks
   * Modify config before it's resolved. The hook can either mutate {@link Context.config} on the passed-in context directly, or return a partial config object that will be deeply merged into existing config.
   *
   * @warning User plugins are resolved before running this hook so injecting other plugins inside the config hook will have no effect. If you want to add plugins, consider doing so in the {@link Plugin.dependsOn} property instead.
   *
   * @see https://vitejs.dev/guide/api-plugin#config
   *
   * @param this - The build context.
   * @param config - The partial configuration object to be modified.
   * @returns A promise that resolves to a partial configuration object.
   */
  config:
    | PluginHook<
        (
          this: UnresolvedContext<TContext["config"]>
        ) => MaybePromise<ConfigResult<TContext>>
      >
    | ConfigResult<TContext>;

  /**
   * A hook that is called to transform the source code.
   *
   * @param this - The build context, unplugin build context, and unplugin context.
   * @param code - The source code to transform.
   * @param id - The identifier of the source code.
   * @returns A promise that resolves when the hook is complete.
   */
  transform: PluginHook<
    (
      this: BuildPluginContext<TContext["config"]> & TContext,
      code: string,
      id: string
    ) => MaybePromise<TransformResult>,
    "code" | "id"
  >;

  /**
   * A hook that is called to load the source code.
   *
   * @param this - The build context, unplugin build context, and unplugin context.
   * @param id - The identifier of the source code.
   * @returns A promise that resolves when the hook is complete.
   */
  load: PluginHook<
    (
      this: BuildPluginContext<TContext["config"]> & TContext,
      id: string
    ) => MaybePromise<TransformResult>,
    "id"
  >;

  /**
   * A hook that is called to resolve the identifier of the source code.
   *
   * @param this - The build context, unplugin build context, and unplugin context.
   * @param id - The identifier of the source code.
   * @param importer - The importer of the source code.
   * @param options - The options for resolving the identifier.
   * @returns A promise that resolves when the hook is complete.
   */
  resolveId: PluginHook<
    (
      this: BuildPluginContext<TContext["config"]> & TContext,
      id: string,
      importer: string | undefined,
      options: { isEntry: boolean }
    ) => MaybePromise<string | ExternalIdResult | null | undefined>,
    "id"
  >;

  /**
   * An API object that can be used for inter-plugin communication.
   *
   * @see https://rollupjs.org/plugin-development/#direct-plugin-communication
   */
  api?: Record<string, any>;
};

export type PluginBuildPlugins<TContext extends PluginContext = PluginContext> =
  {
    [TBuildVariant in UnpluginBuildVariant]?: BuildPlugin<
      TContext,
      TBuildVariant
    >;
  };

export interface Plugin<
  TContext extends PluginContext<ResolvedConfig> = PluginContext<ResolvedConfig>
> extends Partial<PluginHooks<TContext>>,
    PluginBuildPlugins<TContext> {
  /**
   * The name of the plugin, for use in deduplication, error messages and logs.
   */
  name: string;

  /**
   * Enforce plugin invocation tier similar to webpack loaders. Hooks ordering is still subject to the `order` property in the hook object.
   *
   * @remarks
   * The Plugin invocation order is as follows:
   * - `enforce: 'pre'` plugins
   * - `order: 'pre'` plugin hooks
   * - any other plugins (normal)
   * - `order: 'post'` plugin hooks
   * - `enforce: 'post'` plugins
   *
   * @see https://vitejs.dev/guide/api-plugin.html#plugin-ordering
   * @see https://rollupjs.org/plugin-development/#build-hooks
   * @see https://webpack.js.org/concepts/loaders/#enforce---pre-and-post
   * @see https://esbuild.github.io/plugins/#concepts
   */
  enforce?: "pre" | "post";

  /**
   * A function to determine if two plugins are the same and can be de-duplicated.
   *
   * @remarks
   * If this is not provided, plugins are de-duplicated by comparing their names.
   *
   * @param other - The other plugin to compare against.
   * @returns `true` if the two plugins are the same, `false` otherwise.
   */
  dedupe?: false | ((other: Plugin<TContext>) => boolean);

  /**
   * A list of pre-requisite plugins that must be loaded before this plugin can be used.
   */
  dependsOn?: PluginConfig<any>[];

  /**
   * Define environments where this plugin should be active. By default, the plugin is active in all environments.
   *
   * @param environment - The environment to check.
   * @returns `true` if the plugin should be active in the specified environment, `false` otherwise.
   */
  applyToEnvironment?: (
    environment: EnvironmentResolvedConfig
  ) => MaybePromise<boolean | Plugin<TContext>>;
}

export const PLUGIN_NON_HOOK_FIELDS = [
  "name",
  "enforce",
  "dedupe",
  "dependsOn",
  "applyToEnvironment"
] as const;

export type PluginNonHookFields =
  | ArrayValues<typeof PLUGIN_NON_HOOK_FIELDS>
  | UnpluginBuildVariant;
