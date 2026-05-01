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
  EnvironmentResolvedConfig,
  ResolvedConfig
} from "@powerlines/core";
import { DEFAULT_ENVIRONMENT } from "@powerlines/core/constants";
import { titleCase } from "@stryke/string-format/title-case";
import { uuid } from "@stryke/unique-id/uuid";
import defu from "defu";

export function createEnvironment<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(name: string, config: TResolvedConfig) {
  return defu(config.environments?.[name] ?? {}, {
    id: uuid(),
    name,
    title: config.title ?? titleCase(config.name),
    ssr: false,
    resolve: {
      mainFields:
        config.platform === "browser"
          ? ["browser", "module", "jsnext:main", "jsnext"]
          : ["module", "jsnext:main", "jsnext"]
    },
    consumer: config.platform === "browser" ? "client" : "server",
    preview:
      config.platform === "browser"
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
  }) as unknown as EnvironmentResolvedConfig<TResolvedConfig>["environment"];
}

export function createDefaultEnvironment<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(config: TResolvedConfig) {
  return createEnvironment<TResolvedConfig>(DEFAULT_ENVIRONMENT, config);
}
