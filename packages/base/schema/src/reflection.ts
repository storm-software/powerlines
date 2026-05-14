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

import type { Type, TypeClass } from "@powerlines/deepkit/vendor/type";
import {
  ReflectionKind,
  TypeNumberBrand,
  TypeObjectLiteral
} from "@powerlines/deepkit/vendor/type";
import { JsonSchemaType } from "@stryke/json/types";

/**
 * Converts a Deepkit type reflection into a JSON Schema representation.
 *
 * @param reflection - The Deepkit type reflection to convert.
 * @returns The corresponding JSON Schema representation, or `undefined` if the type cannot be represented.
 */
export function reflectionToJsonSchema(
  reflection: Type
): JsonSchemaType | undefined {
  switch (reflection.kind) {
    case ReflectionKind.any:
    case ReflectionKind.unknown:
    case ReflectionKind.void:
    case ReflectionKind.object:
      return {};
    case ReflectionKind.never:
    case ReflectionKind.undefined:
      return { not: {} };
    case ReflectionKind.null:
      return { type: "null" };
    case ReflectionKind.string:
      return { type: "string" };
    case ReflectionKind.boolean:
      return { type: "boolean" };
    case ReflectionKind.number: {
      const brand = reflection.brand;
      const isInteger =
        brand !== undefined &&
        brand >= TypeNumberBrand.integer &&
        brand <= TypeNumberBrand.uint32;

      return { type: isInteger ? "integer" : "number" };
    }
    case ReflectionKind.bigint:
      return { type: "integer", format: "int64" };
    case ReflectionKind.regexp:
      return { type: "string" };
    case ReflectionKind.literal: {
      const { literal } = reflection;
      if (typeof literal === "string") {
        return { type: "string", const: literal };
      }
      if (typeof literal === "number") {
        return {
          type: Number.isInteger(literal) ? "integer" : "number",
          const: literal
        };
      }
      if (typeof literal === "boolean") {
        return { type: "boolean", const: literal };
      }
      if (typeof literal === "bigint") {
        return { type: "integer", format: "int64" };
      }
      if (literal instanceof RegExp) {
        return { type: "string", pattern: literal.source };
      }
      return {};
    }
    case ReflectionKind.templateLiteral:
      return { type: "string" };
    case ReflectionKind.enum: {
      const values = reflection.values.filter(
        (value): value is string | number =>
          typeof value === "string" || typeof value === "number"
      );
      const allStrings = values.every(value => typeof value === "string");
      const allNumbers = values.every(value => typeof value === "number");

      return {
        type: allStrings
          ? "string"
          : allNumbers
            ? "number"
            : ["string", "number"],
        enum: values
      };
    }
    case ReflectionKind.array: {
      const items = reflectionToJsonSchema(reflection.type);

      return items ? { type: "array", items } : { type: "array" };
    }
    case ReflectionKind.tuple: {
      const items = reflection.types
        .map(member => reflectionToJsonSchema(member.type))
        .filter((item): item is JsonSchemaType => item !== undefined);
      const required = reflection.types.filter(
        member => !member.optional
      ).length;

      return {
        type: "array",
        items,
        minItems: required,
        maxItems: reflection.types.length
      };
    }
    case ReflectionKind.union: {
      const anyOf = reflection.types
        .map(inner => reflectionToJsonSchema(inner))
        .filter((item): item is JsonSchemaType => item !== undefined);
      if (anyOf.length === 0) {
        return undefined;
      }
      if (anyOf.length === 1) {
        return anyOf[0];
      }
      return { anyOf };
    }
    case ReflectionKind.intersection: {
      const allOf = reflection.types
        .map(inner => reflectionToJsonSchema(inner))
        .filter((item): item is JsonSchemaType => item !== undefined);
      if (allOf.length === 0) {
        return undefined;
      }
      if (allOf.length === 1) {
        return allOf[0];
      }
      return { allOf };
    }
    case ReflectionKind.promise:
      return reflectionToJsonSchema(reflection.type);
    case ReflectionKind.objectLiteral:
      return objectReflectionToJsonSchema(reflection);
    case ReflectionKind.class: {
      const classType = reflection.classType as { name?: string } | undefined;
      const className = classType?.name;
      switch (className) {
        case "Date":
          return { type: "string", format: "date-time" };
        case "RegExp":
          return { type: "string" };
        case "URL":
          return { type: "string", format: "uri" };
        case "Set": {
          const itemType = reflection.arguments?.[0];
          const items = itemType ? reflectionToJsonSchema(itemType) : undefined;

          return items
            ? { type: "array", uniqueItems: true, items }
            : { type: "array", uniqueItems: true };
        }
        case "Map": {
          const valueType = reflection.arguments?.[1];
          const additionalProperties = valueType
            ? reflectionToJsonSchema(valueType)
            : undefined;
          const schema = { type: "object" } as JsonSchemaType;
          if (additionalProperties) {
            (
              schema as { additionalProperties?: JsonSchemaType }
            ).additionalProperties = additionalProperties;
          }
          return schema;
        }
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Uint16Array":
        case "Uint32Array":
        case "Int8Array":
        case "Int16Array":
        case "Int32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
          return { type: "string", contentEncoding: "base64" };
        case undefined:
        default:
          return objectReflectionToJsonSchema(reflection);
      }
    }

    case ReflectionKind.symbol:
    case ReflectionKind.property:
    case ReflectionKind.method:
    case ReflectionKind.function:
    case ReflectionKind.parameter:
    case ReflectionKind.typeParameter:
    case ReflectionKind.tupleMember:
    case ReflectionKind.enumMember:
    case ReflectionKind.rest:
    case ReflectionKind.indexSignature:
    case ReflectionKind.propertySignature:
    case ReflectionKind.methodSignature:
    case ReflectionKind.infer:
    case ReflectionKind.callSignature:
    default:
      return undefined;
  }
}

/**
 * Builds a JSON Schema object representation from a Deepkit class or object literal type.
 *
 * @param type - The class or object literal type whose members should be serialized.
 * @returns A JSON Schema object describing the type's properties.
 */
export function objectReflectionToJsonSchema(
  type: TypeObjectLiteral | TypeClass
): JsonSchemaType {
  const properties: Record<string, JsonSchemaType> = {};
  const required: string[] = [];
  let additionalProperties: JsonSchemaType | boolean | undefined;
  const description =
    "description" in type && typeof type.description === "string"
      ? type.description
      : undefined;

  for (const member of type.types) {
    if (
      member.kind === ReflectionKind.property ||
      member.kind === ReflectionKind.propertySignature
    ) {
      const property = member;
      if (typeof property.name !== "string") {
        continue;
      }
      const propertySchema = reflectionToJsonSchema(property.type);
      if (!propertySchema) {
        continue;
      }
      if (typeof property.description === "string") {
        (propertySchema as { description?: string }).description =
          property.description;
      }
      properties[property.name] = propertySchema;
      if (!property.optional) {
        required.push(property.name);
      }
    } else if (member.kind === ReflectionKind.indexSignature) {
      const indexSignature = member;
      const valueSchema = reflectionToJsonSchema(indexSignature.type);
      if (valueSchema) {
        additionalProperties = valueSchema;
      }
    }
  }

  const schema = {
    type: "object",
    properties
  } as JsonSchemaType;

  if (required.length > 0) {
    (schema as { required?: string[] }).required = required;
  }
  if (additionalProperties !== undefined) {
    (
      schema as { additionalProperties?: JsonSchemaType | boolean }
    ).additionalProperties = additionalProperties;
  }
  if (description) {
    (schema as { description?: string }).description = description;
  }

  return schema;
}
