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
import PowerlinesAPI from "powerlines";
import { LintInlineConfig } from "powerlines/types";
import {
  PowerlinesExecutorContext,
  withExecutor
} from "../../base/base-executor";
import type { LintExecutorSchema } from "./schema";

export async function executorFn(
  context: PowerlinesExecutorContext<"lint", LintExecutorSchema>,
  api: PowerlinesAPI
): Promise<BaseExecutorResult> {
  await api.lint(context.inlineConfig as LintInlineConfig);

  return {
    success: true
  };
}

const executor: PromiseExecutor<LintExecutorSchema> = withExecutor<
  "lint",
  LintExecutorSchema
>("lint", executorFn);

export default executor;
