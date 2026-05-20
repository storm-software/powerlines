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
import { JsonSchemaType } from "@stryke/json/types";
import { defu } from "defu";
import { getSchemaMetadata, isPropertyOptional, isSchemaNullable } from "./metadata";
import { isJsonSchemaObject, isObjectSchema } from "./type-checks";
import {
  JsonSchemaObjectType,
  JsonSchemaType,
  ObjectSchema,
  SchemaMetadata
} from "./types";

export type SchemaProperty<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
> = JsonSchemaType & {
  name: string;
  optional: boolean;
  nullable: boolean;
  metadata?: TMetadata;
};

/**
 * Extracts object properties from a JSON Schema object form.
 */
export function getProperties<TMetadata extends SchemaMetadata>(
  obj: ObjectSchema<TMetadata> | JsonSchemaObjectType<TMetadata>
): Record<string, SchemaProperty<TMetadata>> {
  const properties: Record<string, SchemaProperty<TMetadata>> = {};
  const schema = isObjectSchema(obj) ? obj.schema : obj;

  if (!isSetObject(schema.properties)) {
    return properties;
  }

  for (const [key, value] of Object.entries(schema.properties)) {
    properties[key] = {
      ...value,
      name: key,
      optional: isPropertyOptional(schema, key),
      nullable: isSchemaNullable(value),
      metadata: getSchemaMetadata<TMetadata>(value)
    };
  }

  return properties;
}

/**
 * Returns object properties as an array.
 */
export function getPropertiesList<TMetadata extends SchemaMetadata>(
  obj: ObjectSchema<TMetadata> | JsonSchemaObjectType<TMetadata>
): Array<SchemaProperty<TMetadata>> {
  return Object.values(getProperties(obj));
}

/**
 * Adds a property to a JSON Schema object form.
 */
export function addProperty<TMetadata extends SchemaMetadata>(
  obj: ObjectSchema<TMetadata> | JsonSchemaObjectType<TMetadata>,
  name: string,
  property: JsonSchemaType
) {
  const schema = isObjectSchema(obj) ? obj.schema : obj;
  schema.type ??= "object";
  schema.properties ??= {};
  schema.required ??= [];

  const metadata = getSchemaMetadata<TMetadata>(property);
  const propertySchema = metadata
    ? ({ ...property, ...metadata } as JsonSchemaType)
    : property;

  schema.properties[name] = propertySchema;

  const optional = metadata?.isOptional === true;
  if (optional) {
    schema.required = schema.required.filter(key => key !== name);
  } else if (!schema.required.includes(name)) {
    schema.required.push(name);
  }

  if (schema.required.length === 0) {
    delete schema.required;
  }
}

/**
 * Merges multiple JSON Schema object forms into one.
 */
export function mergeSchemas<TMetadata extends SchemaMetadata>(
  ...schemas: (JsonSchemaObjectType<TMetadata> | ObjectSchema<TMetadata>)[]
): JsonSchemaObjectType<TMetadata> {
  const mergedSchema: JsonSchemaObjectType<TMetadata> = {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false
  };

  for (const schema of schemas.reverse()) {
    const properties = getProperties(schema);
    for (const [key, value] of Object.entries(properties)) {
      if (value.optional) {
        mergedSchema.properties![key] = (
          mergedSchema.properties![key] &&
          isJsonSchemaObject(mergedSchema.properties![key]) &&
          isJsonSchemaObject(value)
            ? defu(mergedSchema.properties![key], value)
            : value
        ) as JsonSchemaType;
        mergedSchema.required = (mergedSchema.required ?? []).filter(
          requiredKey => requiredKey !== key
        );
      } else {
        mergedSchema.properties![key] = (
          mergedSchema.properties![key] &&
          isJsonSchemaObject(mergedSchema.properties![key]) &&
          isJsonSchemaObject(value)
            ? defu(mergedSchema.properties![key], value)
            : value
        ) as JsonSchemaType;
        mergedSchema.required = Array.from(
          new Set([...(mergedSchema.required ?? []), key])
        );
      }
    }
  }

  if ((mergedSchema.required?.length ?? 0) === 0) {
    delete mergedSchema.required;
  }

  return mergedSchema;
}
