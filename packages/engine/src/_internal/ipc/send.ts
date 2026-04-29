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

import { Context, LogCategories, LogFnMeta } from "@powerlines/core";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { uuid } from "@stryke/unique-id/uuid";
import { IpcMessageType } from "./messages";

export function sendWriteLogMessage<TContext extends Context = Context>(
  context: TContext,
  meta: LogFnMeta,
  message: string
) {
  const combinedMeta = {
    ...context.logger.options,
    ...(isSetObject(meta) ? meta : { type: meta })
  };

  process.send?.({
    id: uuid(),
    type: IpcMessageType.WRITE_LOG,
    executionId: combinedMeta.executionId || context.config.executionId,
    executionIndex:
      combinedMeta.executionIndex ?? context.config.executionIndex,
    environment: combinedMeta.environment,
    timestamp: Date.now(),
    payload: {
      meta: {
        type: combinedMeta.type,
        category: combinedMeta.category || LogCategories.GENERAL,
        logId: combinedMeta.logId || uuid(),
        timestamp: combinedMeta.timestamp ?? Date.now(),
        name: combinedMeta.name || context.config.name,
        executionId: combinedMeta.executionId || context.config.executionId,
        executionIndex:
          combinedMeta.executionIndex ?? context.config.executionIndex,
        command: combinedMeta.command || context.config.command,
        hook: combinedMeta.hook,
        environment: combinedMeta.environment,
        plugin: combinedMeta.plugin,
        source: combinedMeta.source
      },
      message
    }
  });
}
