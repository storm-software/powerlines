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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { Serializable } from "node:worker_threads";
import {
  IpcMessage,
  UpdateCommandMessagePayload,
  UpdateHookMessagePayload,
  UpdatePluginMessagePayload,
  WriteLogMessagePayload
} from "./messages";

export function parseIpcMessage(data: Serializable): IpcMessage | undefined {
  let message: Record<string, any> | undefined;
  if (isSetObject(data)) {
    message = data;
  } else if (isString(data)) {
    try {
      const parsed = JSON.parse(data);
      if (isSetObject(parsed)) {
        message = parsed;
      }
    } catch {
      // Do nothing
    }
  }

  if (
    message &&
    isSetString(message.id) &&
    isSetString(message.type) &&
    isSetString(message.executionId) &&
    Number.isInteger(message.executionIndex) &&
    !Number.isNaN(message.timestamp)
  ) {
    return message as IpcMessage;
  }

  return undefined;
}

export function parseWriteLogMessagePayload(
  data?: Record<string, any>
): WriteLogMessagePayload {
  if (isSetString(data?.level) && data?.args) {
    return {
      level: data.level as LogLevelLabel,
      source: isSet(data.source) ? String(data.source) : undefined,
      environment: isSet(data.environment)
        ? String(data.environment)
        : undefined,
      plugin: isSet(data.plugin) ? String(data.plugin) : undefined,
      args: toArray(data.args).filter(Boolean)
    };
  }

  throw new Error('Invalid "write-log" message payload.');
}

export function parseUpdateCommandMessagePayload(
  data?: Record<string, any>
): UpdateCommandMessagePayload {
  if (isSetString(data?.command)) {
    return {
      command: data.command
    };
  }

  throw new Error('Invalid "update-command" message payload.');
}

export function parseUpdateHookMessagePayload(
  data?: Record<string, any>
): UpdateHookMessagePayload {
  if (
    isSetString(data?.hook) &&
    ["pre", "post", "normal"].includes(data.order)
  ) {
    return {
      hook: data.hook,
      order: data.order
    };
  }

  throw new Error('Invalid "update-hook" message payload.');
}

export function parseUpdatePluginMessagePayload(
  data?: Record<string, any>
): UpdatePluginMessagePayload {
  if (isSetString(data?.plugin)) {
    return {
      plugin: data.plugin
    };
  }

  throw new Error('Invalid "update-plugin" message payload.');
}
