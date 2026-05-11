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

import { ExecutionContext, ResolvedConfig } from "@powerlines/core";
import { executeEnvironments } from "../helpers/environment";
import { prepare } from "./prepare";

/**
 * Test the project's source files and report any issues found.
 *
 * @remarks
 * This function serves as the main entry point for the testing process, orchestrating the execution of testing hooks across different environments defined in the project configuration. It ensures that all relevant testing operations are performed in a structured manner, allowing for pre-testing, main testing, and post-testing hooks to be executed at the appropriate stages of the process. The function also utilizes a timer to measure the duration of the testing operation, providing insights into the performance of the testing process.
 *
 * @param context - The execution context for the test process, which provides access to the project configuration, environment, and utility functions for performing the test operation. The context is used to manage the state and behavior of the test process, allowing for hooks to be called at different stages of the test and for environment-specific configurations to be applied.
 */
export async function test<TResolvedConfig extends ResolvedConfig>(
  context: ExecutionContext<TResolvedConfig>
) {
  const timer = context.timer("Testing");

  await prepare(context);
  await executeEnvironments(context, async env => {
    await context.callHook("test", {
      environment: env,
      sequential: false
    });
  });

  timer();
}
