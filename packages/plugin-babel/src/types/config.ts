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
  ConfigItem,
  InputOptions,
  PluginAPI,
  PluginItem,
  PluginObject,
  PluginPass,
  PluginTarget,
  PresetAPI,
  PresetItem,
  PresetObject,
  PresetTarget
} from "@babel/core";
import type { Context, LogFn } from "@powerlines/core";

export interface NamedImportDefinition {
  name: string;
  source: string;
  kind: "named";
}

export interface DefaultImportDefinition {
  source: string;
  kind: "default";
}

export type ImportDefinition = NamedImportDefinition | DefaultImportDefinition;

export type BabelPluginPass<TState = unknown> = PluginPass & TState;

export type BabelTransformPluginFilter = (code: string, id: string) => boolean;

export type BabelTransformPlugin<
  TContext extends Context = Context,
  TOptions extends object = object,
  TState = unknown
> = ((
  context: TContext
) => (options: {
  name: string;
  log: LogFn;
  api: PluginAPI;
  options: TOptions;
  context: TContext;
  dirname: string;
}) => PluginObject<TOptions & BabelPluginPass<TState>>) & {
  $$name: string;
};

export type BabelTransformPreset<
  TContext extends Context = Context,
  TOptions extends object = object
> = ((
  context: TContext
) => (options: {
  name: string;
  log: LogFn;
  api: PresetAPI;
  options: TOptions;
  context: TContext;
  dirname: string;
}) => PresetObject) & {
  $$name: string;
};

export type BabelTransformPluginOptions<
  TContext extends Context = Context,
  TOptions extends object = object,
  TState = unknown
> =
  | ConfigItem<PluginAPI>
  | PluginTarget<TOptions>
  | BabelTransformPlugin<TContext, TOptions, TState>
  | [
      PluginTarget<TOptions> | BabelTransformPlugin<TContext, TOptions, TState>,
      TOptions
    ]
  | [
      BabelTransformPlugin<TContext, TOptions, TState>,
      TOptions,
      BabelTransformPluginFilter
    ];

export type BabelTransformPresetOptions<
  TContext extends Context = Context,
  TOptions extends object = object
> =
  | ConfigItem<PresetAPI>
  | PresetTarget<TOptions>
  | BabelTransformPreset<TContext, TOptions>
  | [
      PresetTarget<TOptions> | BabelTransformPreset<TContext, TOptions>,
      TOptions
    ]
  | [
      BabelTransformPreset<TContext, TOptions>,
      TOptions,
      BabelTransformPluginFilter
    ];

export type ResolvedBabelTransformPluginOptions<
  TContext extends Context = Context,
  TOptions extends object = object,
  TState = unknown
> =
  | PluginItem<TOptions>
  | [
      BabelTransformPlugin<TContext, TOptions, TState>,
      TOptions,
      BabelTransformPluginFilter | string | null
    ];

export type ResolvedBabelTransformPresetOptions<
  TContext extends Context = Context,
  TOptions extends object = object
> =
  | PresetItem<TOptions>
  | [
      BabelTransformPreset<TContext, TOptions>,
      TOptions,
      BabelTransformPluginFilter | string | null
    ];

export type BabelTransformInput = Omit<
  InputOptions & Required<Pick<InputOptions, "presets" | "plugins">>,
  "filename" | "root" | "sourceFileName" | "sourceMaps" | "inputSourceMap"
>;

export interface BabelTransformPluginBuilderParams<
  TContext extends Context = Context,
  TOptions extends object = object
> {
  name: string;
  log: LogFn;
  api: PluginAPI;
  options: TOptions;
  context: TContext;
  dirname: string;
}

export type BabelTransformPluginBuilder<
  TContext extends Context = Context,
  TOptions extends object = object,
  TState = any
> = (
  params: BabelTransformPluginBuilderParams<TContext, TOptions>
) => PluginObject<TState & BabelPluginPass<TOptions>>;

export type DeclareBabelTransformPluginReturn<
  TContext extends Context = Context,
  TOptions extends object = object,
  TState = any
> = Omit<BabelTransformPlugin<TContext, TOptions, TState>, "$$name"> &
  Required<Pick<BabelTransformPlugin<TContext, TOptions, TState>, "$$name">>;

/**
 * A non-local import specifier represents an import that is not defined within the current module.
 *
 * @example
 * ```typescript
 * import { bar as baz } from 'foo';
 * // { name: 'baz', module: 'foo', imported: 'bar' }
 * ```
 *
 * @remarks
 * It captures the details of an import statement, including the local name used in the module, the source module from which it is imported, and the original name of the export in the source module.
 */
export interface ImportSpecifier {
  name?: string;
  module: string;
  imported: string;
}

export type BabelUserConfig = Omit<InputOptions, "plugins" | "presets"> & {
  /**
   * The Babel plugins to be used during the build process
   */
  plugins?: BabelTransformPluginOptions[];

  /**
   * The Babel presets to be used during the build process
   */
  presets?: BabelTransformPresetOptions[];
};

export type BabelResolvedConfig = Omit<BabelUserConfig, "plugins" | "presets"> &
  Required<Pick<BabelUserConfig, "plugins" | "presets">>;
