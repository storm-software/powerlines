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
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export interface JestPluginOptions {
  /**
   * Indicates that test coverage information should be collected and reported in the output.
   *
   * @see https://jestjs.io/docs/cli#--coverage
   */
  codeCoverage?: boolean;

  /**
   * The path to a Jest config file specifying how to find and execute tests. If no `rootDir` is set in the config, the directory containing the config file is assumed to be the `rootDir` for the project.
   *
   * @see https://jestjs.io/docs/cli#--configpath
   */
  configFile?: string;

  /**
   * Attempt to collect and print open handles preventing Jest from exiting cleanly after all tests have completed.
   *
   * @see https://jestjs.io/docs/cli#--detectopenhandles
   */
  detectOpenHandles?: boolean;

  /**
   * Logs the heap usage after every test. Useful to debug memory leaks. Use together with --runInBand and --expose-gc in node.
   */
  logHeapUsage?: boolean;

  /**
   * **EXPERIMENTAL**: Detect memory leaks in tests. After executing a test, it will try to garbage collect the global object used, and fail if it was leaked
   */
  detectLeaks?: boolean;

  /**
   * The name of the file to test.
   */
  testFile?: string;

  /**
   * Exit the test suite immediately after `n` number of failing tests.
   *
   * @see https://jestjs.io/docs/cli#--bail
   */
  bail?: boolean | number;

  /**
   * Continuous Integration mode. If true, Jest will run tests once and exit.
   */
  ci?: boolean;

  /**
   * Enables colored output.
   */
  color?: boolean;

  /**
   * Deletes the Jest cache directory and then exits without running tests. Will delete Jest's default cache directory.
   */
  clearCache?: boolean;

  /**
   * Find and run the tests that cover a list of source files.
   *
   * @see https://jestjs.io/docs/cli#--findrelatedtests
   */
  findRelatedTests?: string[];

  /**
   * Force Jest to exit after all tests have completed running. This is useful when resources set up by test code cannot be adequately cleaned up.
   */
  forceExit?: boolean;

  /**
   * Enables JSON output.
   */
  json?: boolean;

  /**
   * Specifies the maximum number of workers the worker-pool will spawn for running tests. This defaults to the number of the cores available on your machine. Useful for CI. (its usually best not to override this default)
   *
   * @see https://jestjs.io/docs/cli#--maxworkersnumberstring
   */
  maxWorkers?: number | string;

  /**
   * Attempts to identify which tests to run based on which files have changed in the current repository. Only works if you're running tests in a `git` or `hg` repository at the moment.
   *
   * @see https://jestjs.io/docs/cli#--onlychanged
   */
  onlyChanged?: boolean;

  /**
   * Runs tests related to the changes since the provided branch or commit hash. If the current branch has diverged from the given branch, then only changes made locally will be tested.
   *
   * @see https://jestjs.io/docs/cli#--changedsince
   */
  changedSince?: string;

  /**
   * The path to a JSON file that Jest should write test results to.
   */
  outputFile?: string;

  /**
   * Exit with code 0 even if no tests are found.
   *
   * @see https://jestjs.io/docs/cli#--passwithnotests
   *
   * @defaultValue true
   */
  passWithNoTests?: boolean;

  /**
   * Randomize the order of test execution
   */
  randomize?: boolean;

  /**
   * Run all tests serially in the current process (rather than creating a worker pool of child processes that run tests). This is sometimes useful for debugging, but such use cases are pretty rare. Useful for CI.
   *
   * @see https://jestjs.io/docs/cli#--runinband
   */
  runInBand?: boolean;

  /**
   * Print your Jest config and then exits.
   *
   * @see https://jestjs.io/docs/cli#--showconfig
   */
  showConfig?: boolean;

  /**
   * Prevent tests from printing messages through the console.
   *
   * @see https://jestjs.io/docs/cli#--silent
   */
  silent?: boolean;

  /**
   * Run only tests with a name that matches the regex pattern.
   *
   * @see https://jestjs.io/docs/cli#--testnamepatternregex
   */
  testNamePattern?: string;

  /**
   * An array of regexp pattern strings that is matched against all tests paths before executing the test. Only run those tests with a path that does not match with the provided regexp expressions.
   *
   * @see https://jestjs.io/docs/cli#--testpathignorepatternsregex
   */
  testPathIgnorePatterns?: string[];

  /**
   * An array of regexp pattern strings that is matched against all tests paths before executing the test. Only run tests with a path that matches the provided regexp expressions.
   *
   * @see https://jestjs.io/docs/cli#--testpathpatternsregex
   */
  testPathPatterns?: string[];

  /**
   * Enables colored output.
   */
  colors?: boolean;

  /**
   * A list of reporters to use for test results
   */
  reporters?: string[];

  /**
   * Display individual test results with the test suite hierarchy.
   *
   * @see https://jestjs.io/docs/cli#--verbose
   */
  verbose?: boolean;

  /**
   * A list of coverage reporters to use
   */
  coverageReporters?: string[];

  /**
   * The directory where Jest should output its coverage files.
   */
  coverageDirectory?: string;

  /**
   * A Node module that implements a custom results processor.
   */
  testResultsProcessor?: string;

  /**
   * Update snapshots during this test run.
   */
  updateSnapshot?: boolean;

  /**
   * Divert all output to stderr.
   */
  useStderr?: boolean;

  /**
   * Watch files for changes and rerun tests related to changed files.
   */
  watch?: boolean;

  /**
   * Watch files for changes and rerun all tests when something changes.
   */
  watchAll?: boolean;

  /**
   * Adds a location field to test results. Used to report location of a test in a reporter. Example: `{ "column": 4, "line": 5 }`.
   *
   * @see https://jestjs.io/docs/cli#--testlocationinresultsboolean
   */
  testLocationInResults?: boolean;

  /**
   * Default timeout of a test in milliseconds.
   *
   * @see https://jestjs.io/docs/cli#--testtimeoutmilliseconds
   *
   * @defaultValue 5000
   */
  testTimeout?: number;
}

export interface JestPluginUserConfig extends UserConfig {
  test: {
    /**
     * Jest transformation options
     */
    jest: Config.Argv;
  };
}

export interface JestPluginResolvedConfig extends ResolvedConfig {
  test: {
    /**
     * Resolved Jest transformation options
     */
    jest: Config.Argv;
  };
}

export type JestPluginContext<
  TResolvedConfig extends JestPluginResolvedConfig = JestPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
