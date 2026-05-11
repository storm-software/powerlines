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

import { build as executeBuild } from "./api/build";
import { clean as executeClean } from "./api/clean";
import { create as executeCreate } from "./api/create";
import { deploy as executeDeploy } from "./api/deploy";
import { docs as executeDocs } from "./api/docs";
import { lint as executeLint } from "./api/lint";
import { prepare as executePrepare } from "./api/prepare";
import { test as executeTest } from "./api/test";
import { types as executeTypes } from "./api/types";
import { createExecutionHost } from "./helpers/create-execution-host";

const executionHost = createExecutionHost({
  types: executeTypes,
  prepare: executePrepare,
  create: executeCreate,
  clean: executeClean,
  lint: executeLint,
  test: executeTest,
  build: executeBuild,
  docs: executeDocs,
  deploy: executeDeploy
});

export const types = executionHost.types;
export const prepare = executionHost.prepare;
export const create = executionHost.create;
export const clean = executionHost.clean;
export const lint = executionHost.lint;
export const test = executionHost.test;
export const build = executionHost.build;
export const docs = executionHost.docs;
export const deploy = executionHost.deploy;
