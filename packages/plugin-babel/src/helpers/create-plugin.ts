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

import { declare } from "@babel/helper-plugin-utils";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import chalk from "chalk";
import { extendLog } from "powerlines/lib/logger";
import {
  BabelTransformPluginBuilder,
  DeclareBabelTransformPluginReturn
} from "powerlines/types/babel";
import { Context } from "powerlines/types/context";

/**
 * Create a Babel plugin using the provided builder function.
 *
 * @param name - The name of the plugin.
 * @param builder - The builder function that defines the plugin behavior.
 * @returns A Babel plugin declaration.
 */
export function createBabelPlugin<
  TContext extends Context = Context,
  TOptions extends Record<string, any> = Record<string, any>
>(
  name: string,
  builder: BabelTransformPluginBuilder<TContext, TOptions>
): DeclareBabelTransformPluginReturn<TContext, TOptions> {
  const plugin = (context: TContext) => {
    return declare<TOptions>((api, options, dirname) => {
      api.cache.using(() => context.meta.checksum);
      api.assertVersion("^7.0.0-0");

      const log = extendLog(context.log, name);
      log(
        LogLevelLabel.TRACE,
        `Initializing the ${chalk.bold.cyanBright(name)} Babel plugin`
      );

      const result = builder({
        log,
        name,
        api,
        options,
        context,
        dirname
      });
      result.name = name;

      log(
        LogLevelLabel.TRACE,
        `Completed initialization of the ${chalk.bold.cyanBright(name)} Babel plugin`
      );

      return result;
    });
  };
  plugin.$$name = name;

  return plugin;
}
