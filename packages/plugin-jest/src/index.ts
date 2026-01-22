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

import { Config } from "@jest/types";
import { joinPaths } from "@stryke/path/join";
import chalk from "chalk";
import { runCLI } from "jest";
import { formatTime, pluralize } from "jest-util";
import { Plugin } from "powerlines/types/plugin";
import {
  JestPluginContext,
  JestPluginOptions,
  JestPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * Jest plugin for Powerlines.
 *
 * @param options - The Jest plugin user configuration options.
 * @returns A Powerlines plugin that integrates Jest testing.
 */
export const plugin = <TContext extends JestPluginContext = JestPluginContext>(
  options: JestPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "jest",
    async config() {
      const config: Config.Argv = {
        $0: undefined as unknown as string,
        _: [],
        coverage: options.codeCoverage,
        bail: options.bail,
        cache: true,
        cacheDirectory: joinPaths(this.cachePath, "jest"),
        ci: options.ci,
        color: options.colors ?? true,
        debug: this.config.mode === "development",
        detectOpenHandles: options.detectOpenHandles,
        forceExit: options.forceExit,
        logHeapUsage: options.logHeapUsage,
        detectLeaks: options.detectLeaks,
        json: options.json,
        maxWorkers: options.maxWorkers,
        onlyChanged: options.onlyChanged,
        changedSince: options.changedSince,
        outputFile: options.outputFile,
        passWithNoTests: options.passWithNoTests,
        runInBand: options.runInBand,
        showConfig: options.showConfig,
        silent: options.silent,
        testLocationInResults: options.testLocationInResults,
        testNamePattern: options.testNamePattern,
        testPathPatterns: options.testPathPatterns,
        testPathIgnorePatterns: options.testPathIgnorePatterns,
        testTimeout: options.testTimeout,
        colors: options.colors ?? true,
        verbose: options.verbose,
        testResultsProcessor: options.testResultsProcessor,
        updateSnapshot: options.updateSnapshot,
        useStderr: options.useStderr,
        watch: options.watch,
        watchAll: options.watchAll,
        randomize: options.randomize
      };

      if (options.testFile) {
        config._.push(options.testFile);
      }

      if (options.findRelatedTests) {
        const parsedTests = options.findRelatedTests.map(s => s.trim());
        config._.push(...parsedTests);
        config.findRelatedTests = true;
      }

      if (options.coverageDirectory) {
        config.coverageDirectory = joinPaths(
          this.workspaceConfig.workspaceRoot,
          options.coverageDirectory
        );
      }

      if (options.clearCache) {
        config.clearCache = true;
      }

      if (options.reporters && options.reporters.length > 0) {
        config.reporters = options.reporters;
      }

      if (
        Array.isArray(options.coverageReporters) &&
        options.coverageReporters.length > 0
      ) {
        config.coverageReporters = options.coverageReporters;
      }

      return {
        test: {
          jest: config
        }
      } as Partial<JestPluginUserConfig>;
    },
    async test() {
      if (this.config.test.jest) {
        const { results } = await runCLI(this.config.test.jest, [
          joinPaths(this.workspaceConfig.workspaceRoot, this.config.projectRoot)
        ]);

        const snapshotResults = results.snapshot;
        const snapshotsAdded = snapshotResults.added;
        const snapshotsFailed = snapshotResults.unmatched;
        const snapshotsOutdated = snapshotResults.unchecked;
        const snapshotsFilesRemoved = snapshotResults.filesRemoved;
        const snapshotsDidUpdate = snapshotResults.didUpdate;
        const snapshotsPassed = snapshotResults.matched;
        const snapshotsTotal = snapshotResults.total;
        const snapshotsUpdated = snapshotResults.updated;
        const suitesFailed = results.numFailedTestSuites;
        const suitesPassed = results.numPassedTestSuites;
        const suitesPending = results.numPendingTestSuites;
        const suitesRun = suitesFailed + suitesPassed;
        const suitesTotal = results.testResults.length;
        const testsFailed = results.numFailedTests;
        const testsPassed = results.numPassedTests;
        const testsPending = results.numPendingTests;
        const testsTodo = results.numTodoTests;
        const testsTotal = results.numTotalTests;

        const suites = `${
          chalk.bold("Test Suites: ") +
          (suitesFailed
            ? `${chalk.bold(chalk.red(`${suitesFailed} failed`))}, `
            : "") +
          (suitesPending
            ? `${chalk.bold(chalk.yellow(`${suitesPending} skipped`))}, `
            : "") +
          (suitesPassed
            ? `${chalk.bold(chalk.green(`${suitesPassed} passed`))}, `
            : "") +
          (suitesRun !== suitesTotal
            ? `${suitesRun} of ${suitesTotal}`
            : suitesTotal)
        } total`;

        const tests = `${
          chalk.bold("Tests:       ") +
          (testsFailed > 0
            ? `${chalk.bold(chalk.red(`${testsFailed} failed`))}, `
            : "") +
          (testsPending > 0
            ? `${chalk.bold(chalk.yellow(`${testsPending} skipped`))}, `
            : "") +
          (testsTodo > 0
            ? `${chalk.bold(chalk.magenta(`${testsTodo} todo`))}, `
            : "") +
          (testsPassed > 0
            ? `${chalk.bold(chalk.green(`${testsPassed} passed`))}, `
            : "")
        }${testsTotal} total`;

        const snapshots = `${
          chalk.bold("Snapshots:   ") +
          (snapshotsFailed
            ? `${chalk.bold(chalk.red(`${snapshotsFailed} failed`))}, `
            : "") +
          (snapshotsOutdated && !snapshotsDidUpdate
            ? `${chalk.bold(chalk.yellow(`${snapshotsOutdated} obsolete`))}, `
            : "") +
          (snapshotsOutdated && snapshotsDidUpdate
            ? `${chalk.bold(chalk.green(`${snapshotsOutdated} removed`))}, `
            : "") +
          (snapshotsFilesRemoved && !snapshotsDidUpdate
            ? `${chalk.bold(
                chalk.yellow(
                  `${pluralize("file", snapshotsFilesRemoved)} obsolete`
                )
              )}, `
            : "") +
          (snapshotsFilesRemoved && snapshotsDidUpdate
            ? `${chalk.bold(
                chalk.green(
                  `${pluralize("file", snapshotsFilesRemoved)} removed`
                )
              )}, `
            : "") +
          (snapshotsUpdated
            ? `${chalk.bold(chalk.green(`${snapshotsUpdated} updated`))}, `
            : "") +
          (snapshotsAdded
            ? `${chalk.bold(chalk.green(`${snapshotsAdded} written`))}, `
            : "") +
          (snapshotsPassed
            ? `${chalk.bold(chalk.green(`${snapshotsPassed} passed`))}, `
            : "")
        }${snapshotsTotal} total`;

        this.info(
          `
${chalk.bold(`Test result summary:`)}
${suites}
${tests}
${snapshots}
${chalk.bold(`Time:`)}        ${formatTime((Date.now() - results.startTime) / 1000)}
      `
        );
      }
    }
  } as Plugin<TContext>;
};

export default plugin;
