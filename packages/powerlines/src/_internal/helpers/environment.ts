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

import { titleCase } from "@stryke/string-format/title-case";
import defu from "defu";
import { APIContext, Context, EnvironmentResolvedConfig } from "../../types";
import { DEFAULT_ENVIRONMENT } from "../../utils";

export function createEnvironment<TContext extends Context = Context>(
  name: string,
  userConfig: TContext["config"]["userConfig"]
): EnvironmentResolvedConfig {
  return defu(
    userConfig.environments?.[name] ?? {},
    {
      name,
      title: userConfig.title || titleCase(userConfig.name),
      ssr: false,
      mainFields:
        userConfig?.platform === "browser"
          ? ["browser", "module", "jsnext:main", "jsnext"]
          : ["module", "jsnext:main", "jsnext"],
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
      consumer: userConfig?.platform === "browser" ? "client" : "server",
      preview:
        userConfig?.platform === "browser"
          ? {
              port: 5173,
              open: true,
              strictPort: false,
              // https: false,
              host: "localhost",
              allowedHosts: ["."],
              cors: true,
              headers: {}
            }
          : undefined
    },
    userConfig
  ) as EnvironmentResolvedConfig;
}

export function createDefaultEnvironment<
  TContext extends APIContext = APIContext
>(userConfig: TContext["config"]["userConfig"]): EnvironmentResolvedConfig {
  return createEnvironment(DEFAULT_ENVIRONMENT, userConfig);
}
