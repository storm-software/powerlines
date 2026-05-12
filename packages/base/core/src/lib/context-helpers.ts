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

import { toArray } from "@stryke/convert/to-array";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { PowerlinesExecutionContext } from "../context";
import { colorText } from "../plugin-utils/logging";
import type { InferOverridableConfig, ResolvedConfig } from "../types";
import { mergeConfigs } from "./hooks";

export function getConfigProps<TResolvedConfig extends ResolvedConfig>(
  config:
    | TResolvedConfig["userConfig"]
    | TResolvedConfig["inlineConfig"]
    | TResolvedConfig["pluginConfig"]
    | InferOverridableConfig<TResolvedConfig> = {}
) {
  return {
    input: isSetString(config.input) ? [config.input] : config.input,
    ...config
  };
}

export async function resolvePluginConfig<
  TContext extends PowerlinesExecutionContext
>(context: TContext) {
  const timer = context.timer(
    `${titleCase(context.config.command)} Execution - Initialization`
  );

  for (const plugin of context.config.plugins.flatMap(p => toArray(p)) ?? []) {
    await context.unstable_addPlugin(plugin);
  }

  if (context.plugins.length === 0) {
    context.warn({
      meta: {
        category: "plugins"
      },
      message:
        "No Powerlines plugins were specified in the options. Please ensure this is correct, as it is generally not recommended."
    });
  } else {
    context.info({
      meta: {
        category: "plugins"
      },
      message: `Loaded ${context.plugins.length} ${titleCase(
        context.config.framework?.name ?? "powerlines"
      )} plugin${context.plugins.length > 1 ? "s" : ""}: \n${context.plugins
        .map((plugin, index) => ` ${index + 1}. ${colorText(plugin.name)}`)
        .join("\n")}`
    });
  }

  const pluginConfig = await context.callHook("config", {
    environment: await context.getEnvironment(),
    sequential: true,
    result: "merge",
    merge: mergeConfigs
  });
  if (pluginConfig) {
    await context.setPluginConfig(
      pluginConfig as TContext["config"]["pluginConfig"]
    );
  } else {
    context.debug({
      meta: {
        category: "config"
      },
      message: "No plugin configuration was returned from the config hook."
    });
  }

  timer();
}
