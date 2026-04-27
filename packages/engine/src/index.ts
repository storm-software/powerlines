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
  DeployInlineConfig,
  DocsInlineConfig,
  Engine,
  EngineContext,
  EngineOptions,
  ExecutionWorkerProcess,
  LintInlineConfig,
  NewInlineConfig,
  PrepareInlineConfig,
  TestInlineConfig,
  TypesInlineConfig
} from "@powerlines/core";
import { POWERLINES_API_FUNCTIONS } from "@powerlines/core/constants";
import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path/join";
import { PartialKeys } from "@stryke/types/base";
import { Worker } from "./_internal/helpers/worker";
import { PowerlinesEngineContext } from "./context/engine-context";

/**
 * The Powerlines Engine class
 *
 * @remarks
 * This class is responsible for managing the Powerlines project lifecycle, including initialization, building, and finalization.
 *
 * @public
 */
export class PowerlinesEngine implements Engine, AsyncDisposable {
  /**
   * The Powerlines context
   */
  #context: EngineContext;

  /**
   * The worker pool for managing child threads
   */
  #worker!: ExecutionWorkerProcess;

  /**
   * Create a new Powerlines Engine instance
   *
   * @param options - The options to initialize the context with
   * @returns A new instance of the Powerlines Engine
   */
  public static async fromOptions(
    options: EngineOptions
  ): Promise<PowerlinesEngine> {
    const api = new PowerlinesEngine(
      await PowerlinesEngineContext.fromOptions(options)
    );

    const packagePath = await resolvePackage("@powerlines/engine");
    if (!packagePath) {
      throw new Error(
        "Could not resolve `@powerlines/engine` package location."
      );
    }

    api.#worker = new Worker(joinPaths(packagePath, "./_internal/worker.mjs"), {
      enableSourceMaps: options.mode === "development",
      exposedMethods: POWERLINES_API_FUNCTIONS,
      logger: api.context.extendLogger({ category: "ipc" })
    }) as unknown as ExecutionWorkerProcess;

    return api;
  }

  /**
   * The Powerlines context
   */
  public get context(): EngineContext {
    return this.#context;
  }

  /**
   * Create a new Powerlines Engine instance
   *
   * @param context - The Powerlines context
   */
  protected constructor(context: EngineContext) {
    this.#context = context;
  }

  /**
   * Generate the Powerlines typescript declaration file
   *
   * @remarks
   * This method will only generate the typescript declaration file for the Powerlines project. It is generally recommended to run the full `prepare` command, which will run this method as part of its process.
   *
   * @param inlineConfig - The inline configuration for the types command
   */
  public async types(
    inlineConfig: PartialKeys<
      Omit<TypesInlineConfig, "configFile">,
      "command"
    > = {
      command: "types"
    }
  ) {
    const timer = this.context.timer("Types");
    this.context.info(
      " 🏗️  Generating typescript declarations for the Powerlines project"
    );

    this.context.debug(
      " Aggregating configuration options for the Powerlines project"
    );

    inlineConfig.command ??= "types";
    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.types({
          options: execution.options,
          config: inlineConfig as TypesInlineConfig
        })
      )
    );

    this.context.debug(
      "✔ Powerlines types generation has completed successfully"
    );
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
  public async prepare(
    inlineConfig:
      | PartialKeys<Omit<PrepareInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<TypesInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<NewInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<CleanInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<BuildInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<LintInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<DocsInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<DeployInlineConfig, "configFile">, "command"> = {
      command: "prepare"
    }
  ) {
    const timer = this.context.timer("Prepare");
    this.context.info(" 🏗️  Preparing the Powerlines project");

    this.context.debug(
      "Aggregating configuration options for the Powerlines project"
    );

    inlineConfig.command ??= "prepare";
    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.prepare({
          options: execution.options,
          config: inlineConfig as PrepareInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines preparation has completed successfully");
    timer();
  }

  /**
   * Create a new Powerlines project
   *
   * @remarks
   * This method will create a new Powerlines project in the current directory.
   *
   * @param inlineConfig - The inline configuration for the new command
   * @returns A promise that resolves when the project has been created
   */
  public async new(inlineConfig: PartialKeys<NewInlineConfig, "command">) {
    const timer = this.context.timer("New");
    this.context.info(" 🆕 Creating a new Powerlines project");

    inlineConfig.command ??= "new";
    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.new({
          options: execution.options,
          config: inlineConfig as NewInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines new command completed successfully");
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
  public async clean(
    inlineConfig:
      | PartialKeys<Omit<CleanInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<PrepareInlineConfig, "configFile">, "command"> = {
      command: "clean"
    }
  ) {
    const timer = this.context.timer("Clean");
    this.context.info(" 🧹 Cleaning the previous Powerlines artifacts");

    inlineConfig.command ??= "clean";
    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.clean({
          options: execution.options,
          config: inlineConfig as CleanInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines cleaning completed successfully");
    timer();
  }

  /**
   * Lint the project
   *
   * @param inlineConfig - The inline configuration for the lint command
   * @returns A promise that resolves when the lint command has completed
   */
  public async lint(
    inlineConfig:
      | PartialKeys<Omit<LintInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<BuildInlineConfig, "configFile">, "command"> = {
      command: "lint"
    }
  ) {
    const timer = this.context.timer("Lint");
    this.context.info(" 📝 Linting the Powerlines project");

    inlineConfig.command ??= "lint";
    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.lint({
          options: execution.options,
          config: inlineConfig as LintInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines linting completed successfully");
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
  public async test(
    inlineConfig:
      | PartialKeys<Omit<TestInlineConfig, "configFile">, "command">
      | PartialKeys<Omit<BuildInlineConfig, "configFile">, "command"> = {
      command: "test"
    }
  ) {
    const timer = this.context.timer("Test");
    this.context.info(" 🧪 Running tests for the Powerlines project");

    inlineConfig.command ??= "test";
    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.test({
          options: execution.options,
          config: inlineConfig as TestInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines testing completed successfully");
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
  public async build(
    inlineConfig: PartialKeys<
      Omit<BuildInlineConfig, "configFile">,
      "command"
    > = {
      command: "build"
    }
  ) {
    const timer = this.context.timer("Build");
    this.context.info(" 📦 Building the Powerlines project");

    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.build({
          options: execution.options,
          config: inlineConfig as BuildInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines build completed successfully");
    timer();
  }

  /**
   * Prepare the documentation for the project
   *
   * @param inlineConfig - The inline configuration for the docs command
   * @returns A promise that resolves when the documentation generation has completed
   */
  public async docs(
    inlineConfig: PartialKeys<
      Omit<DocsInlineConfig, "configFile">,
      "command"
    > = {
      command: "docs"
    }
  ) {
    const timer = this.context.timer("Docs");
    this.context.info(
      " 📓 Generating documentation for the Powerlines project"
    );

    inlineConfig.command ??= "docs";

    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.docs({
          options: execution.options,
          config: inlineConfig as DocsInlineConfig
        })
      )
    );

    this.context.debug(
      "✔ Powerlines documentation generation completed successfully"
    );
    timer();
  }

  /**
   * Deploy the project source code
   *
   * @remarks
   * This method will prepare and build the Powerlines project, generating the necessary artifacts for the deployment.
   *
   * @param inlineConfig - The inline configuration for the deploy command
   */
  public async deploy(
    inlineConfig: PartialKeys<
      Omit<DeployInlineConfig, "configFile">,
      "command"
    > = {
      command: "deploy"
    }
  ) {
    const timer = this.context.timer("Deploy");
    this.context.info(" 🚀 Deploying the Powerlines project");

    inlineConfig.command ??= "deploy";

    await Promise.all(
      this.#context.executions.map(async execution =>
        this.#worker.deploy({
          options: execution.options,
          config: inlineConfig as DeployInlineConfig
        })
      )
    );

    this.context.debug("✔ Powerlines deploy completed successfully");
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
    const timer = this.context.timer("Finalization");
    this.context.info(" 🏁 Powerlines finalization processes started");

    this.#worker.close();

    this.context.debug("✔ Powerlines finalization completed successfully");
    timer();
  }

  async [Symbol.asyncDispose]() {
    return this.finalize();
  }
}
