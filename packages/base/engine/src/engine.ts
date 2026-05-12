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
  CleanInlineConfig,
  CreateInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  InlineConfig,
  LintInlineConfig,
  PrepareInlineConfig,
  TestInlineConfig,
  TypesInlineConfig
} from "@powerlines/core";
import { EXECUTION_API_METHODS } from "@powerlines/core/constants";
import { createH3DevToolsHost } from "devframe/node";
import { getPort } from "get-port-please";
import { createApp, fromNodeMiddleware } from "h3";
import { EventEmitter } from "node:events";
import sirv from "sirv";
import { PowerlinesEngineContext } from "./context/engine-context";
import { ExecutionHostWorker } from "./helpers/execution-host-worker";
import { Engine, ExecutionHost } from "./types/api";
import { EngineOptions } from "./types/config";
import { EngineContext } from "./types/context";

/**
 * The Powerlines process' orchestration and coordination API.
 *
 * @public
 */
export class PowerlinesEngine<
  TExecutionAPI extends ReadonlyArray<string> = typeof EXECUTION_API_METHODS
>
  implements Engine<TExecutionAPI>, AsyncDisposable
{
  /**
   * The Powerlines context
   */
  #context: EngineContext;

  /**
   * The execution host, which provides methods to call the execution API functions from the engine context. This allows the engine to invoke commands and other API functions during the execution of Powerlines commands, enabling communication between the engine and the execution contexts.
   */
  #host: ExecutionHost<TExecutionAPI>;

  /**
   * The Powerlines context
   */
  public get context(): EngineContext {
    return this.#context;
  }

  /**
   * The execution host, which provides methods to call the execution API functions from the engine context. This allows the engine to invoke commands and other API functions during the execution of Powerlines commands, enabling communication between the engine and the execution contexts.
   */
  public get host(): ExecutionHost<TExecutionAPI> {
    return this.#host;
  }

  /**
   * Create a new Powerlines Engine instance
   *
   * @param context - The Powerlines context
   * @param host - The API host for the execution workers
   * @returns A new instance of the Powerlines Engine
   */
  public constructor(
    context: EngineContext,
    host: ExecutionHost<TExecutionAPI>
  ) {
    this.#context = context;
    this.#host = host;
  }

  /**
   * Create a new Powerlines project
   *
   * @remarks
   * This method will create a new Powerlines project in the current directory.
   *
   * @param inlineConfig - The inline configuration for the create command
   * @returns A promise that resolves when the project has been created
   */
  public async create(inlineConfig: CreateInlineConfig) {
    const timer = this.context.timer("Create");
    this.context.info("🆕 Creating a new project");

    await this.execute("create", inlineConfig);

    this.context.debug("✔ Create command completed successfully");
    timer();
  }

  /**
   * Generate the Powerlines typescript declaration file
   *
   * @remarks
   * This method will only generate the typescript declaration file for the Powerlines project. It is generally recommended to run the full `prepare` command, which will run this method as part of its process.
   *
   * @param inlineConfig - The inline configuration for the types command
   */
  public async types(inlineConfig: TypesInlineConfig) {
    const timer = this.context.timer("Types");
    this.context.info("🏗️  Generating typescript declarations for the project");

    await this.execute("types", inlineConfig);

    this.context.debug("✔ Types generation has completed successfully");
    timer();
  }

  /**
   * Prepare the Powerlines API
   *
   * @remarks
   * This method will prepare the Powerlines API for use, initializing any necessary resources.
   *
   * @param inlineConfig - The inline configuration for the prepare command
   */
  public async prepare(inlineConfig: PrepareInlineConfig) {
    const timer = this.context.timer("Prepare");
    this.context.info("🏗️ Preparing the project");

    await this.execute("prepare", inlineConfig);

    this.context.debug("✔ Preparation has completed successfully");
    timer();
  }

  /**
   * Clean any previously prepared artifacts
   *
   * @remarks
   * This method will remove the previous Powerlines artifacts from the project.
   *
   * @param inlineConfig - The inline configuration for the clean command
   * @returns A promise that resolves when the clean command has completed
   */
  public async clean(inlineConfig: CleanInlineConfig) {
    const timer = this.context.timer("Clean");
    this.context.info("🧹 Cleaning the previous artifacts");

    await this.execute("clean", inlineConfig);

    this.context.debug("✔ Cleaning completed successfully");
    timer();
  }

  /**
   * Lint the project
   *
   * @param inlineConfig - The inline configuration for the lint command
   * @returns A promise that resolves when the lint command has completed
   */
  public async lint(inlineConfig: LintInlineConfig) {
    const timer = this.context.timer("Lint");
    this.context.info("📝 Linting the project");

    await this.execute("lint", inlineConfig);

    this.context.debug("✔ Linting completed successfully");
    timer();
  }

  /**
   * Test the project
   *
   * @remarks
   * This method will run the tests for the Powerlines project.
   *
   * @param inlineConfig - The inline configuration for the test command
   * @returns A promise that resolves when the test command has completed
   */
  public async test(inlineConfig: TestInlineConfig) {
    const timer = this.context.timer("Test");
    this.context.info("🧪 Running tests for the project");

    await this.execute("test", inlineConfig);

    this.context.debug("✔ Testing completed successfully");
    timer();
  }

  /**
   * Build the project
   *
   * @remarks
   * This method will build the Powerlines project, generating the necessary artifacts.
   *
   * @param inlineConfig - The inline configuration for the build command
   * @returns A promise that resolves when the build command has completed
   */
  public async build(inlineConfig: BuildInlineConfig) {
    const timer = this.context.timer("Build");
    this.context.info("📦 Building the project");

    await this.execute("build", inlineConfig);

    this.context.debug("✔ Build completed successfully");
    timer();
  }

  /**
   * Prepare the documentation for the project
   *
   * @param inlineConfig - The inline configuration for the docs command
   * @returns A promise that resolves when the documentation generation has completed
   */
  public async docs(inlineConfig: DocsInlineConfig) {
    const timer = this.context.timer("Docs");
    this.context.info("📓 Generating documentation for the project");

    await this.execute("docs", inlineConfig);

    this.context.debug("✔ Documentation generation completed successfully");
    timer();
  }

  /**
   * Deploy the project source code
   *
   * @remarks
   * This method will prepare and build the Powerlines project, generating the necessary artifacts for the deployment.
   *
   * @param inlineConfig - The inline configuration for the deploy command
   * @returns A promise that resolves when the deploy command has completed
   */
  public async deploy(inlineConfig: DeployInlineConfig) {
    const timer = this.context.timer("Deploy");
    this.context.info("🚀 Deploying the project");

    await this.execute("deploy", inlineConfig);

    this.context.debug("✔ Deployment completed successfully");
    timer();
  }

  /**
   * Finalization/cleanup processing for the Powerlines API
   *
   * @remarks
   * This step includes any final processes or clean up required by Powerlines. It will be run after each Powerlines command.
   *
   * @returns A promise that resolves when the finalization process has completed
   */
  public async finalize() {
    const timer = this.context.timer("Finalize");
    this.context.info("🏁 Finalization processes started");

    await this.host.end();

    this.context.debug("✔ Finalization completed successfully");
    timer();
  }

  /**
   * Asynchronous disposal method for the Powerlines Engine, which will call the finalize method to perform any necessary cleanup when the engine is disposed of.
   */
  public async [Symbol.asyncDispose]() {
    return this.finalize();
  }

  /**
   * Execute a Powerlines command based on the provided execution path and inline configuration, loading the necessary executions from the context and managing their lifecycle.
   *
   * @remarks
   * This method will load the executions for the specified command and inline configuration, then execute each one while managing their lifecycle, including handling their completion and any errors that may occur during execution.
   *
   * @param method - The path to the execution configuration to load and run, which can be used to specify different execution configurations for different commands or scenarios.
   * @param inlineConfig - Additional configuration options provided at runtime, which can override or supplement the options defined in the user configuration file.
   * @returns A promise that resolves when all executions for the specified command have completed
   */
  protected async execute(
    method: TExecutionAPI[number],
    inlineConfig: InlineConfig
  ) {
    await Promise.all(
      (await this.context.loadExecutions(method, inlineConfig)).map(
        async execution => {
          try {
            await this.host[method]({
              options: execution.options,
              inlineConfig
            });
          } catch (error) {
            this.context.error(
              `Execution of method "${method}" failed for execution with invocation ID "${
                execution.invocationId
              }" and execution ID "${execution.options.executionId}": \n\n${
                error instanceof Error
                  ? error.stack || error.message
                  : String(error)
              }`
            );

            throw error;
          } finally {
            this.context.completeExecution(
              execution.invocationId,
              execution.options.executionId
            );
          }
        }
      )
    );
  }
}

export async function createContext(options: EngineOptions) {
  const port =
    options.port ??
    (await getPort({
      host: options.host || "localhost",
      random: true
    }));

  const app = createApp();
  const host = createH3DevToolsHost({
    appName: options.framework || "powerlines",
    origin: `http://${options.host || "localhost"}:${port}`,
    mount: (base, dir) => {
      app.use(base, fromNodeMiddleware(sirv(dir, { dev: true, single: true })));
    }
  });

  return PowerlinesEngineContext.from(options, host, {
    backend: "websocket",
    websocket: port
  });
}

export async function createEngine<TExecutionAPI extends ReadonlyArray<string>>(
  options: EngineOptions,
  executionHostPath = "@powerlines/engine/execution-host",
  executionMethods: TExecutionAPI = EXECUTION_API_METHODS as unknown as TExecutionAPI
) {
  EventEmitter.setMaxListeners(100);

  const context = await createContext(options);
  const host = await ExecutionHostWorker.from<TExecutionAPI>(
    executionHostPath,
    {
      context,
      executionMethods
    }
  );

  return new PowerlinesEngine<TExecutionAPI>(context, host);
}
