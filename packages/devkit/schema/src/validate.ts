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

import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { JsonSchema } from "./types";

/**
 * Gets an Ajv validator instance for a given JSON Schema.
 *
 * @param schema - The JSON Schema to create a validator for.
 * @returns An Ajv instance with the schema added.
 */
export function getValidator<T = unknown>(schema: JsonSchema<T>): Ajv {
  const ajv = new Ajv({
    schemas: [schema],
    code: { source: true, esm: true }
  });

  addFormats(ajv);

  return ajv;
}

/**
 * Gets a validation function for a given JSON Schema.
 *
 * @param schema - The JSON Schema to create a validation function for.
 * @returns A function that validates data against the schema and returns a boolean indicating validity.
 */
export function getValidatorFunction<T = unknown>(
  schema: JsonSchema<T>
): ValidateFunction<T> {
  const ajv = getValidator(schema);

  return ajv.compile<T>(schema);
}
