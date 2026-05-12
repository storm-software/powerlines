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

import { BaseContext, InlineConfig, ParsedUserConfig } from "@powerlines/core";
import { ConnectionMeta, DevToolsNodeContext } from "devframe/types";
import type { EngineExecutionOptions, EngineOptions } from "./config";
import { RpcClient } from "./rpc";

/**
 * The execution scope state represents the current state of a command, hook, or plugin execution within the Powerlines engine. It includes information about the name and type of the execution, as well as any relevant metadata such as the order of hook execution or the timestamp of when the execution started. This state can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export type ExecutionScopeType = "command" | "hook" | "plugin";

/**
 * The execution state for a command, hook, or plugin execution within the Powerlines engine. This state includes information about the name and type of the execution, as well as any relevant metadata such as the order of hook execution or the timestamp of when the execution started. This state can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export interface ExecutionScopeState {
  /**
   * The timestamp when the command, hook, or plugin execution started
   */
  timestamp: number;

  /**
   * The name of the command, hook, or plugin being executed
   */
  name: string;

  /**
   * The type of execution scope, which can be "command", "hook", or "plugin". This indicates whether the execution state represents a command being executed, a hook being executed, or a plugin being executed.
   */
  type: ExecutionScopeType;
}

/**
 * The execution state for a command execution within the Powerlines engine. This state includes information about the name and type of the execution, as well as any relevant metadata such as the order of hook execution or the timestamp of when the execution started. This state can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export interface ExecutionCommandScopeState extends ExecutionScopeState {
  /**
   * The type of execution scope, which can be "command", "hook", or "plugin". This indicates whether the execution state represents a command being executed, a hook being executed, or a plugin being executed.
   */
  type: "command";
}

/**
 * The execution state for a hook execution within the Powerlines engine. This state includes information about the name and type of the execution, as well as any relevant metadata such as the order of hook execution or the timestamp of when the execution started. This state can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export interface ExecutionHookScopeState extends ExecutionScopeState {
  /**
   * The order of the hook being executed, which can be "pre", "post", or "normal". This indicates whether the hook is being executed
   */
  order?: "pre" | "post";

  /**
   * The type of execution scope, which can be "command", "hook", or "plugin". This indicates whether the execution state represents a command being executed, a hook being executed, or a plugin being executed.
   */
  type: "hook";
}

/**
 * The execution state for a plugin execution within the Powerlines engine. This state includes information about the name and type of the execution, as well as any relevant metadata such as the order of hook execution or the timestamp of when the execution started. This state can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export interface ExecutionPluginScopeState extends ExecutionScopeState {
  /**
   * The type of execution scope, which can be "command", "hook", or "plugin". This indicates whether the execution state represents a command being executed, a hook being executed, or a plugin being executed.
   */
  type: "plugin";
}

/**
 * The execution state for the Powerlines engine, which includes information about the currently active command, hook, and plugin executions. This state can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export interface ExecutionState {
  /**
   * The currently active command execution for this execution context
   */
  command: ExecutionCommandScopeState | null;

  /**
   * The currently active hook execution for this execution context, if any
   */
  hook: ExecutionHookScopeState | null;

  /**
   * The currently active plugin execution for this execution context, if any
   */
  plugin: ExecutionPluginScopeState | null;
}

/**
 * The execution context for a command, hook, or plugin execution within the Powerlines engine. This context includes information about the name and type of the execution, as well as any relevant metadata such as the order of hook execution or the timestamp of when the execution started. This context can be used for logging, debugging, and other purposes to provide insight into the behavior of the Powerlines engine during its operation.
 */
export interface EngineExecutionItem {
  /**
   * A unique identifier for the current invocation (a single invocation can include multiple executions).
   */
  invocationId: string;

  /**
   * The method being executed, which can be one of the supported Powerlines execution API methods such as "build", "docs", or "deploy". This indicates the specific command or action that is being executed within the Powerlines engine.
   */
  method: string;

  /**
   * The options provided to the Powerlines process for this execution
   */
  options: EngineExecutionOptions;

  /**
   * The parsed user configuration file provided to the Powerlines process before any resolution or merging
   */
  configFile: ParsedUserConfig;

  /**
   * An object representing the currently active command, hook, and plugin executions for this execution context
   */
  state: ExecutionState;
}

/**
 * The Powerlines engine context.
 *
 * @remarks
 * This context is used during the execution of the Powerlines engine, providing access to the input user configurations.
 */
export interface EngineContext<TSystemContext = unknown>
  extends
    BaseContext<TSystemContext>,
    Pick<Required<EngineOptions>, "framework" | "orgId"> {
  /**
   * The options provided to the Powerlines process
   */
  options: EngineOptions;

  /**
   * The metadata information for the RPC connection
   */
  connection: ConnectionMeta;

  /**
   * The [Devframe](https://devtools.vite.dev/devframe/guide/) context for interacting with the DevTools.
   *
   * @see https://devtools.vite.dev/devframe/guide/
   * @see https://github.com/vitejs/devtools/blob/main/devframe
   */
  devtools: DevToolsNodeContext;

  /**
   * A list of all command executions that will be run during the lifecycle of the engine
   */
  executions: EngineExecutionItem[];

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   */
  loadExecutions: (
    method: string,
    inlineConfig: InlineConfig
  ) => Promise<EngineExecutionItem[]>;

  /**
   * Complete an execution by removing it from the list of active executions based on the provided invocation ID and execution ID. This method is typically called when an execution has finished or has been terminated, allowing the context to clean up any resources associated with that execution and update its internal state accordingly.
   *
   * @param invocationId - The unique identifier for the invocation of the execution to be completed.
   * @param executionId - The unique identifier for the specific execution to be completed.
   */
  completeExecution: (invocationId: string, executionId: string) => void;
}

export interface EngineSystemContext {
  /**
   * The RPC client instance used for communication between the engine and its worker threads, allowing for remote procedure calls to be made between the main thread and worker threads for tasks such as logging, file system operations, and other interactions that require communication between the different execution contexts within the Powerlines engine.
   */
  rpc: RpcClient;
}
