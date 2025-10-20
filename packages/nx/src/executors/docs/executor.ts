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
import { DocsInlineConfig } from "powerlines/types/config";
import {
  PowerlinesExecutorContext,
  withExecutor
} from "../../base/base-executor";
import type { DocsExecutorSchema } from "./schema";

export async function executorFn(
  context: PowerlinesExecutorContext<"docs", DocsExecutorSchema>,
  api: PowerlinesAPI
): Promise<BaseExecutorResult> {
  await api.docs(context.inlineConfig as DocsInlineConfig);

  return {
    success: true
  };
}

const executor: PromiseExecutor<DocsExecutorSchema> = withExecutor<
  "docs",
  DocsExecutorSchema
>("docs", executorFn);

export default executor;
