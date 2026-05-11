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
 * Generate the project's documentation.
 *
 * @remarks
 * This function serves as the main entry point for the documentation generation process, orchestrating the execution of documentation hooks across different environments defined in the project configuration. It ensures that all relevant documentation operations are performed in a structured manner, allowing for pre-documentation, main documentation, and post-documentation hooks to be executed at the appropriate stages of the process. The function also utilizes a timer to measure the duration of the documentation operation, providing insights into the performance of the documentation process.
 *
 * @param context - The execution context for the documentation process, which provides access to the project configuration, environment, and utility functions for performing the documentation operation. The context is used to manage the state and behavior of the documentation process, allowing for hooks to be called at different stages of the documentation and for environment-specific configurations to be applied.
 */
export async function docs<TResolvedConfig extends ResolvedConfig>(
  context: ExecutionContext<TResolvedConfig>
) {
  const timer = context.timer("Documentation");

  await prepare(context);
  await executeEnvironments(context, async env => {
    await context.callHook("docs", {
      environment: env
    });
  });

  timer();
}
