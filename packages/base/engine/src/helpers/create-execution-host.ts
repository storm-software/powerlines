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

import { InlineConfig, LogFnMeta } from "@powerlines/core";
import { PowerlinesExecutionContext } from "@powerlines/core/context/execution-context";
import { resolvePluginConfig } from "@powerlines/core/lib/context-helpers";
import { consoleLogger } from "@powerlines/core/plugin-utils";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { DeepPartial, MaybePromise } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import { defu } from "defu";
import { RpcClient } from "../types";
import { ExecutionHostParams } from "../types/api";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";
import { createRpcClient } from "./rpc";

/**
 * Creates an execution host with the provided methods. Each method will be wrapped to create an execution context and handle errors appropriately.
 *
 * @param methods - An object where keys are method names and values are functions that take an execution context and return a promise.
 * @param inlineConfig - An optional partial inline configuration object that will be merged with the context's options when creating the execution context for each method.
 * @returns An object with the same keys as the input methods, but each function is wrapped to create an execution context and handle errors.
 */
export function createExecutionHost<
  TContext extends PowerlinesExecutionContext<
    EngineResolvedConfig,
    EngineSystemContext
  > = PowerlinesExecutionContext<EngineResolvedConfig, EngineSystemContext>
>(
  methods: Record<string, (context: TContext) => Promise<void>>,
  inlineConfig:
    | DeepPartial<InlineConfig>
    | ((prev: InlineConfig) => MaybePromise<InlineConfig>) = {}
) {
  return Object.fromEntries(
    Object.entries(methods).map(([method, fn]) => [
      method,
      async (params: ExecutionHostParams) => {
        const { options } = params;

        let rpc!: RpcClient;
        if (options.baseURL && options.connection) {
          rpc = createRpcClient(options);
        } else {
          throw new Error(
            `Execution RPC client could not be created - Missing ${
              !options.baseURL
                ? `baseURL${options.connection ? ` and connection information` : ""}`
                : "connection"
            } or connection information.`
          );
        }

        const logFn = (meta: LogFnMeta, message: string) => {
          consoleLogger(meta, message);
          if (rpc) {
            void rpc.callEvent("powerlines:log", {
              meta: {
                category: "general",
                ...options,
                ...(isSetObject(meta) ? meta : { type: meta }),
                logId: uuid(),
                timestamp: Date.now()
              },
              message
            });
          }
        };

        const context = (await PowerlinesExecutionContext.from<
          EngineResolvedConfig,
          EngineSystemContext
        >(
          { ...options, logFn },
          isFunction(inlineConfig)
            ? await Promise.resolve(inlineConfig(params.inlineConfig ?? {}))
            : (defu(inlineConfig, params.inlineConfig ?? {}) as InlineConfig),
          {
            rpc
          }
        )) as TContext;

        context.logger.info(
          `Starting ${
            titleCase(options.framework?.name) || "Powerlines"
          } - ${titleCase(method)} execution (${options.executionId})`
        );

        await resolvePluginConfig(context as PowerlinesExecutionContext<any>);

        await fn(context);
      }
    ])
  );
}
