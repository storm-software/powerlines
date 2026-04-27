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

import {
  Context,
  LogCategories,
  LoggerMessage,
  LogLevel
} from "@powerlines/core";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { uuid } from "@stryke/unique-id/uuid";
import { IpcMessageType } from "./messages";

export function sendWriteLogMessage<TContext extends Context = Context>(
  context: TContext,
  type: LogLevel,
  message: string | LoggerMessage
) {
  const meta = {
    ...(isSetObject(message) && isSetObject(message.meta) ? message.meta : {}),
    ...context.logger.options
  };

  process.send?.({
    id: uuid(),
    type: IpcMessageType.WRITE_LOG,
    executionId: meta.executionId ?? context.config.executionId,
    executionIndex: meta.executionIndex ?? context.config.executionIndex,
    environment: meta.environment,
    timestamp: Date.now(),
    payload: {
      meta: {
        type,
        category: meta.category ?? LogCategories.GENERAL,
        logId: meta.logId ?? uuid(),
        timestamp: meta.timestamp ?? Date.now(),
        name: meta.name ?? context.config.name,
        executionId: meta.executionId ?? context.config.executionId,
        executionIndex: meta.executionIndex ?? context.config.executionIndex,
        command: meta.command ?? context.config.command,
        hook: meta.hook,
        environment: meta.environment,
        plugin: meta.plugin,
        source: meta.source
      },
      message: isSetString(message) ? message : message.message
    }
  });
}
