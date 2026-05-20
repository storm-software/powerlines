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

import { isSetArray, isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { JsonSchemaType } from "@stryke/json/types";
import { applySchemaMetadata, getSchemaMetadata } from "./metadata";
import { JsonSchemaLike, JTDSchemaType, SchemaMetadata } from "./types";

function isJtdForm(value: unknown): value is JTDSchemaType {
  return isSetObject(value);
}

function jtdMetadataToJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(form: JTDSchemaType<TMetadata>): JsonSchemaLike {
  const metadata = getSchemaMetadata<TMetadata>(form);
  const base: JsonSchemaLike = {};
  return metadata ? applySchemaMetadata(base, metadata) : base;
}

function withJtdNullable(
  schema: JsonSchemaLike,
  nullable: boolean | undefined
): JsonSchemaLike {
  if (!nullable) {
    return schema;
  }

  const types = Array.isArray(schema.type)
    ? [...schema.type]
    : schema.type
      ? [schema.type]
      : [];
  if (!types.includes("null")) {
    types.push("null");
  }

  return { ...schema, type: types.length === 1 ? types[0] : types };
}

/**
 * Converts a JSON Type Definition (RFC 8927) schema into JSON Schema (draft-07).
 *
 * @param schema - The JTD schema to convert.
 * @returns A JSON Schema fragment, or `undefined` when the input is not a JTD form.
 */
export function jtdToJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(
  schema: JTDSchemaType<TMetadata> | undefined | null
): JsonSchemaType | undefined {
  if (!isJtdForm(schema)) {
    return undefined;
  }

  const annotations = jtdMetadataToJsonSchema(schema);
  const nullable = schema.nullable === true;

  if (isSetString((schema as { ref?: string }).ref)) {
    const ref = (schema as { ref: string }).ref;
    return withJtdNullable(
      {
        ...annotations,
        $ref: `#/definitions/${ref}`
      },
      nullable
    );
  }

  if ("type" in schema && isSetString(schema.type)) {
    const jtdType = schema.type;
    if (jtdType === "timestamp") {
      return withJtdNullable(
        { ...annotations, type: "string", format: "date-time" },
        nullable
      );
    }
    if (jtdType === "boolean" || jtdType === "string") {
      return withJtdNullable({ ...annotations, type: jtdType }, nullable);
    }
    if (
      jtdType.startsWith("int") ||
      jtdType.startsWith("uint") ||
      jtdType.startsWith("float")
    ) {
      return withJtdNullable(
        {
          ...annotations,
          type: jtdType.startsWith("float") ? "number" : "integer",
          format: jtdType
        },
        nullable
      );
    }
  }

  if ("enum" in schema && isSetArray(schema.enum)) {
    return withJtdNullable({ ...annotations, enum: schema.enum }, nullable);
  }

  if ("elements" in schema) {
    const items = jtdToJsonSchema(schema.elements) ?? {};
    return withJtdNullable(
      { ...annotations, type: "array", items },
      nullable
    );
  }

  if ("values" in schema) {
    const additionalProperties = jtdToJsonSchema(schema.values) ?? true;
    return withJtdNullable(
      { ...annotations, type: "object", additionalProperties },
      nullable
    );
  }

  if ("discriminator" in schema && isSetObject(schema.mapping)) {
    const tag = schema.discriminator;
    const oneOf = Object.entries(schema.mapping).map(([tagValue, branch]) => {
      const converted = jtdToJsonSchema(branch) ?? { type: "object" };
      return {
        type: "object",
        properties: {
          [tag]: { const: tagValue },
          ...(converted.properties ?? {})
        },
        required: [tag, ...(converted.required ?? [])],
        additionalProperties: converted.additionalProperties ?? false
      } satisfies JsonSchemaLike;
    });

    return withJtdNullable(
      {
        ...annotations,
        oneOf,
        discriminator: { propertyName: tag }
      },
      nullable
    );
  }

  if (
    ("properties" in schema && isSetObject(schema.properties)) ||
    ("optionalProperties" in schema && isSetObject(schema.optionalProperties))
  ) {
    const properties: Record<string, JsonSchemaLike> = {};
    const required: string[] = [];

    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        const converted = jtdToJsonSchema(value);
        if (converted) {
          properties[key] = converted;
          required.push(key);
        }
      }
    }

    if (schema.optionalProperties) {
      for (const [key, value] of Object.entries(schema.optionalProperties)) {
        const converted = jtdToJsonSchema(value);
        if (converted) {
          properties[key] = converted;
        }
      }
    }

    const result: JsonSchemaLike = {
      ...annotations,
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
      ...(schema.additionalProperties
        ? { additionalProperties: true }
        : { additionalProperties: false })
    };

    if (schema.definitions) {
      const definitions: Record<string, JsonSchemaLike> = {};
      for (const [key, value] of Object.entries(schema.definitions)) {
        const converted = jtdToJsonSchema(value);
        if (converted) {
          definitions[key] = converted;
        }
      }
      if (Object.keys(definitions).length > 0) {
        result.definitions = definitions;
      }
    }

    return withJtdNullable(result, nullable);
  }

  if (Object.keys(schema).length === 0 || (nullable && Object.keys(schema).length === 1)) {
    return withJtdNullable(annotations, nullable);
  }

  return withJtdNullable(annotations, nullable);
}

