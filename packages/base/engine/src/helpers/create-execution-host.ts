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

import { PowerlinesExecutionContext } from "@powerlines/core/context/execution-context";
import { resolvePluginConfig } from "@powerlines/core/lib/context-helpers";
import { ExecutionHostParams } from "../types/api";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";

/**
 * Creates an execution host with the provided methods. Each method will be wrapped to create an execution context and handle errors appropriately.
 *
 * @param methods - An object where keys are method names and values are functions that take an execution context and return a promise.
 * @returns An object with the same keys as the input methods, but each function is wrapped to create an execution context and handle errors.
 */
export function createExecutionHost<
  TContext extends PowerlinesExecutionContext<
    EngineResolvedConfig,
    EngineSystemContext
  > = PowerlinesExecutionContext<EngineResolvedConfig, EngineSystemContext>
>(methods: Record<string, (context: TContext) => Promise<void>>) {
  return Object.fromEntries(
    Object.entries(methods).map(([method, fn]) => [
      method,
      async (params: ExecutionHostParams) => {
        const context = (await PowerlinesExecutionContext.from(
          params.options,
          params.inlineConfig ?? {}
        )) as TContext;
        context.logger.info(
          `Starting ${method} execution (${params.options.executionId})`
        );

        await resolvePluginConfig(context as PowerlinesExecutionContext<any>);

        await fn(context);
      }
    ])
  );
}
