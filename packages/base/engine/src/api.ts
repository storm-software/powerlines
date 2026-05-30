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

import { ExecutionContext, ExecutionOptions } from "@powerlines/core";
import { build } from "./api/build";
import { clean } from "./api/clean";
import { create } from "./api/create";
import { deploy } from "./api/deploy";
import { docs } from "./api/docs";
import { lint } from "./api/lint";
import { prepare } from "./api/prepare";
import { test } from "./api/test";
import { types } from "./api/types";
import { createApi } from "./helpers/create-api";
import { EngineResolvedConfig, EngineSystemContext } from "./types";

export default createApi<
  ExecutionContext<EngineResolvedConfig, EngineSystemContext>,
  ExecutionOptions
>({
  types,
  prepare,
  create,
  clean,
  lint,
  test,
  build,
  docs,
  deploy
});
