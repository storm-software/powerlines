#!/usr/bin/env zx
/* -------------------------------------------------------------------

            ⚡ Storm Software - Monorepo Template

 This code was released as part of the Monorepo Template project. Monorepo Template
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/monorepo-template
 Documentation:   https://stormsoftware.com/projects/monorepo-template/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/monorepo-template/license

 ------------------------------------------------------------------- */

import { $, chalk, echo } from "zx";

try {
  echo`${chalk.whiteBright("📋  Linting the monorepo...")}`;

  let proc =
    $`pnpm nx run-many --target=lint --all --exclude="@monorepo-template/monorepo" --parallel=5`.timeout(
      `${30 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while linting the monorepo: \n\n${result.message}\n`
    );
  }

  proc = $`pnpm exec storm-lint all --skip-cspell --skip-circular-deps`.timeout(
    `${30 * 60}s`
  );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while running \`storm-lint\` on the monorepo: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green("Successfully linted the monorepo's files")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occured while linting the monorepo")}`;

  process.exit(1);
}
