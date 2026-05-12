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

import { ExecutionContext } from "@powerlines/core";
import { executeEnvironments } from "@powerlines/core/lib/environment";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";
import { prepare } from "./prepare";

/**
 * Deploy the project's source files to the target environment.
 *
 * @remarks
 * This function serves as the main entry point for the deployment process, orchestrating the execution of deployment hooks across different environments defined in the project configuration. It ensures that all relevant deployment operations are performed in a structured manner, allowing for pre-deployment, main deployment, and post-deployment hooks to be executed at the appropriate stages of the process. The function also utilizes a timer to measure the duration of the deployment operation, providing insights into the performance of the deployment process.
 *
 * @param context - The execution context for the deploy process, which provides access to the project configuration, environment, and utility functions for performing the deploy operation. The context is used to manage the state and behavior of the deploy process, allowing for hooks to be called at different stages of the deploy and for environment-specific configurations to be applied.
 */
export async function deploy<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(context: ExecutionContext<TResolvedConfig, TSystemContext>) {
  const timer = context.timer("Deployment");

  await prepare<TResolvedConfig, TSystemContext>(context);
  await executeEnvironments(context, async env => {
    await context.callHook("deploy", {
      environment: env
    });
  });

  timer();
}
