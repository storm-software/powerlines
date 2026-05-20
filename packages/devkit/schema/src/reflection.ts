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

import type {
  TagsReflection,
  Type,
  TypeClass
} from "@powerlines/deepkit/vendor/type";
import {
  ReflectionClass,
  ReflectionKind,
  TypeNumberBrand,
  TypeObjectLiteral
} from "@powerlines/deepkit/vendor/type";
import { isSetArray, isSetObject, isSetString } from "@stryke/type-checks";
import { JsonSchemaType } from "@stryke/json/types";
import defu from "defu";
import { applySchemaMetadata, getSchemaMetadata } from "./metadata";
import { JsonSchemaLike, SchemaMetadata } from "./types";

/**
 * Maps a Deepkit numeric `brand` to JSON Schema `type` and `format`.
 */
function numberBrandToJsonSchema(brand: TypeNumberBrand | undefined): {
  type: "integer" | "number";
  format?: string;
} {
  switch (brand) {
    case TypeNumberBrand.integer:
      return { type: "integer" };
    case TypeNumberBrand.int8:
      return { type: "integer", format: "int8" };
    case TypeNumberBrand.uint8:
      return { type: "integer", format: "uint8" };
    case TypeNumberBrand.int16:
      return { type: "integer", format: "int16" };
    case TypeNumberBrand.uint16:
      return { type: "integer", format: "uint16" };
    case TypeNumberBrand.int32:
      return { type: "integer", format: "int32" };
    case TypeNumberBrand.uint32:
      return { type: "integer", format: "uint32" };
    case TypeNumberBrand.float:
    case TypeNumberBrand.float32:
      return { type: "number", format: "float" };
    case TypeNumberBrand.float64:
      return { type: "number", format: "double" };
    case undefined:
    default:
      return { type: "number" };
  }
}

function withReflectionTags<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type, schema: JsonSchemaLike): JsonSchemaLike {
  if (!isSetObject((reflection as { tags?: TagsReflection })?.tags)) {
    return schema;
  }

  const tags = (reflection as { tags: TagsReflection }).tags;
  const metadata = {
    ...getSchemaMetadata<TMetadata>(schema),
    ...(tags.readonly === true ? { isReadonly: true } : {}),
    ...(tags.ignore === true ? { isIgnored: true } : {}),
    ...(tags.internal === true ? { isInternal: true } : {}),
    ...(tags.runtime === true ? { isRuntime: true } : {}),
    ...(tags.hidden === true ? { isHidden: true } : {}),
    ...(isSetArray(tags.alias) ? { alias: tags.alias } : {}),
    ...(isSetString(tags.title) ? { title: tags.title } : {})
  } as TMetadata;

  return applySchemaMetadata(schema, metadata);
}

function withNullable(
  schema: JsonSchemaLike,
  nullable: boolean
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
 * Converts a Deepkit type reflection into a JSON Schema (draft-07) fragment.
 */
export function reflectionToJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type): JsonSchemaType | undefined {
  return reflectionToJsonSchemaInner<TMetadata>(reflection);
}

function reflectionToJsonSchemaInner<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type): JsonSchemaType | undefined {
  switch (reflection.kind) {
    case ReflectionKind.any:
    case ReflectionKind.unknown:
    case ReflectionKind.void:
    case ReflectionKind.object:
      return withReflectionTags<TMetadata>(reflection, {});
    case ReflectionKind.never:
      return undefined;
    case ReflectionKind.undefined:
    case ReflectionKind.null:
      return withReflectionTags<TMetadata>(reflection, { type: "null" });
    case ReflectionKind.string:
      return withReflectionTags<TMetadata>(reflection, { type: "string" });
    case ReflectionKind.boolean:
      return withReflectionTags<TMetadata>(reflection, { type: "boolean" });
    case ReflectionKind.number: {
      const numeric = numberBrandToJsonSchema(reflection.brand);
      return withReflectionTags<TMetadata>(reflection, numeric);
    }
    case ReflectionKind.bigint:
      return withReflectionTags<TMetadata>(reflection, { type: "integer" });
    case ReflectionKind.regexp:
      return withReflectionTags<TMetadata>(reflection, { type: "string" });
    case ReflectionKind.literal: {
      const { literal } = reflection;
      if (
        typeof literal === "string" ||
        typeof literal === "number" ||
        typeof literal === "boolean"
      ) {
        return withReflectionTags<TMetadata>(reflection, { const: literal });
      }
      if (typeof literal === "bigint") {
        return withReflectionTags<TMetadata>(reflection, {
          const: String(literal)
        });
      }
      if (literal instanceof RegExp) {
        return withReflectionTags<TMetadata>(reflection, { type: "string" });
      }
      return withReflectionTags<TMetadata>(reflection, {});
    }
    case ReflectionKind.templateLiteral:
      return withReflectionTags<TMetadata>(reflection, { type: "string" });
    case ReflectionKind.enum: {
      const values = reflection.values.filter(
        value =>
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
      );
      if (values.length === 0) {
        return withReflectionTags<TMetadata>(reflection, {});
      }
      return withReflectionTags<TMetadata>(reflection, { enum: values });
    }
    case ReflectionKind.array: {
      const items = reflectionToJsonSchemaInner<TMetadata>(reflection.type);
      return withReflectionTags<TMetadata>(reflection, {
        type: "array",
        items: items ?? {}
      });
    }
    case ReflectionKind.tuple: {
      const items = reflection.types
        .map(member => reflectionToJsonSchemaInner<TMetadata>(member.type))
        .filter((item): item is JsonSchemaType => item !== undefined);
      if (items.length <= 1) {
        return withReflectionTags<TMetadata>(reflection, {
          type: "array",
          items: items[0] ?? {}
        });
      }
      return withReflectionTags<TMetadata>(reflection, {
        type: "array",
        items,
        minItems: items.length,
        maxItems: items.length
      });
    }
    case ReflectionKind.union: {
      const branches = reflection.types
        .map(inner => reflectionToJsonSchemaInner<TMetadata>(inner))
        .filter((item): item is JsonSchemaType => item !== undefined);
      const nullable = reflection.types.some(
        inner =>
          inner.kind === ReflectionKind.null ||
          inner.kind === ReflectionKind.undefined
      );
      const nonNull = branches.filter(
        branch => branch.type !== "null" && !isNullOnlySchema(branch)
      );

      if (nonNull.length === 0) {
        return withReflectionTags<TMetadata>(reflection, { type: "null" });
      }

      if (nonNull.length === 1) {
        return withNullable(
          withReflectionTags<TMetadata>(reflection, nonNull[0]!),
          nullable
        );
      }

      const enumValues = nonNull
        .map(branch => branch.const)
        .filter(value => value !== undefined);
      if (enumValues.length === nonNull.length) {
        return withNullable(
          withReflectionTags<TMetadata>(reflection, { enum: enumValues }),
          nullable
        );
      }

      const discriminator = tryReflectionDiscriminator<TMetadata>(
        reflection.types
      );
      if (discriminator) {
        return withNullable(
          withReflectionTags<TMetadata>(reflection, discriminator),
          nullable
        );
      }

      return withNullable(
        withReflectionTags<TMetadata>(reflection, { anyOf: nonNull }),
        nullable
      );
    }
    case ReflectionKind.intersection: {
      const members = reflection.types
        .map(inner => reflectionToJsonSchemaInner<TMetadata>(inner))
        .filter((item): item is JsonSchemaType => item !== undefined);
      if (members.length === 0) {
        return undefined;
      }
      if (members.length === 1) {
        return withReflectionTags<TMetadata>(reflection, members[0]!);
      }
      if (members.every(isObjectSchema)) {
        return withReflectionTags<TMetadata>(
          reflection,
          mergeObjectSchemas(members)
        );
      }
      return withReflectionTags<TMetadata>(reflection, { allOf: members });
    }
    case ReflectionKind.promise:
      return reflectionToJsonSchemaInner<TMetadata>(reflection.type);
    case ReflectionKind.objectLiteral:
      return objectReflectionToJsonSchema<TMetadata>(reflection);
    case ReflectionKind.class: {
      const classType = reflection.classType as { name?: string } | undefined;
      const className = classType?.name;
      switch (className) {
        case "Date":
          return withReflectionTags<TMetadata>(reflection, {
            type: "string",
            format: "date-time"
          });
        case "RegExp":
        case "URL":
          return withReflectionTags<TMetadata>(reflection, { type: "string" });
        case "Set": {
          const itemType = reflection.arguments?.[0];
          const items = itemType
            ? reflectionToJsonSchemaInner<TMetadata>(itemType)
            : undefined;
          return withReflectionTags<TMetadata>(reflection, {
            type: "array",
            items: items ?? {},
            uniqueItems: true
          });
        }
        case "Map": {
          const valueType = reflection.arguments?.[1];
          const values = valueType
            ? reflectionToJsonSchemaInner<TMetadata>(valueType)
            : undefined;
          return withReflectionTags<TMetadata>(reflection, {
            type: "object",
            additionalProperties: values ?? true
          });
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
          return withReflectionTags<TMetadata>(reflection, {
            type: "string",
            contentEncoding: "base64"
          });
        case undefined:
        default:
          return objectReflectionToJsonSchema<TMetadata>(reflection);
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

function isNullOnlySchema(schema: JsonSchemaLike): boolean {
  return schema.type === "null";
}

function isObjectSchema(schema: JsonSchemaLike): boolean {
  return (
    schema.type === "object" ||
    isSetObject(schema.properties) ||
    schema.additionalProperties !== undefined
  );
}

function mergeObjectSchemas(schemas: JsonSchemaLike[]): JsonSchemaLike {
  const merged: JsonSchemaLike = {
    type: "object",
    properties: {},
    required: []
  };

  for (const schema of schemas) {
    if (schema.properties) {
      merged.properties = defu(merged.properties, schema.properties);
    }
    if (schema.required) {
      merged.required = Array.from(
        new Set([...(merged.required ?? []), ...schema.required])
      );
    }
    if (schema.additionalProperties !== undefined) {
      merged.additionalProperties = schema.additionalProperties;
    }
  }

  if ((merged.required?.length ?? 0) === 0) {
    delete merged.required;
  }

  return merged;
}

function tryReflectionDiscriminator<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(types: readonly Type[]): JsonSchemaLike | undefined {
  const nonNullTypes = types.filter(
    t => t.kind !== ReflectionKind.null && t.kind !== ReflectionKind.undefined
  );
  const objectBranches: Array<TypeObjectLiteral | TypeClass> =
    nonNullTypes.filter(
      t =>
        t.kind === ReflectionKind.objectLiteral ||
        t.kind === ReflectionKind.class
    );

  if (
    objectBranches.length < 2 ||
    objectBranches.length !== nonNullTypes.length
  ) {
    return undefined;
  }

  let tagKey: string | undefined;
  const branches: JsonSchemaLike[] = [];

  for (const branch of objectBranches) {
    const literalProps: Array<{ name: string; literal: string }> = [];
    for (const member of branch.types) {
      if (
        (member.kind === ReflectionKind.property ||
          member.kind === ReflectionKind.propertySignature) &&
        typeof member.name === "string" &&
        member.type.kind === ReflectionKind.literal &&
        typeof (member.type as { literal?: unknown }).literal === "string"
      ) {
        literalProps.push({
          name: member.name,
          literal: (member.type as { literal: string }).literal
        });
      }
    }

    if (literalProps.length === 0) {
      return undefined;
    }

    const first = literalProps[0]!;
    if (!tagKey) {
      tagKey = first.name;
    } else if (tagKey !== first.name) {
      return undefined;
    }

    const filteredBranch = {
      ...branch,
      types: branch.types.filter(
        member =>
          !(
            (member.kind === ReflectionKind.property ||
              member.kind === ReflectionKind.propertySignature) &&
            member.name === tagKey
          )
      )
    } as TypeObjectLiteral | TypeClass;

    const body = objectReflectionToJsonSchema<TMetadata>(filteredBranch);
    if (!body || !isObjectSchema(body)) {
      return undefined;
    }

    branches.push({
      type: "object",
      properties: {
        [tagKey]: { const: first.literal },
        ...(body.properties ?? {})
      },
      required: [tagKey, ...(body.required ?? [])],
      additionalProperties: body.additionalProperties ?? false
    });
  }

  if (!tagKey) {
    return undefined;
  }

  return {
    oneOf: branches,
    discriminator: { propertyName: tagKey }
  };
}

function objectReflectionToJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(type: TypeObjectLiteral | TypeClass): JsonSchemaType {
  const reflection = ReflectionClass.from(type);
  const properties: Record<string, JsonSchemaLike> = {};
  const required: string[] = [];
  let additionalProperties: boolean | JsonSchemaLike | undefined;

  const metadata = {
    isReadonly: reflection.isReadonly(),
    isIgnored: reflection.isIgnored(),
    isInternal: reflection.isInternal(),
    isRuntime: reflection.isRuntime(),
    isHidden: reflection.isHidden(),
    ...(isSetString(reflection.databaseSchemaName)
      ? { resourceId: reflection.databaseSchemaName }
      : {}),
    ...(isSetString(reflection.getName())
      ? { name: reflection.getName() }
      : {}),
    ...(isSetString(reflection.getDescription())
      ? { description: reflection.getDescription() }
      : {}),
    ...(isSetArray(reflection.getAlias()) ? { alias: reflection.getAlias() } : {}),
    ...(isSetString(reflection.getTitle())
      ? { title: reflection.getTitle() }
      : {})
  } as TMetadata;

  for (const propertyReflection of reflection.getProperties()) {
    if (propertyReflection.getKind() === ReflectionKind.indexSignature) {
      const valueSchema = reflectionToJsonSchemaInner<TMetadata>(
        propertyReflection.type
      );
      additionalProperties = valueSchema ?? true;
      continue;
    }

    const property = reflectionToJsonSchemaInner<TMetadata>(
      propertyReflection.type
    );
    if (!property) {
      continue;
    }

    const propertyMetadata = {
      ...getSchemaMetadata<TMetadata>(property),
      isReadonly: propertyReflection.isReadonly(),
      isIgnored: propertyReflection.isIgnored(),
      isInternal: propertyReflection.isInternal(),
      isRuntime: propertyReflection.isRuntime(),
      isPrimaryKey: propertyReflection.isPrimaryKey(),
      isHidden: propertyReflection.isHidden(),
      visibility: propertyReflection.isPublic()
        ? "public"
        : propertyReflection.isProtected()
          ? "protected"
          : propertyReflection.isPrivate()
            ? "private"
            : undefined,
      ...(propertyReflection.hasDefault()
        ? { default: propertyReflection.getDefaultValue() }
        : {}),
      ...(isSetString(propertyReflection.getNameAsString())
        ? { name: propertyReflection.getNameAsString() }
        : {}),
      ...(isSetArray(propertyReflection.getGroups())
        ? { groups: propertyReflection.getGroups() }
        : {}),
      ...(isSetString(propertyReflection.getDescription())
        ? { description: propertyReflection.getDescription() }
        : {}),
      ...(isSetArray(propertyReflection.getAlias())
        ? { alias: propertyReflection.getAlias() }
        : {}),
      ...(isSetString(propertyReflection.getTitle())
        ? { title: propertyReflection.getTitle() }
        : {})
    } as TMetadata;

    let propertySchema = applySchemaMetadata(property, propertyMetadata);
    if (propertyReflection.isNullable()) {
      propertySchema = withNullable(propertySchema, true);
    }

    properties[propertyReflection.name] = propertySchema;
    if (!propertyReflection.isOptional()) {
      required.push(propertyReflection.name);
    }
  }

  const schema: JsonSchemaLike = {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
    ...(additionalProperties !== undefined ? { additionalProperties } : {})
  };

  return applySchemaMetadata(
    schema,
    metadata
  ) as JsonSchemaType;
}
