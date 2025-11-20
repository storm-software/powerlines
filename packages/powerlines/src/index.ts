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

/**
 * The powerlines library used by Storm Software for building NodeJS applications.
 *
 * @remarks
 * A build toolkit and runtime used by Storm Software in TypeScript applications
 *
 * @packageDocumentation
 */

import { PowerlinesAPI } from "./api";

export * from "../schemas/fs";
export * from "./config";
export * from "./types";

export { PowerlinesAPI };
export default PowerlinesAPI;
