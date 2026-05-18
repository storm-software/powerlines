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

import type { Options } from "ajv";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone";

/**
 * Generates standalone validation code for the provided JSON schemas using the Ajv library. This function takes an array of JSON schemas and an optional set of references or functions, and returns a string containing the generated validation code. The generated code can be used to validate data against the provided schemas without requiring the Ajv library at runtime, making it suitable for use in environments where minimizing dependencies is important.
 *
 * @param schemas - An array of JSON schemas to generate validation code for. Each schema should be a valid JSON schema object that defines the structure and constraints of the data to be validated.
 * @param refsOrFuncts - An optional parameter that can be either an object containing schema references or a function that returns such an object. This parameter allows you to provide additional schemas that may be referenced by the main schemas, or to define custom functions that can be used in the generated validation code. If not provided, the function will generate code based solely on the provided schemas.
 * @returns A promise that resolves to a string containing the generated standalone validation code.
 */
export async function generateCode(
  schemas: Options["schemas"],
  refsOrFuncts?: Parameters<typeof standaloneCode>[1]
) {
  return standaloneCode(
    new Ajv({
      schemas,
      code: { source: true, esm: true }
    }),
    refsOrFuncts
  );
}
