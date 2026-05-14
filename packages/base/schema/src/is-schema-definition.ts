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

import { isJsonSchemaObjectType } from "@stryke/json/schema";
import { JsonSchemaType } from "@stryke/json/types";
import { isSetObject, isSetString } from "@stryke/type-checks";
import { ExtractedSchemaDefinition, SchemaDefinition } from "./types";

/**
 * Type guard to check if a given input is a `SchemaDefinition` object. This function verifies that the input is a non-null object, contains a `schema` property that is a JSON Schema (draft-07) object, contains an `input` property that is a non-null object, and has a `variant` property that is one of the allowed schema variants ("json-schema", "standard-schema", "zod3", or "reflection"). If all these conditions are met, the function returns `true`, indicating that the input is a valid `SchemaDefinition`; otherwise, it returns `false`.
 *
 * @param input - The input to check for being a `SchemaDefinition`.
 * @returns `true` if the input is a `SchemaDefinition`, otherwise `false`.
 */
export function isSchemaDefinition<
  TSchema extends JsonSchemaType = JsonSchemaType
>(input: unknown): input is SchemaDefinition<TSchema> {
  return (
    isSetObject(input) &&
    "schema" in input &&
    isJsonSchemaObjectType(input.schema) &&
    "input" in input &&
    isSetObject(input.input) &&
    "variant" in input &&
    isSetString(input.variant)
  );
}

/**
 * Type guard to check if a given input is a `ExtractedSchemaDefinition` object. This function verifies that the input is a non-null object, contains a `schema` property that is a JSON Schema (draft-07) object, contains an `input` property that is a non-null object, and has a `variant` property that is one of the allowed schema variants ("json-schema", "standard-schema", "zod3", or "reflection"). If all these conditions are met, the function returns `true`, indicating that the input is a valid `ExtractedSchemaDefinition`; otherwise, it returns `false`.
 *
 * @param input - The input to check for being a `ExtractedSchemaDefinition`.
 * @returns `true` if the input is a `ExtractedSchemaDefinition`, otherwise `false`.
 */
export function isExtractedSchemaDefinition<
  TSchema extends JsonSchemaType = JsonSchemaType
>(input: unknown): input is ExtractedSchemaDefinition<TSchema> {
  return (
    isSchemaDefinition(input) &&
    "source" in input &&
    isSetObject(input.source) &&
    "schema" in input.source &&
    isJsonSchemaObjectType(input.source.schema) &&
    "variant" in input.source &&
    isSetString(input.source.variant)
  );
}
