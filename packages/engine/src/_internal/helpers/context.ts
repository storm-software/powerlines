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

import { InferOverridableConfig, ResolvedConfig } from "@powerlines/core";
import { isSetString } from "@stryke/type-checks/is-set-string";

export function getConfigProps<TResolvedConfig extends ResolvedConfig>(
  config:
    | TResolvedConfig["initialConfig"]
    | TResolvedConfig["userConfig"]
    | TResolvedConfig["inlineConfig"]
    | TResolvedConfig["pluginConfig"]
    | InferOverridableConfig<TResolvedConfig> = {}
) {
  return {
    name: config.name,
    title: config.title,
    description: config.description,
    projectType: config.projectType,
    customLogger: config.customLogger,
    logLevel: config.logLevel,
    tsconfig: config.tsconfig,
    tsconfigRaw: config.tsconfigRaw,
    skipCache: config.skipCache,
    autoInstall: config.autoInstall,
    input: isSetString(config.input) ? [config.input] : config.input,
    plugins: config.plugins,
    mode: config.mode,
    resolve: config.resolve,
    framework: config.framework,
    ...config
  };
}
