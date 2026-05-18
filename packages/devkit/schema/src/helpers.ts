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

import { isSetObject } from "@stryke/type-checks";
import { defu } from "defu";
import { isJTDSchemaObject, isObjectSchema } from "./type-checks";
import {
  JTDSchemaObjectType,
  JTDSchemaType,
  ObjectSchema,
  SchemaMetadata
} from "./types";

/**
 * A helper function to extract the properties from a JTD object schema. This function takes an {@link ObjectSchema} as input and returns a record of its properties, where each key is the property name and the value is the corresponding JTD schema type along with an `optional` flag indicating whether the property is optional (i.e., defined in `optionalProperties`) or required (i.e., defined in `properties`). The function checks both `properties` and `optionalProperties` of the JTD schema to construct the resulting record.
 *
 * @param obj - The {@link ObjectSchema} from which to extract the properties.
 * @returns A record of the properties defined in the JTD object schema, where each key is the property name and the value is an object containing the JTD schema type and an `optional` flag.
 */
export function getProperties<TMetadata extends SchemaMetadata>(
  obj: ObjectSchema<TMetadata> | JTDSchemaObjectType<TMetadata>
): Record<string, JTDSchemaType<TMetadata> & { optional: boolean }> {
  const properties: Record<
    string,
    JTDSchemaType<TMetadata> & { optional: boolean }
  > = {};

  const schema = isObjectSchema(obj) ? obj.schema : obj;
  if (
    "optionalProperties" in schema &&
    isSetObject(schema.optionalProperties)
  ) {
    for (const [key, value] of Object.entries(schema.optionalProperties)) {
      properties[key] = { ...value, optional: true };
    }
  }

  if ("properties" in schema && isSetObject(schema.properties)) {
    for (const [key, value] of Object.entries(schema.properties)) {
      properties[key] = { ...value, optional: false };
    }
  }

  return properties;
}

/**
 * Merges multiple JTD object schemas into a single schema. This function takes an array of JTD object schemas (either {@link JTDSchemaObjectType} or {@link ObjectSchema}) and combines their properties into a single JTD object schema. The resulting schema will contain all properties from the input schemas, with optional properties marked accordingly. If there are overlapping properties between the input schemas, the function will merge them using a deep merge strategy (via `defu`) if they are both JTD object schemas; otherwise, the property from the first schema in the input array will take precedence.
 *
 * @remarks
 * This function attempts to mimic {@link defu}'s behavior for merging objects, but with special handling for JTD schemas. When merging properties, if a property exists in multiple input schemas and is defined as a JTD object schema in all of them, the function will perform a deep merge of those schemas. If the property is not a JTD object schema in any of the input schemas, the function will simply take the first definition it encounters.
 *
 * @param schemas - An array of JTD object schemas to merge.
 * @returns A single JTD object schema that combines the properties of all input schemas.
 */
export function mergeSchemas<TMetadata extends SchemaMetadata>(
  ...schemas: (JTDSchemaObjectType<TMetadata> | ObjectSchema<TMetadata>)[]
): JTDSchemaObjectType<TMetadata> {
  const mergedSchema = {
    properties: {},
    optionalProperties: {},
    additionalProperties: false
  } as JTDSchemaObjectType<TMetadata>;
  for (const schema of schemas.reverse()) {
    const properties = getProperties(schema);
    for (const [key, value] of Object.entries(properties)) {
      if (value.optional) {
        mergedSchema.optionalProperties![key] = (
          mergedSchema.optionalProperties![key] &&
          isJTDSchemaObject(mergedSchema.optionalProperties![key]) &&
          isJTDSchemaObject(value)
            ? defu(mergedSchema.optionalProperties![key], value)
            : value
        ) as JTDSchemaType<TMetadata>;
      } else {
        mergedSchema.properties![key] = (
          mergedSchema.properties![key] &&
          isJTDSchemaObject(mergedSchema.properties![key]) &&
          isJTDSchemaObject(value)
            ? defu(mergedSchema.properties![key], value)
            : value
        ) as JTDSchemaType<TMetadata>;
      }
    }
  }

  return mergedSchema;
}
