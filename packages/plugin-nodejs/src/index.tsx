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

import { render } from "@powerlines/plugin-alloy/render";
import babel from "@powerlines/plugin-babel";
import env, { readEnvTypeReflection } from "@powerlines/plugin-env";
import { isMatchFound } from "powerlines/lib/typescript/tsconfig";
import { Plugin } from "powerlines/types/plugin";
import { NodeJsEnvBuiltin } from "./components/env";
import { NodeJsPluginContext, NodeJsPluginOptions } from "./types/plugin";

export * from "./components";
export * from "./types";

/**
 * A package containing a Powerlines plugin for building a NodeJs application.
 */
export const plugin = <
  TContext extends NodeJsPluginContext = NodeJsPluginContext
>(
  options: NodeJsPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    babel(options.babel),
    env(options.env),
    {
      name: "nodejs",
      configResolved() {
        this.devDependencies["@types/node"] = "^22.14.6";

        this.tsconfig.tsconfigJson.compilerOptions ??= {};
        this.tsconfig.tsconfigJson.compilerOptions.types ??= [];
        if (
          !isMatchFound(
            "node",
            this.tsconfig.tsconfigJson.compilerOptions.types
          )
        ) {
          this.tsconfig.tsconfigJson.compilerOptions.types.push("node");
        }
      },
      async prepare() {
        const result = await readEnvTypeReflection(this, "env");

        return render(
          this,
          <NodeJsEnvBuiltin
            defaultConfig={this.config.env.defaultConfig}
            reflection={result}
          />
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
