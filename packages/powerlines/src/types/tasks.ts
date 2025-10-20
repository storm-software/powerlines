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

import type { ArrayValues } from "@stryke/types/array";
import type { MaybePromise } from "@stryke/types/base";
import type { Context } from "./context";

export const SUPPORTED_TASKS = [
  "new",
  "clean",
  "prepare",
  "lint",
  "test",
  "build",
  "docs",
  "release",
  "finalize"
] as const;

export type TaskType = ArrayValues<typeof SUPPORTED_TASKS>;
export type Tasks<TContext extends Context = Context> = Record<
  TaskType,
  (this: TContext) => MaybePromise<void>
>;
