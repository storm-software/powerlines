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

import type { ExecutionContext, ResolvedConfig } from "@powerlines/core";
import { executeEnvironments } from "@powerlines/core/lib/environment";
import { callHook } from "@powerlines/core/lib/hooks";
import { removeDirectory } from "@stryke/fs/helpers";
import { listFiles } from "@stryke/fs/list-files";
import { joinPaths } from "@stryke/path/join";
import { existsSync } from "node:fs";

/**
 * Finalize the execution context by disposing resources and cleaning up.
 *
 * @param context - The execution context to finalize
 */
export async function finalize<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(context: ExecutionContext<TResolvedConfig>) {
  const timer = context.timer("Finalization");

  await executeEnvironments(context, async env => {
    await callHook(context, "finalize", { environment: env });
    await env.fs.dispose();

    if (
      existsSync(env.cachePath) &&
      !(await listFiles(joinPaths(env.cachePath, "**/*")))?.length
    ) {
      await removeDirectory(env.cachePath);
    }
  });

  timer();
}
