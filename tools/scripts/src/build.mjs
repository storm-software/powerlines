#!/usr/bin/env zx
/* -------------------------------------------------------------------

            ⚡ Storm Software - Monorepo Template

 This code was released as part of the Monorepo Template project. Monorepo Template
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/monorepo-template.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/monorepo-template
 Documentation:            https://docs.stormsoftware.com/projects/monorepo-template
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { $, argv, chalk, echo } from "zx";

try {
  let configuration = argv.configuration;
  if (!configuration) {
    if (argv.prod) {
      configuration = "production";
    } else if (argv.dev) {
      configuration = "development";
    } else {
      configuration = "production";
    }
  }

  echo`${chalk.whiteBright(
    `🏗️  Building the monorepo in ${configuration} mode...`
  )}`;

  let proc = $`pnpm bootstrap`.timeout(`${1 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while bootstrapping the monorepo: \n\n${
        result.message
      }\n`
    );
  }

  proc =
    $`pnpm nx run-many --target=build --exclude="@monorepo-template/monorepo" --configuration=${
      configuration
    } --outputStyle=dynamic-legacy --parallel=5`.timeout(`${10 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while building the monorepo in ${
        configuration
      } mode: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green(
    `✅  Successfully built the monorepo in ${configuration} mode!`
  )}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while building the monorepo")}`;

  process.exit(1);
}
