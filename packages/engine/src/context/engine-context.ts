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
  EngineContext,
  EngineOptions,
  ExecutionState,
  InitialConfig
} from "@powerlines/core";
import { uuid } from "@stryke/unique-id/uuid";
import { PowerlinesBaseContext } from "./base-context";

export class PowerlinesEngineContext
  extends PowerlinesBaseContext
  implements EngineContext
{
  #executions: ExecutionState[] = [];

  /**
   * Creates a new instance of the PowerlinesEngineContext class.
   *
   * @param options - The options to initialize the context with.
   * @returns A promise that resolves to an instance of the PowerlinesEngineContext class.
   */
  public static async init(
    options: EngineOptions,
    initialConfig: InitialConfig<any> = {}
  ): Promise<PowerlinesEngineContext> {
    const context = new PowerlinesEngineContext();
    await context.init(options, initialConfig);

    if (!context.configFile?.config) {
      context.fatal(
        "No configuration file found. Please ensure you have a valid configuration file in your project."
      );
      throw new Error("No configuration file found");
    }

    if (Array.isArray(context.configFile.config)) {
      context.#executions = await Promise.all(
        context.configFile.config.map(async (_, executionIndex) => {
          const executionId = uuid();

          return {
            executionId,
            options: {
              cwd: process.cwd(),
              ...context.options,
              executionId,
              executionIndex
            },
            active: {
              command: null,
              hook: null,
              plugin: null
            }
          };
        })
      );
    } else {
      const executionId = uuid();
      context.#executions = [
        {
          executionId,
          options: {
            cwd: process.cwd(),
            ...context.options,
            executionId,
            executionIndex: 0
          },
          active: {
            command: null,
            hook: null,
            plugin: null
          }
        }
      ];
    }

    return context;
  }

  /**
   * A list of all command executions that will be run during the lifecycle of the engine
   *
   * @returns An array of {@link ExecutionState} representing each execution context for the engine.
   */
  public get executions(): ExecutionState[] {
    return this.#executions;
  }
}
