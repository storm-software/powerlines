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
  ExecutionContext,
  InlineConfig,
  LogFnMeta
} from "@powerlines/core";
import { PowerlinesExecutionContext } from "@powerlines/core/context/execution-context";
import { resolvePluginConfig } from "@powerlines/core/lib/context-helpers";
import { consoleLogger } from "@powerlines/core/plugin-utils";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type { DeepPartial, MaybePromise } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import { defu } from "defu";
import type { RpcClient } from "../types";
import type { ExecutionApiParams } from "../types/api";
import type { EngineResolvedConfig } from "../types/config";
import type { EngineSystemContext } from "../types/context";
import { createRpcClient } from "./rpc";
import { MessagePortDuplex } from "./stream";

/**
 * Creates an execution API with the provided methods. Each method will be wrapped to create an execution context and handle errors appropriately.
 *
 * @param handlers - An object where keys are command names and values are functions that take an execution context and return a promise.
 * @param inlineConfig - An optional partial inline configuration object that will be merged with the context's options when creating the execution context for each command.
 * @returns A function that can be used as an execution API handler, which takes execution parameters and invokes the appropriate command handler with a properly constructed execution context.
 */
export function createApi<
  TContext extends ExecutionContext<EngineResolvedConfig, EngineSystemContext> =
    ExecutionContext<EngineResolvedConfig, EngineSystemContext>
>(
  handlers: Record<string, (context: TContext) => Promise<void>>,
  inlineConfig:
    | DeepPartial<InlineConfig>
    | ((prev: InlineConfig) => MaybePromise<InlineConfig>) = {}
) {
  return async (params: ExecutionApiParams) => {
    const { command, options, port } = params;

    if (!handlers[command]) {
      throw new Error(
        `No handler found for command "${
          command
        }". Please ensure that the command is defined in the API handlers provided to \`createApi\`.`
      );
    }

    const duplex = new MessagePortDuplex(port);
    duplex.setEncoding("utf8");
    duplex.on("data", (chunk: string) => duplex.write(chunk.toUpperCase()));
    duplex.on("end", () => {
      duplex.end();
    });

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
      } - ${titleCase(command)} execution (${options.executionId})`
    );

    await resolvePluginConfig<EngineResolvedConfig, EngineSystemContext>(
      context
    );

    if (!context.config.input) {
      throw new Error(
        `No input defined in configuration for ${
          command
        } execution. Please ensure that the configuration file defines an input for this execution, or provide an inline configuration with the necessary input.`
      );
    }

    await handlers[command](context);
  };
}
