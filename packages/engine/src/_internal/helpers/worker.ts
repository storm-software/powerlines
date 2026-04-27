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

import type { LogFn } from "@powerlines/core";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import { MaybePromise } from "@stryke/types/base";
import { formatDuration } from "date-fns/formatDuration";
import { Worker as JestWorker } from "jest-worker";
import type { ChildProcess } from "node:child_process";
import { cpus } from "node:os";
import { Transform } from "node:stream";
import { parseArgs } from "node:util";
import {
  parseIpcMessage,
  parseUpdateCommandMessagePayload,
  parseUpdateHookMessagePayload,
  parseUpdatePluginMessagePayload,
  parseWriteLogMessagePayload
} from "../ipc/helpers";
import {
  IpcMessage,
  IpcMessageType,
  UpdateCommandIpcMessage,
  UpdateHookIpcMessage,
  UpdatePluginIpcMessage,
  WriteLogIpcMessage
} from "../ipc/messages";

const RESTARTED = Symbol("powerlines-worker:restarted");

/**
 * The debug address is in the form of `[host:]port`. The host is optional.
 */
interface DebugAddress {
  host?: string;
  port: number;
}

/**
 * Formats the debug address into a string.
 */
const formatDebugAddress = ({ host, port }: DebugAddress): string => {
  return host ? `${host}:${port}` : `${port}`;
};

/**
 * Node.js CLI flags that are not allowed in NODE_OPTIONS and must be
 * passed as direct CLI arguments via execArgv.
 * This set is the difference between all Node.js CLI flags and the ones **not**
 * allowed in NODE_OPTIONS, as listed in the Node.js documentation:
 * https://nodejs.org/api/cli.html#node_optionsoptions
 *
 * It is not exhaustive since not all options make sense for Powerlines (e.g. --test)
 */
const EXEC_ARGV_ONLY_OPTIONS = new Set([
  "experimental-network-inspection",
  "experimental-storage-inspection",
  "experimental-worker-inspection",
  "experimental-inspector-network-resource"
]);

function formatArg(
  key: string,
  value: string | boolean | undefined
): string | null {
  if (value === true) {
    return `--${key}`;
  }

  if (value) {
    return `--${key}=${
      // Values with spaces need to be quoted. We use JSON.stringify to
      // also escape any nested quotes.
      value.includes(" ") && !value.startsWith('"')
        ? JSON.stringify(value)
        : value
    }`;
  }

  return null;
}

/**
 * Tokenizes the arguments string into an array of strings, supporting quoted
 * values and escaped characters.
 * Converted from: https://github.com/nodejs/node/blob/c29d53c5cfc63c5a876084e788d70c9e87bed880/src/node_options.cc#L1401
 *
 * @param input - The arguments string to be tokenized.
 * @returns An array of strings with the tokenized arguments.
 */
const tokenizeArgs = (input: string): string[] => {
  const args: string[] = [];
  let isInString = false;
  let willStartNewArg = true;

  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    if (char) {
      // Skip any escaped characters in strings.
      if (char === "\\" && isInString) {
        // Ensure we don't have an escape character at the end.
        if (input.length === i + 1) {
          throw new Error("Invalid escape character at the end.");
        }

        // Skip the next character.
        char = input[++i];
        if (!char) {
          continue;
        }
      }
      // If we find a space outside of a string, we should start a new argument.
      else if (char === " " && !isInString) {
        willStartNewArg = true;
        continue;
      }

      // If we find a quote, we should toggle the string flag.
      else if (char === '"') {
        isInString = !isInString;
        continue;
      }

      // If we're starting a new argument, we should add it to the array.
      if (willStartNewArg) {
        args.push(char);
        willStartNewArg = false;
      }
      // Otherwise, add it to the last argument.
      else {
        args[args.length - 1] += char;
      }
    }
  }

  if (isInString) {
    throw new Error("Unterminated string");
  }

  return args;
};

/**
 * Get the node options from the environment variable `NODE_OPTIONS` and returns
 * them as an array of strings.
 *
 * @returns An array of strings with the node options.
 */
const getNodeOptionsArgs = () => {
  if (!process.env.NODE_OPTIONS) return [];

  return tokenizeArgs(process.env.NODE_OPTIONS);
};

/**
 * Stringify the arguments to be used in a command line. It will ignore any
 * argument that has a value of `undefined`. Options that are not allowed in
 * NODE_OPTIONS are returned separately as execArgv.
 *
 * @param args - The arguments to be stringified.
 * @returns An object with `nodeOptions` string and `execArgv` array.
 */
function formatNodeOptions(
  args: Record<string, string | boolean | undefined>
): { nodeOptions: string; execArgv: string[] } {
  const nodeOptionsParts: string[] = [];
  const execArgv: string[] = [];

  for (const [key, value] of Object.entries(args)) {
    const formatted = formatArg(key, value);
    if (formatted === null) continue;

    if (EXEC_ARGV_ONLY_OPTIONS.has(key)) {
      execArgv.push(formatted);
    } else {
      nodeOptionsParts.push(formatted);
    }
  }

  return { nodeOptions: nodeOptionsParts.join(" "), execArgv };
}

export type NodeOptions = Record<string, string | boolean | undefined>;

const parseNodeArgs = (args: string[]): NodeOptions => {
  const { values, tokens } = parseArgs({ args, strict: false, tokens: true });

  // For the `NODE_OPTIONS`, we support arguments with values without the `=`
  // sign. We need to parse them manually.
  let orphan = null;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    if (token.kind === "option-terminator") {
      break;
    }

    // When we encounter an option, if it's value is undefined, we should check
    // to see if the following tokens are positional parameters. If they are,
    // then the option is orphaned, and we can assign it.
    if (token.kind === "option") {
      orphan = !isSet(token.value) ? token : null;
      continue;
    }

    // If the token isn't a positional one, then we can't assign it to the found
    // orphaned option.
    if (token.kind !== "positional") {
      orphan = null;
      continue;
    }

    // If we don't have an orphan, then we can skip this token.
    if (!orphan) {
      continue;
    }

    // If the token is a positional one, and it has a value, so add it to the
    // values object. If it already exists, append it with a space.
    if (orphan.name in values && isString(values[orphan.name])) {
      values[orphan.name] += ` ${token.value}`;
    } else {
      values[orphan.name] = token.value;
    }
  }

  return values;
};

function getParsedNodeOptions(): Record<string, string | boolean | undefined> {
  const args = [...process.execArgv, ...getNodeOptionsArgs()];
  if (args.length === 0) return {};

  return parseNodeArgs(args);
}

/**
 * Get's the debug address from the `NODE_OPTIONS` environment variable. If the
 * address is not found, it returns the default host (`undefined`) and port
 * (`9229`).
 *
 * @returns An object with the host and port of the debug address.
 */
const getParsedDebugAddress = (
  address: string | boolean | undefined
): DebugAddress => {
  if (!address || !isString(address)) {
    return { host: undefined, port: 9229 };
  }

  // The address is in the form of `[host:]port`. Let's parse the address.
  if (address.includes(":")) {
    const [host, port] = address.split(":");
    if (!host || !port) {
      throw new Error(`Invalid debug address: ${address}`);
    }

    return { host, port: Number.parseInt(port, 10) };
  }

  return { host: undefined, port: Number.parseInt(address, 10) };
};

type NodeInspectType = "inspect" | "inspect-brk" | undefined;

/**
 * Get the debug type from the `NODE_OPTIONS` environment variable.
 */
function getNodeDebugType(nodeOptions: NodeOptions): NodeInspectType {
  if (nodeOptions.inspect) {
    return "inspect";
  }
  if (nodeOptions["inspect-brk"] || nodeOptions.inspect_brk) {
    return "inspect-brk";
  }

  return undefined;
}

const cleanupWorkers = (worker: JestWorker) => {
  for (const curWorker of ((worker as any)._workerPool?._workers || []) as {
    _child?: ChildProcess;
  }[]) {
    curWorker._child?.kill("SIGINT");
  }
};

export type WorkerOptions = ConstructorParameters<typeof JestWorker>[1] & {
  /**
   * `-1` if not inspectable
   */
  debuggerPortOffset?: number;

  /**
   * Whether to enable source maps support in the worker, which can improve the quality of stack traces at the cost of increased memory usage and slower performance. Defaults to `false`.
   */
  enableSourceMaps?: boolean;

  /**
   * True if `--max-old-space-size` should not be forwarded to the worker.
   */
  isolatedMemory?: boolean;

  /**
   * The maximum time in milliseconds a worker can run before being terminated. Defaults to `0` (no timeout).
   */
  timeout?: number;

  /**
   * A callback function that is called when the worker is active.
   */
  onActivity?: () => void;

  /**
   * A callback function that is called when the worker activity is aborted.
   */
  onActivityAbort?: () => void;

  /**
   * A callback function that is called when the worker is restarted.
   */
  onRestart?: (method: string, args: any[], attempts: number) => void;

  /**
   * An array of method names that the worker exposes. These methods will be available on the Worker instance and can be called to execute tasks in the worker process.
   */
  exposedMethods: ReadonlyArray<string>;

  /**
   * Whether to use worker threads instead of child processes for the worker implementation. This is an experimental feature and may not be suitable for all use cases. Defaults to `false`.
   */
  enableWorkerThreads?: boolean;

  /**
   * A custom logger function that can be used to log messages from the worker. This can be useful for debugging and monitoring the worker's activity. The function should accept a string message as its argument.
   */
  logger: LogFn;

  /**
   * A callback function that is called when the worker sends a log message.
   */
  onWriteLog?: (payload: WriteLogIpcMessage) => MaybePromise<void>;

  /**
   * A callback function that is called when the worker sends an update command message.
   */
  onUpdateCommand?: (payload: UpdateCommandIpcMessage) => MaybePromise<void>;

  /**
   * A callback function that is called when the worker sends an update hook message.
   */
  onUpdateHook?: (payload: UpdateHookIpcMessage) => MaybePromise<void>;

  /**
   * A callback function that is called when the worker sends an update plugin message.
   */
  onUpdatePlugin?: (payload: UpdatePluginIpcMessage) => MaybePromise<void>;
};

export class Worker {
  #worker: JestWorker | undefined;

  /**
   * Create a new worker instance.
   *
   * @param workerPath - The path to the worker file.
   * @param options - The options for the worker, including exposed methods, timeout, and hooks for activity and restart.
   */
  public constructor(
    protected workerPath: string,
    protected options: WorkerOptions
  ) {
    const {
      timeout,
      onRestart,
      debuggerPortOffset = -1,
      enableSourceMaps = false,
      isolatedMemory = false,
      logger,
      ...rest
    } = this.options;

    let restartPromise: Promise<typeof RESTARTED>;
    let resolveRestartPromise: (arg: typeof RESTARTED) => void;
    let activeTasks = 0;

    this.#worker = undefined;

    // ensure we end workers if they weren't before exit
    process.on("exit", () => {
      this.close();
    });

    const nodeOptions = getParsedNodeOptions();
    const originalOptions = { ...nodeOptions };
    delete nodeOptions.inspect;
    delete nodeOptions["inspect-brk"];
    delete nodeOptions.inspect_brk;
    if (debuggerPortOffset !== -1) {
      const nodeDebugType = getNodeDebugType(originalOptions);
      if (nodeDebugType) {
        const debuggerAddress = getParsedDebugAddress(
          originalOptions[nodeDebugType]
        );
        const address: DebugAddress = {
          host: debuggerAddress.host,
          // current process runs on `address.port`
          port:
            debuggerAddress.port === 0
              ? 0
              : debuggerAddress.port + 1 + debuggerPortOffset
        };
        nodeOptions[nodeDebugType] = formatDebugAddress(address);
      }
    }

    if (enableSourceMaps) {
      nodeOptions["enable-source-maps"] = true;
    }

    if (isolatedMemory) {
      delete nodeOptions["max-old-space-size"];
      delete nodeOptions.max_old_space_size;
    }

    const { nodeOptions: formattedNodeOptions, execArgv } =
      formatNodeOptions(nodeOptions);

    const onHanging = () => {
      const worker = this.#worker;
      if (!worker) {
        return;
      }

      const resolve = resolveRestartPromise;
      // eslint-disable-next-line ts/no-use-before-define
      createWorker();

      logger(
        LogLevelLabel.WARN,
        `Sending SIGTERM signal to static worker due to timeout${
          timeout ? ` of ${formatDuration({ seconds: timeout / 1000 })}` : ""
        }. Subsequent errors may be a result of the worker exiting.`
      );

      void worker.end().then(() => {
        resolve(RESTARTED);
      });
    };

    let hangingTimer: NodeJS.Timeout | false = false;

    const onActivity = () => {
      if (hangingTimer) {
        clearTimeout(hangingTimer);
      }
      if (this.options.onActivity) {
        this.options.onActivity();
      }

      hangingTimer = activeTasks > 0 && setTimeout(onHanging, timeout);
    };

    const createWorker = () => {
      const workerEnv: NodeJS.ProcessEnv = {
        ...process.env,
        ...((rest.forkOptions?.env ?? {}) as any),
        POWERLINES_WORKER: "true",
        NODE_OPTIONS: formattedNodeOptions
      };

      if (workerEnv.FORCE_COLOR === undefined) {
        // Mirror the enablement heuristic from picocolors (see https://github.com/vercel/next.js/blob/6a40da0345939fe4f7b1ae519b296a86dd103432/packages/next/src/lib/picocolors.ts#L21-L24).
        // Picocolors snapshots `process.env`/`stdout.isTTY` at module load time, so when the worker
        // process bootstraps with piped stdio its own check would disable colors. Re-evaluating the
        // same conditions here lets us opt the worker into color output only when the parent would
        // have seen colors, while still respecting explicit opt-outs like NO_COLOR.
        const supportsColors =
          !workerEnv.NO_COLOR &&
          !workerEnv.CI &&
          workerEnv.TERM !== "dumb" &&
          (process.stdout.isTTY || process.stderr?.isTTY);

        if (supportsColors) {
          workerEnv.FORCE_COLOR = "1";
        }
      }

      this.#worker = new JestWorker(workerPath, {
        maxRetries: 0,
        numWorkers: cpus().length ?? 3,
        ...rest,
        forkOptions: {
          ...rest.forkOptions,
          execArgv: [...execArgv, ...(rest.forkOptions?.execArgv ?? [])],
          env: workerEnv
        }
      });
      restartPromise = new Promise(resolve => {
        resolveRestartPromise = resolve;
      });

      /**
       * Jest Worker has two worker types, ChildProcessWorker (uses child_process) and NodeThreadWorker (uses worker_threads)
       * Powerlines uses ChildProcessWorker by default, but it can be switched to NodeThreadWorker with an experimental flag
       *
       * We only want to handle ChildProcessWorker's orphan process issue, so we access the private property "_child":
       * https://github.com/facebook/jest/blob/b38d7d345a81d97d1dc3b68b8458b1837fbf19be/packages/jest-worker/src/workers/ChildProcessWorker.ts
       *
       * But this property is not available in NodeThreadWorker, so we need to check if we are using ChildProcessWorker
       */
      if (!rest.enableWorkerThreads) {
        for (const worker of ((this.#worker as any)._workerPool?._workers ||
          []) as {
          _child?: ChildProcess;
        }[]) {
          worker._child?.on("exit", (code, signal) => {
            if ((code || (signal && signal !== "SIGINT")) && this.#worker) {
              logger(
                LogLevelLabel.ERROR,
                `Worker exited with code: ${code} and signal: ${signal}`
              );

              // if a child process doesn't exit gracefully, we want to bubble up the exit code to the parent process
              process.exit(code ?? 1);
            }
          });

          // if a child process emits a particular message, we track that as activity
          // so the parent process can keep track of progress
          worker._child?.on("message", data => {
            if (
              isSetObject(data) &&
              (data as IpcMessage).type === IpcMessageType.ACTIVITY
            ) {
              onActivity();
            } else {
              const message = parseIpcMessage(data);
              if (message) {
                logger(
                  LogLevelLabel.TRACE,
                  `Received IPC message from worker: ${JSON.stringify(message)}`
                );

                switch (message.type) {
                  case IpcMessageType.WRITE_LOG:
                    if (options.onWriteLog) {
                      void Promise.resolve(
                        options.onWriteLog({
                          ...message,
                          type: IpcMessageType.WRITE_LOG,
                          payload: parseWriteLogMessagePayload(message.payload)
                        })
                      );
                    }
                    break;

                  case IpcMessageType.UPDATE_COMMAND:
                    if (options.onUpdateCommand) {
                      void Promise.resolve(
                        options.onUpdateCommand({
                          ...message,
                          type: IpcMessageType.UPDATE_COMMAND,
                          payload: parseUpdateCommandMessagePayload(
                            message.payload
                          )
                        })
                      );
                    }
                    break;

                  case IpcMessageType.UPDATE_HOOK:
                    if (options.onUpdateHook) {
                      void Promise.resolve(
                        options.onUpdateHook({
                          ...message,
                          type: IpcMessageType.UPDATE_HOOK,
                          payload: parseUpdateHookMessagePayload(
                            message.payload
                          )
                        })
                      );
                    }
                    break;

                  case IpcMessageType.UPDATE_PLUGIN:
                    if (options.onUpdatePlugin) {
                      void Promise.resolve(
                        options.onUpdatePlugin({
                          ...message,
                          type: IpcMessageType.UPDATE_PLUGIN,
                          payload: parseUpdatePluginMessagePayload(
                            message.payload
                          )
                        })
                      );
                    }
                    break;

                  case IpcMessageType.ACTIVITY:
                  case undefined:
                  default: {
                    break;
                  }
                }
              }
            }
          });
        }
      }

      let aborted = false;
      const onActivityAbort = () => {
        if (!aborted) {
          this.options.onActivityAbort?.();
          aborted = true;
        }
      };

      // Listen to the worker's stdout and stderr, if there's any thing logged, abort the activity first
      const abortActivityStreamOnLog = new Transform({
        transform(_chunk, _encoding, callback) {
          onActivityAbort();
          callback();
        }
      });
      // Stop the activity if there's any output from the worker
      this.#worker.getStdout().pipe(abortActivityStreamOnLog);
      this.#worker.getStderr().pipe(abortActivityStreamOnLog);

      // Pipe the worker's stdout and stderr to the parent process
      this.#worker.getStdout().pipe(process.stdout);
      this.#worker.getStderr().pipe(process.stderr);
    };
    createWorker();

    for (const method of rest.exposedMethods) {
      if (method.startsWith("_")) {
        continue;
      }

      (this as any)[method] = timeout
        ? async (...args: any[]) => {
            activeTasks++;
            try {
              let attempts = 0;
              for (;;) {
                onActivity();

                const result = await Promise.race([
                  // eslint-disable-next-line ts/no-unsafe-call
                  (this.#worker as any)[method](
                    args.length > 0 && args[0] ? args[0] : {}
                  ),
                  restartPromise
                ]);
                if (result !== RESTARTED) {
                  return result;
                }
                if (onRestart) {
                  onRestart(method, args, ++attempts);
                }
              }
            } finally {
              activeTasks--;
              onActivity();
            }
          }
        : // eslint-disable-next-line ts/no-unsafe-call
          (this.#worker as any)[method].bind(this.#worker);
    }
  }

  public async end(): ReturnType<JestWorker["end"]> {
    const worker = this.#worker;
    if (!worker) {
      throw new Error("Farm is ended, no more calls can be done to it");
    }

    cleanupWorkers(worker);
    this.#worker = undefined;
    return worker.end();
  }

  /**
   * Quietly end the worker if it exists
   */
  public close(): void {
    if (this.#worker) {
      cleanupWorkers(this.#worker);
      void this.#worker.end();
    }
  }
}
