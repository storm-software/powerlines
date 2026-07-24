/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import { SchemaConfig, extract as extractSchema } from "@power-plant/schema";
import { Context } from "@powerlines/core";
import { createStorageAdapter } from "./storage-adapter";

/**
 * Extracts the schema using the provided context.
 *
 * @param context - The context to use.
 * @param schema - The schema to extract.
 * @returns The extracted schema.
 */
export async function extract<TSchema extends SchemaConfig>(
  context: Context,
  schema: SchemaConfig<TSchema>
) {
  return extractSchema<TSchema>(schema, {
    cwd: context.cwd,
    tsconfig: context.tsconfig.tsconfigFilePath,
    storage: createStorageAdapter(context.fs)
  });
}
