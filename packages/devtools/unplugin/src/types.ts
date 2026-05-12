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
  BuildInlineConfig,
  ExecutionContext,
  ExecutionOptions,
  UnpluginOptions
} from "@powerlines/core";
import { PartialKeys } from "@stryke/types/base";
import type { UnpluginContextMeta } from "unplugin";

export type * from "@powerlines/core/types/unplugin";

export type UnpluginExecutionOptionsBase = Omit<
  PartialKeys<
    ExecutionOptions,
    "cwd" | "configFile" | "framework" | "orgId" | "root" | "configIndex"
  >,
  "executionId"
>;

export type UnpluginExecutionOptions = Omit<BuildInlineConfig, "command"> &
  UnpluginExecutionOptionsBase;

export type UnpluginFactory<TContext extends ExecutionContext> = (
  options: UnpluginExecutionOptions | undefined,
  meta: UnpluginContextMeta
) => UnpluginOptions<TContext>;
