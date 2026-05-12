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
import { SUPPORTED_COMMANDS } from "../constants";
import {
  BASE_EXECUTION_API_METHODS,
  EXECUTION_API_METHODS
} from "../constants/api";
import type { Context } from "./context";

export type BaseCommandType =
  | ArrayValues<typeof BASE_EXECUTION_API_METHODS>
  | "finalize";

export type CommandType = ArrayValues<typeof SUPPORTED_COMMANDS>;
export type Commands<TContext extends Context = Context> = Record<
  CommandType,
  (this: TContext) => MaybePromise<void>
>;

export type BaseExecutionAPIMethods =
  (typeof BASE_EXECUTION_API_METHODS)[number];
export type PowerlinesExecutionAPIMethods =
  (typeof EXECUTION_API_METHODS)[number];
export type SupportedCommands = (typeof SUPPORTED_COMMANDS)[number];
