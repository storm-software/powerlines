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
  EnvironmentContext,
  EnvironmentResolvedConfig,
  ExecutionContext,
  ResolvedConfig
} from "@powerlines/core";
import { DEFAULT_ENVIRONMENT } from "@powerlines/core/constants";
import { titleCase } from "@stryke/string-format/title-case";
import { isSet } from "@stryke/type-checks/is-set";
import { MaybePromise } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import defu from "defu";
import { callHook } from "./hooks";

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

export async function getEnvironments<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(
  context: ExecutionContext<TResolvedConfig>
): Promise<EnvironmentContext<TResolvedConfig>[]> {
  if (
    !context.config.environments ||
    Object.keys(context.config.environments).length <= 1
  ) {
    context.debug({
      meta: {
        category: "config"
      },
      message:
        "No environments are configured for this Powerlines project. Using the default environment."
    });

    return [await context.getEnvironment()];
  }

  context.debug({
    meta: {
      category: "config"
    },
    message: `Found ${
      Object.keys(context.config.environments).length
    } configured environment(s) for this Powerlines project.`
  });

  return (
    await Promise.all(
      Object.entries(context.config.environments).map(
        async ([name, config]) => {
          const environment = await context.getEnvironmentSafe(name);
          if (!environment) {
            const resolvedEnvironment = await callHook(
              context,
              "configEnvironment",
              {
                environment: name
              },
              name,
              config
            );

            if (resolvedEnvironment) {
              context.environments[name] = await context.createEnvironment(
                resolvedEnvironment as EnvironmentResolvedConfig<TResolvedConfig>["environment"]
              );
            }
          }

          return context.environments[name];
        }
      )
    )
  ).filter(env => isSet(env));
}

export async function executeEnvironments<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(
  context: ExecutionContext<TResolvedConfig>,
  handle: (env: EnvironmentContext<TResolvedConfig>) => MaybePromise<void>
) {
  await Promise.all(
    (await getEnvironments<TResolvedConfig>(context)).map(async env =>
      Promise.resolve(handle(env))
    )
  );
}
