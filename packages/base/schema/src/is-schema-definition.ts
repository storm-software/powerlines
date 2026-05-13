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

import { isJsonSchema7ObjectType } from "@stryke/json/schema";
import { isSetObject } from "@stryke/type-checks";
import { SchemaDefinition } from "./types";

/**
 * Type guard to check if a given input is a `SchemaDefinition` object. This function verifies that the input is a non-null object, contains a `schema` property that is a JSON Schema (draft-07) object, contains an `input` property that is a non-null object, and has a `variant` property that is one of the allowed schema variants ("json-schema", "standard-schema", "zod3", or "reflection"). If all these conditions are met, the function returns `true`, indicating that the input is a valid `SchemaDefinition`; otherwise, it returns `false`.
 *
 * @param input - The input to check for being a `SchemaDefinition`.
 * @returns `true` if the input is a `SchemaDefinition`, otherwise `false`.
 */
export function isSchemaDefinition(input: unknown): input is SchemaDefinition {
  return (
    isSetObject(input) &&
    "schema" in input &&
    isJsonSchema7ObjectType(input.schema) &&
    "input" in input &&
    isSetObject(input.input) &&
    "variant" in input &&
    (input.variant === "json-schema" ||
      input.variant === "standard-schema" ||
      input.variant === "zod3" ||
      input.variant === "reflection")
  );
}
