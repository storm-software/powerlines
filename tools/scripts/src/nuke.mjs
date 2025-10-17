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

import { $, chalk, echo } from "zx";

try {
  echo`${chalk.whiteBright("💣  Nuking the monorepo...")}`;

  // let proc =
  //   $`pnpm nx run-many --target=clean --all --exclude="@monorepo-template/monorepo" --outputStyle=dynamic-legacy --parallel=5`.timeout(
  //     `${2 * 60}s`
  //   );
  // proc.stdout.on("data", data => {
  //   echo`${data}`;
  // });
  // let result = await proc;
  // if (result.exitCode !== 0) {
  //   throw new Error(
  //     `An error occurred while cleaning the monorepo projects: \n\n${result.message}\n`
  //   );
  // }

  let proc = $`pnpm nx clear-cache`.timeout(`${5 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while clearing Nx cache: \n\n${result.message}\n`
    );
  }

  proc = $`rm -rf ./.nx/cache ./.nx/workspace-data ./dist ./tmp`.timeout(
    `${5 * 60}s`
  );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while removing cache directories: \n\n${result.message}\n`
    );
  }

  proc = $`rm -rf ./packages/*/node_modules`.timeout(`${5 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while removing node modules and build directories from the monorepo's projects: \n\n${result.message}\n`
    );
  }

  proc = $`rm -rf ./tools/*/node_modules`.timeout(`${5 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while removing node modules and build directories from the monorepo's projects: \n\n${result.message}\n`
    );
  }

  proc = $`rm -rf ./node_modules`.timeout(`${5 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while removing node modules and build directories from the monorepo's projects: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green("✅  Successfully nuked the cache, node modules, and build folders \n\n")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while nuking the monorepo")}`;
}
