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

import { PromiseExecutor } from "@nx/devkit";
import { BaseExecutorResult } from "@storm-software/workspace-tools/types";
import defu from "defu";
import type { PowerlinesEngine } from "powerlines";
import {
  PowerlinesExecutorContext,
  withExecutor
} from "../../base/base-executor";
import { PrepareExecutorSchema } from "./schema";

export async function executorFn(
  context: PowerlinesExecutorContext<"prepare", PrepareExecutorSchema>,
  api: PowerlinesEngine
): Promise<BaseExecutorResult> {
  await api.prepare(
    defu(
      {
        command: "prepare",
        skipCache: context.options.skipCache,
        autoInstall: context.options.autoInstall
      },
      context.inlineConfig
    )
  );

  return {
    success: true
  };
}

const executor: PromiseExecutor<PrepareExecutorSchema> = withExecutor<
  "prepare",
  PrepareExecutorSchema
>("prepare", executorFn);

export default executor;
