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

import { InlineConfig, Mode } from "@powerlines/core";
import { getDefaultMode } from "@powerlines/core/lib/config";
import { toArray } from "@stryke/convert/to-array";
import { resolve } from "@stryke/fs/resolve";
import { appendPath } from "@stryke/path/append";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNumber } from "@stryke/type-checks/is-number";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { AnyFunction } from "@stryke/types/base";
import { formatDuration } from "date-fns/formatDuration";
import { createJiti } from "jiti";
import { pipeline } from "node:stream";
import { parseArgs } from "node:util";
import {
  MessageChannel,
  StructuredSerializeOptions
} from "node:worker_threads";
import Piscina from "piscina";
import { MessagePortDuplex } from "../helpers/stream";
import { ExecutionApi } from "../types/api";
import { EngineExecutionOptions } from "../types/config";
import { EngineContext } from "../types/context";

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

export type NodeOptions = Record<string, string | boolean | undefined>;

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

export interface ExecutionApiWorkerOptions<
  TExecutionApi extends ReadonlyArray<string>
> {
  // /**
  //  * `-1` if not inspectable
  //  */
  // debuggerPortOffset?: number;

  // /**
  //  * Whether to enable source maps support in the worker, which can improve the quality of stack traces at the cost of increased memory usage and slower performance. Defaults to `false`.
  //  */
  // enableSourceMaps?: boolean;

  /**
   * The maximum time in milliseconds a worker can run before being terminated.
   *
   * @defaultValue 900000 (15 minutes)
   */
  timeout?: number;

  /**
   * True if `--max-old-space-size` should not be forwarded to the worker.
   */
  isolatedMemory?: boolean;

  /**
   * The mode to run the worker in, which can affect how the worker is initialized and how it behaves. This is determined based on the resolved configuration of the engine, and can be used to optimize the worker for different environments (e.g., development, production, etc.).
   */
  mode?: Mode;

  /**
   * An optional root to resolve the execution host path from, which can be used to specify a custom root directory for the worker to use when resolving paths and loading configuration files. If this option is not provided, the worker will use the current working directory as the root directory by default.
   */
  root?: string;

  /**
   * The context of the {@link @powerlines/engine#Engine | Engine instance}, which can be used to access the engine's state and services within the worker.
   */
  context: EngineContext;

  /**
   * An array of command names that the execution API worker exposes. These commands will be available on the execution API worker instance and can be called to execute tasks in the worker process.
   */
  commands?: TExecutionApi;
}

export class ExecutionApiWorker<TExecutionApi extends ReadonlyArray<string>> {
  #worker: Piscina | undefined;

  /**
   * Creates a new instance of the Execution API Worker class, which manages a worker process for executing tasks related to the Powerlines Engine. The worker is initialized with the specified options and can be used to run tasks in an isolated environment, with support for automatic restarts and activity monitoring.
   *
   * @param apiPath - The path to the Execution API file.
   * @param options - The options for configuring the worker, including the execution context, exposed methods, timeout, and mode.
   * @returns A promise that resolves to an instance of the ExecutionApiWorker class.
   */
  public static async from<TExecutionApi extends ReadonlyArray<string>>(
    apiPath: string,
    options: ExecutionApiWorkerOptions<TExecutionApi>
  ) {
    const mode = await getDefaultMode(options.context.cwd);

    const resolvedPath = await resolve(apiPath, {
      paths: [
        options.context.cwd,
        options.root ? appendPath(options.root, options.context.cwd) : undefined
      ].filter(Boolean) as string[]
    });
    if (!resolvedPath) {
      throw new Error(
        `Could not resolve the provided Execution API path: \`${apiPath}\`.`
      );
    }

    let commands = toArray((options.commands ?? []) as string[]);
    if (commands.length === 0) {
      const jiti = createJiti(import.meta.url, {
        cache: false,
        interopDefault: true,
        tsconfigPaths: true
      });
      const mod: Record<string, AnyFunction> = await jiti.import(
        jiti.esmResolve(resolvedPath),
        { default: true }
      );
      if (isSetObject(mod)) {
        commands = Object.keys(mod).filter(name => isFunction(mod[name]));
      }
    }

    return new ExecutionApiWorker<TExecutionApi>(resolvedPath, commands, {
      mode,
      ...options
    }) as unknown as ExecutionApi<TExecutionApi>;
  }

  /**
   * Create a new API worker instance.
   *
   * @param executionApiPath - The path to the worker file.
   * @param commands - An array of command names that the worker exposes.
   * @param options - The options for the worker, including exposed commands, timeout, and hooks for activity and restart.
   */
  public constructor(
    protected executionApiPath: string,
    protected commands: string[],
    protected options: ExecutionApiWorkerOptions<TExecutionApi>
  ) {
    const {
      timeout = 900_000,
      isolatedMemory = false,
      mode = "production",
      context
    } = this.options;

    const logger = context.extendLogger({ category: "communication" });

    let restartPromise: Promise<typeof RESTARTED>;
    let resolveRestartPromise: (arg: typeof RESTARTED) => void;
    let activeTasks = 0;

    this.#worker = undefined;

    // ensure we end workers if they weren't before exit
    process.on("exit", () => {
      void this.finalize();
    });

    let nodeOptions = {} as {
      [longOption: string]: string | boolean | undefined;
    };

    const args: string[] = [...process.execArgv];
    if (process.env.NODE_OPTIONS) {
      let isInString = false;
      let willStartNewArg = true;

      const stringifiedNodeOptions = process.env.NODE_OPTIONS.split(" ").filter(
        part =>
          ((part.startsWith('"') && part.endsWith('"')) ||
            (part.startsWith("'") && part.endsWith("'"))) &&
          part
            .replace(/^['"]|['"]$/g, "")
            .split(" ")
            .filter(isSetString).length > 0 &&
          part
            .replace(/^['"]|['"]$/g, "")
            .split(" ")
            .filter(isSetString)
            .every(p => p.startsWith("--"))
      );
      args.push(
        ...stringifiedNodeOptions.map(part => part.replace(/^['"]|['"]$/g, ""))
      );

      const inputNodeModules = stringifiedNodeOptions.reduce((acc, part) => {
        return acc.replace(part, "").trim();
      }, process.env.NODE_OPTIONS);
      for (let i = 0; i < inputNodeModules.length; i++) {
        let char = inputNodeModules[i];
        if (char) {
          // Skip any escaped characters in strings.
          if (char === "\\" && isInString) {
            // Ensure we don't have an escape character at the end.
            if (inputNodeModules.length === i + 1) {
              throw new Error("Invalid escape character at the end.");
            }

            // Skip the next character.
            char = inputNodeModules[++i];
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
    }

    if (args.length > 0) {
      const { values, tokens } = parseArgs({
        args,
        strict: false,
        tokens: true
      });
      nodeOptions = values;

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
        if (orphan.name in nodeOptions && isString(nodeOptions[orphan.name])) {
          nodeOptions[orphan.name] += ` ${token.value}`;
        } else {
          nodeOptions[orphan.name] = token.value;
        }
      }
    }

    const originalOptions = { ...nodeOptions };

    delete nodeOptions.inspect;
    delete nodeOptions["inspect-brk"];
    delete nodeOptions.inspect_brk;

    if (mode === "development") {
      const nodeDebugType = getNodeDebugType(originalOptions);
      if (nodeDebugType) {
        const debuggerAddress = getParsedDebugAddress(
          originalOptions[nodeDebugType]
        );
        const address: DebugAddress = {
          host: debuggerAddress.host,
          // current process runs on `address.port`
          port: debuggerAddress.port === 0 ? 0 : debuggerAddress.port + 1 + 1
        };
        nodeOptions[nodeDebugType] = formatDebugAddress(address);
      }

      nodeOptions["enable-source-maps"] = true;
    }

    if (isolatedMemory) {
      delete nodeOptions["max-old-space-size"];
      delete nodeOptions.max_old_space_size;
    }

    const execArgv: string[] = [];
    const nodeOptionsParts: string[] = [];
    for (const [key, value] of Object.entries(nodeOptions)) {
      let formatted: string | null = null;
      if (value === true) {
        formatted = `--${key}`;
      } else if (value) {
        formatted = `--${key}=${
          // Values with spaces need to be quoted. We use JSON.stringify to
          // also escape any nested quotes.
          value.includes(" ") && !value.startsWith('"')
            ? JSON.stringify(value)
            : value
        }`;
      }

      if (formatted === null) {
        continue;
      }

      if (
        [
          "experimental-network-inspection",
          "experimental-storage-inspection",
          "experimental-worker-inspection",
          "experimental-inspector-network-resource"
        ].includes(key)
      ) {
        execArgv.push(formatted);
      } else {
        nodeOptionsParts.push(formatted);
      }
    }

    const onHanging = () => {
      if (!this.#worker) {
        return;
      }

      const resolve = resolveRestartPromise;
      // eslint-disable-next-line ts/no-use-before-define
      createWorker();

      logger.warn(
        `Sending SIGTERM signal to worker due to timeout${
          timeout ? ` of ${formatDuration({ seconds: timeout / 1000 })}` : ""
        }. Subsequent errors may be a result of the worker exiting.`
      );

      void this.finalize().then(() => {
        resolve(RESTARTED);
      });
    };

    let hangingTimer: NodeJS.Timeout | false = false;

    const onActivity = () => {
      if (hangingTimer) {
        clearTimeout(hangingTimer);
      }

      hangingTimer = activeTasks > 0 && setTimeout(onHanging, timeout);
    };

    const createWorker = () => {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        NODE_ENV: mode,
        NODE_OPTIONS: nodeOptionsParts.join(" "),
        POWERLINES_EXECUTION_WORKER: "true"
      };

      // Mirror the enablement heuristic from picocolors (see https://github.com/vercel/next.js/blob/6a40da0345939fe4f7b1ae519b296a86dd103432/packages/next/src/lib/picocolors.ts#L21-L24).
      // Picocolors snapshots `process.env`/`stdout.isTTY` at module load time, so when the worker
      // process bootstraps with piped stdio its own check would disable colors. Re-evaluating the
      // same conditions here lets us opt the worker into color output only when the parent would
      // have seen colors, while still respecting explicit opt-outs like NO_COLOR.
      if (
        env.FORCE_COLOR === undefined &&
        !env.NO_COLOR &&
        !env.CI &&
        env.TERM !== "dumb" &&
        (process.stdout.isTTY || process.stderr?.isTTY)
      ) {
        env.FORCE_COLOR = "1";
      }

      logger.debug(
        `Creating worker from file ${
          executionApiPath
        } with execution arguments: ${JSON.stringify(execArgv, null, 2)}`
      );

      this.#worker = new Piscina({
        filename: executionApiPath,
        execArgv,
        env
      });

      restartPromise = new Promise(resolve => {
        resolveRestartPromise = resolve;
      });

      this.#worker.on("exit", (code, signal) => {
        logger.debug(
          `Worker process exited with code ${code} and signal ${signal}`
        );

        if ((code || (signal && signal !== "SIGINT")) && this.#worker) {
          const error = new Error(
            `Execution Host Worker exited unexpectedly with code ${
              code
            } and signal ${signal}`
          );
          logger.error(error);

          void this.finalize().then(() => {
            throw error;
          });
        }
      });

      this.#worker.on("error", error => {
        logger.error({
          meta: { category: "communication" },
          message: `Worker process emitted an error: ${error.message}`,
          error
        });
      });

      // if a child process emits a particular message, we track that as activity
      // so the parent process can keep track of progress
      this.#worker.on("message", data => {
        onActivity();

        if (Array.isArray(data) && data.length > 1 && isNumber(data[0])) {
          if (data[0] === 0) {
            logger.trace(
              `Received message from worker: ${JSON.stringify(data.slice(1), null, 2)}`
            );
          } else {
            logger.debug(
              `Received error message from worker: ${JSON.stringify(
                data.slice(1),
                null,
                2
              )}`
            );
          }
        }

        logger.trace(
          `Received message from worker: ${JSON.stringify(data, null, 2)}`
        );
      });
    };

    createWorker();

    for (const command of this.commands) {
      if (command.startsWith("_")) {
        continue;
      }

      const callWorker = async (
        options: EngineExecutionOptions,
        inlineConfig: InlineConfig
      ) => {
        if (!this.#worker) {
          throw new Error("Execution Host Worker is not initialized");
        }

        const { port1, port2 } = new MessageChannel();
        const promise = this.#worker.run(
          { command, options, inlineConfig, port: port2 },
          {
            transferList: [port2] as StructuredSerializeOptions
          }
        );

        let aborted = false;
        const onActivityAbort = () => {
          if (!aborted) {
            aborted = true;
          }
        };
        const duplex = new MessagePortDuplex(port1, { onActivityAbort });

        pipeline(
          duplex,
          process.stdout,
          (err: NodeJS.ErrnoException | null) => {
            if (err) {
              logger.debug(
                `Received exception message from worker: ${JSON.stringify(
                  err,
                  null,
                  2
                )}`
              );

              throw err;
            }
          }
        );

        await promise;
      };

      (this as any)[command] = timeout
        ? async (
            options: EngineExecutionOptions,
            inlineConfig: InlineConfig
          ) => {
            activeTasks++;
            try {
              let attempts = 0;
              for (;;) {
                onActivity();

                const result = await Promise.race([
                  callWorker(options, inlineConfig),
                  restartPromise
                ]);
                if (result !== RESTARTED) {
                  return result;
                }

                logger.warn(
                  `Execution Host Worker was restarted while calling method "${
                    command
                  }" (attempt ${attempts++}). Retrying the call...`
                );
              }
            } finally {
              activeTasks--;
              onActivity();
            }
          }
        : callWorker.bind(this);
    }
  }

  /**
   * Closes the worker process, terminating it if it's still running. This method should be called when the worker is no longer needed, to free up system resources and ensure a clean shutdown. If the worker has already been terminated, this method will have no effect.
   */
  public async finalize(): Promise<void> {
    const worker = this.#worker;
    if (!worker) {
      return;
    }

    await worker.close({
      force: true
    });
    this.#worker = undefined;
  }
}
