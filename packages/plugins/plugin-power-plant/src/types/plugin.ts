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

import type {
  ExecuteFunction,
  GeneratorConfig,
  InferEngineOptions
} from "@power-plant/core";
import { PluginContext, ResolvedConfig, UserConfig } from "powerlines";

export type PowerPlantPluginOptions<
  TSpec,
  TOptions extends object
> = GeneratorConfig<TSpec, TOptions>;

export type PowerPlantExecuteOptions<
  TSpec,
  TOptions extends object
> = InferEngineOptions<GeneratorConfig<TSpec, TOptions>> & TOptions;

export type PowerPlantPluginUserConfig<
  TSpec,
  TOptions extends object
> = UserConfig & {
  powerplant?: PowerPlantPluginOptions<TSpec, TOptions>;
};

export type PowerPlantPluginResolvedConfig<
  TSpec,
  TOptions extends object
> = ResolvedConfig & {
  powerplant: PowerPlantPluginOptions<TSpec, TOptions>;
};

export type PowerPlantPluginContext<
  TSpec,
  TOptions extends object,
  TResolvedConfig extends PowerPlantPluginResolvedConfig<TSpec, TOptions> =
    PowerPlantPluginResolvedConfig<TSpec, TOptions>
> = PluginContext<TResolvedConfig> & {
  powerplant: {
    execute: ExecuteFunction;
    /**
     * Options passed to {@link ExecuteFunction} during `prepare`.
     *
     * @remarks
     * Other plugins may mutate this before the Power Plant `prepare` hook runs
     * (e.g. to supply generator-specific options or an `input`/`inputPath`).
     */
    options: PowerPlantExecuteOptions<TSpec, TOptions>;
  };
};
