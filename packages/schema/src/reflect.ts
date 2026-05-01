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

export function reflectStandardSchema(
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

export function reflectDeepkitObjectSchema(
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
