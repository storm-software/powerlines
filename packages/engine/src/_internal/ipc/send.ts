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
import { messageParent } from "jest-worker";
import { IpcMessage, IpcMessageType } from "./messages";

function formatWriteLogMessage<TContext extends Context = Context>(
  context: TContext,
  meta: LogFnMeta,
  message: string
) {
  const combinedMeta = {
    ...context.logger.options,
    ...(isSetObject(meta) ? meta : { type: meta })
  };

  return {
    id: uuid(),
    type: IpcMessageType.WRITE_LOG,
    executionId: combinedMeta.executionId || context.options.executionId,
    executionIndex:
      combinedMeta.executionIndex ?? context.options.executionIndex,
    environment: combinedMeta.environment,
    timestamp: Date.now(),
    payload: {
      meta: {
        type: combinedMeta.type,
        category: combinedMeta.category || LogCategories.GENERAL,
        logId: combinedMeta.logId || uuid(),
        timestamp: combinedMeta.timestamp ?? Date.now(),
        name: combinedMeta.name || context.config.name,
        executionId: combinedMeta.executionId || context.options.executionId,
        executionIndex:
          combinedMeta.executionIndex ?? context.options.executionIndex,
        command: combinedMeta.command || context.config.command,
        hook: combinedMeta.hook,
        environment: combinedMeta.environment,
        plugin: combinedMeta.plugin,
        source: combinedMeta.source
      },
      message
    }
  };
}

function childProcessSend(message: IpcMessage) {
  process.send?.(message);
}

function workerThreadSend(message: IpcMessage) {
  messageParent(message);
}

function send(message: IpcMessage) {
  if (process.env.POWERLINES_EXECUTION_THREAD_TYPE === "child-process") {
    childProcessSend(message);
  } else if (process.env.POWERLINES_EXECUTION_THREAD_TYPE === "worker-thread") {
    workerThreadSend(message);
  } else {
    // eslint-disable-next-line no-console
    console.warn("No IPC mechanism available to send message:", message);
  }
}

export function sendWriteLogMessage<TContext extends Context = Context>(
  context: TContext,
  meta: LogFnMeta,
  message: string
) {
  send(formatWriteLogMessage(context, meta, message));
}
