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
  API,
  BuildInlineConfig,
  CleanInlineConfig,
  DeployInlineConfig,
  DocsInlineConfig,
  EngineOptions,
  ExecutionContext,
  InlineConfig,
  LintInlineConfig,
  NewInlineConfig,
  PrepareInlineConfig,
  ResolvedConfig,
  TestInlineConfig,
  TypesInlineConfig
} from "@powerlines/core";
import { colorText } from "@powerlines/core/plugin-utils/logging";
import { Unstable_ExecutionContext } from "@powerlines/core/types/_internal";
import { isDevelopment, isTest } from "@stryke/env/environment-checks";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { PartialKeys } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import { PowerlinesExecution } from "./_internal/execution";
import { mergeConfigs } from "./_internal/helpers/hooks";
import { PowerlinesExecutionContext } from "./context/execution-context";

/**
 * The Powerlines API class
 *
 * @remarks
 * This class is responsible for managing the Powerlines project lifecycle, including initialization, building, and finalization.
 *
 * @public
 */
export class PowerlinesAPI<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>
  extends PowerlinesExecution<TResolvedConfig>
  implements API<TResolvedConfig>, AsyncDisposable
{
  /**
   * Create a new Powerlines API instance
   *
   * @param context - The Powerlines context
   */
  protected constructor(context: ExecutionContext<TResolvedConfig>) {
    super(context);
  }

  /**
   * Initialize a Powerlines API instance
   *
   * @param options - The options to initialize the API with
   * @returns A new instance of the Powerlines API
   */
  public static async fromOptions<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: EngineOptions,
    override?: InlineConfig
  ): Promise<PowerlinesAPI<TResolvedConfig>> {
    const api = new PowerlinesAPI<TResolvedConfig>(
      await PowerlinesExecutionContext.fromOptions<TResolvedConfig>({
        executionId: uuid(),
        cwd: process.cwd(),
        mode: isDevelopment ? "development" : isTest ? "test" : "production",
        framework: "powerlines",
        logLevel: "info",
        ...options,
        executionIndex: 0
      })
    );
    if (override) {
      api.context.config.inlineConfig = override;
      await api.context.setup();
    }

    (api.context as Unstable_ExecutionContext<TResolvedConfig>).$$internal = {
      api,
      addPlugin: api.addPlugin.bind(api)
    };

    const timer = api.context.timer("Initialization");

    for (const plugin of api.context.config.plugins.flat(10) ?? []) {
      await api.addPlugin(plugin);
    }

    if (api.context.plugins.length === 0) {
      api.context.warn(
        "No Powerlines plugins were specified in the options. Please ensure this is correct, as it is generally not recommended."
      );
    } else {
      api.context.info(
        `Loaded ${api.context.plugins.length} ${titleCase(
          api.context.config.framework
        )} plugin${api.context.plugins.length > 1 ? "s" : ""}: \n${api.context.plugins
          .map((plugin, index) => ` ${index + 1}. ${colorText(plugin.name)}`)
          .join("\n")}`
      );
    }

    const pluginConfig = await api.callHook("config", {
      environment: await api.context.getEnvironment(),
      sequential: true,
      result: "merge",
      merge: mergeConfigs
    });
    if (isSetObject(pluginConfig)) {
      api.context.config.pluginConfig =
        pluginConfig as TResolvedConfig["pluginConfig"];
      await api.context.setup();
    }

    timer();

    return api;
  }

  /**
   * Generate the Powerlines typescript declaration file
   *
   * @remarks
   * This method will only generate the typescript declaration file for the Powerlines project. It is generally recommended to run the full `prepare` command, which will run this method as part of its process.
   *
   * @param inlineConfig - The inline configuration for the types command
   */
  public override async types(
    inlineConfig: PartialKeys<TypesInlineConfig, "command"> = {
      command: "types"
    }
  ) {
    const timer = this.context.timer("Types");
    this.context.info(
      " 🏗️  Generating typescript declarations for the Powerlines project"
    );

    await super.types(inlineConfig);

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
  public override async prepare(
    inlineConfig:
      | PartialKeys<PrepareInlineConfig, "command">
      | PartialKeys<TypesInlineConfig, "command">
      | PartialKeys<NewInlineConfig, "command">
      | PartialKeys<CleanInlineConfig, "command">
      | PartialKeys<BuildInlineConfig, "command">
      | PartialKeys<LintInlineConfig, "command">
      | PartialKeys<TestInlineConfig, "command">
      | PartialKeys<DocsInlineConfig, "command">
      | PartialKeys<DeployInlineConfig, "command"> = { command: "prepare" }
  ) {
    const timer = this.context.timer("Prepare");
    this.context.info(" 🏗️  Preparing the Powerlines project");

    this.context.debug(
      " Aggregating configuration options for the Powerlines project"
    );

    await super.prepare(inlineConfig);

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
  public override async new(
    inlineConfig: PartialKeys<NewInlineConfig, "command">
  ) {
    const timer = this.context.timer("New");
    this.context.info(" 🆕 Creating a new Powerlines project");

    await super.new(inlineConfig);

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
  public override async clean(
    inlineConfig:
      | PartialKeys<CleanInlineConfig, "command">
      | PartialKeys<PrepareInlineConfig, "command"> = {
      command: "clean"
    }
  ) {
    const timer = this.context.timer("Clean");
    this.context.info(" 🧹 Cleaning the previous Powerlines artifacts");

    await super.clean(inlineConfig);

    this.context.debug("✔ Powerlines cleaning completed successfully");
    timer();
  }

  /**
   * Lint the project
   *
   * @param inlineConfig - The inline configuration for the lint command
   * @returns A promise that resolves when the lint command has completed
   */
  public override async lint(
    inlineConfig:
      | PartialKeys<LintInlineConfig, "command">
      | PartialKeys<BuildInlineConfig, "command"> = { command: "lint" }
  ) {
    const timer = this.context.timer("Lint");
    this.context.info(" 📝 Linting the Powerlines project");

    await super.lint(inlineConfig);

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
  public override async test(
    inlineConfig:
      | PartialKeys<TestInlineConfig, "command">
      | PartialKeys<BuildInlineConfig, "command"> = { command: "test" }
  ) {
    const timer = this.context.timer("Test");
    this.context.info(" 🧪 Running tests for the Powerlines project");

    await super.test(inlineConfig);

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
  public override async build(
    inlineConfig: PartialKeys<BuildInlineConfig, "command"> = {
      command: "build"
    }
  ) {
    const timer = this.context.timer("Build");
    this.context.info(" 📦 Building the Powerlines project");

    await super.build(inlineConfig);

    this.context.debug("✔ Powerlines build completed successfully");
    timer();
  }

  /**
   * Prepare the documentation for the project
   *
   * @param inlineConfig - The inline configuration for the docs command
   * @returns A promise that resolves when the documentation generation has completed
   */
  public override async docs(
    inlineConfig: DocsInlineConfig = { command: "docs" }
  ) {
    const timer = this.context.timer("Docs");
    this.context.info(
      " 📓 Generating documentation for the Powerlines project"
    );

    await super.docs(inlineConfig);

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
  public override async deploy(
    inlineConfig: PartialKeys<DeployInlineConfig, "command"> = {
      command: "deploy"
    }
  ) {
    const timer = this.context.timer("Deploy");
    this.context.info(" 🚀 Deploying the Powerlines project");

    await super.deploy(inlineConfig);

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
  public override async finalize() {
    const timer = this.context.timer("Finalization");
    this.context.info(" 🏁 Powerlines finalization processes started");

    await super.finalize();

    this.context.debug("✔ Powerlines finalization completed successfully");
    timer();
  }

  /**
   * Dispose of the Powerlines API instance
   *
   * @remarks
   * This method will finalize the Powerlines API instance, cleaning up any resources used.
   */
  public async [Symbol.asyncDispose]() {
    await this.finalize();
  }
}
