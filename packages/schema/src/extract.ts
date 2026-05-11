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

import type { JsonSchema7Type } from "@stryke/json";
import { isJsonSchema7ObjectType, isStandardJsonSchema } from "@stryke/json";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { extractJsonSchema7, isZod3Type } from "@stryke/zod";

/**
 * Extracts a JSON Schema object from a given schema definition, if possible.
 *
 * @remarks
 * This function checks if the provided schema is a Zod schema, a Standard JSON Schema, or already a JSON Schema object. If it is a Zod schema, it extracts the corresponding JSON Schema. If it is a Standard JSON Schema, it retrieves the input JSON Schema targeting draft-07. Finally, it checks if the resulting JSON Schema is an object type and returns it if so.
 *
 * @param schema - The schema definition to extract the JSON Schema from. This can be a Zod schema, a Standard JSON Schema, or a JSON Schema object.
 * @returns The extracted JSON Schema (draft-07) object if successful, otherwise undefined.
 */
export function extractJsonSchema(
  schema: unknown
): JsonSchema7Type | undefined {
  if (
    isSetObject(schema) &&
    (isZod3Type(schema) ||
      isStandardJsonSchema(schema) ||
      isJsonSchema7ObjectType(schema))
  ) {
    let jsonSchema: JsonSchema7Type;
    if (isZod3Type(schema)) {
      jsonSchema = extractJsonSchema7(schema);
    } else if (isStandardJsonSchema(schema)) {
      jsonSchema = schema["~standard"].jsonSchema.input({
        target: "draft-07"
      });
    } else {
      jsonSchema = schema;
    }

    if (isJsonSchema7ObjectType(jsonSchema)) {
      return jsonSchema;
    }
  }

  return undefined;
}
