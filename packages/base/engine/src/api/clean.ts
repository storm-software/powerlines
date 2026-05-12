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
import { joinPaths } from "@stryke/path/join";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";
import { prepare } from "./prepare";

/**
 * Clean any previously prepared artifacts
 *
 * @param context - The execution context for the clean process, which provides access to the project configuration, environment, and utility functions for performing the clean operation. The context is used to manage the state and behavior of the clean process, allowing for hooks to be called at different stages of the clean and for environment-specific configurations to be applied.
 */
export async function clean<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(context: ExecutionContext<TResolvedConfig, TSystemContext>) {
  const timer = context.timer("Cleaning");

  await prepare<TResolvedConfig, TSystemContext>(context, true);
  await executeEnvironments(context, async env => {
    env.debug("Cleaning the project's dist and artifacts directories.");

    await env.fs.remove(joinPaths(env.config.cwd, env.config.output.path));
    await env.fs.remove(
      joinPaths(
        env.config.cwd,
        env.config.root,
        env.config.output.artifactsPath
      )
    );

    await context.callHook("clean", {
      environment: env,
      sequential: false
    });
  });

  timer();
}
