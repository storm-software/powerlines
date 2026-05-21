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
import {
  isSetArray,
  isSetObject,
  isSetString,
  isUndefined
} from "@stryke/type-checks";
import defu from "defu";
import {
  isJsonSchema,
  isJsonSchemaObject,
  isNullOnlyJsonSchema
} from "./type-checks";
import {
  JsonSchema,
  JsonSchemaLike,
  JsonSchemaObject,
  JsonSchemaProperty
} from "./types";

/**
 * Maps a Deepkit numeric `brand` to JSON Schema `type` and `format`.
 *
 * @remarks
 * This function takes a `TypeNumberBrand` (which represents specific numeric types in Deepkit, such as `integer`, `float`, `int8`, etc.) and returns a corresponding JSON Schema fragment that includes the appropriate `type`, `format`, and any relevant keywords (like `multipleOf` for integers). If the brand is not recognized, it defaults to a generic JSON Schema for numbers.
 *
 * @param brand - The Deepkit numeric brand to convert.
 * @return A JSON Schema fragment representing the numeric type corresponding to the provided brand.
 */
function numberBrandToJsonSchema(
  brand: TypeNumberBrand | undefined
): JsonSchema<number> {
  switch (brand) {
    case TypeNumberBrand.integer:
      return {
        type: "integer",
        format: "int32",
        multipleOf: 1
      };
    case TypeNumberBrand.int8:
      return { type: "integer", format: "int8", multipleOf: 1 };
    case TypeNumberBrand.uint8:
      return { type: "integer", format: "uint8", multipleOf: 1 };
    case TypeNumberBrand.int16:
      return { type: "integer", format: "int16", multipleOf: 1 };
    case TypeNumberBrand.uint16:
      return { type: "integer", format: "uint16", multipleOf: 1 };
    case TypeNumberBrand.int32:
      return { type: "integer", format: "int32", multipleOf: 1 };
    case TypeNumberBrand.uint32:
      return { type: "integer", format: "uint32", multipleOf: 1 };
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

function withReflectionTags<T = unknown>(
  reflection: Type,
  schema: Partial<JsonSchema<T>>
): JsonSchema<T> {
  if (!isSetObject((reflection as { tags?: TagsReflection })?.tags)) {
    return schema as JsonSchema<T>;
  }

  const tags = (reflection as { tags: TagsReflection }).tags;
  if (isSetString(tags.title)) {
    schema.title = tags.title;
  }
  if (isSetArray(tags.alias)) {
    schema.alias = tags.alias;
  }
  if (!isUndefined(tags.hidden)) {
    schema.hidden = tags.hidden;
  }
  if (!isUndefined(tags.ignore)) {
    schema.ignore = tags.ignore;
  }
  if (!isUndefined(tags.internal)) {
    schema.internal = tags.internal;
  }
  if (!isUndefined(tags.runtime)) {
    schema.runtime = tags.runtime;
  }
  if (!isUndefined(tags.readonly)) {
    schema.readOnly = tags.readonly;
  }

  return schema as JsonSchema<T>;
}

function withNullable<T = unknown>(
  schema: JsonSchema<T>,
  nullable: boolean
): JsonSchema<T> {
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

  return {
    ...schema,
    type: types.length === 1 ? types[0] : types
  } as JsonSchema<T>;
}

/**
 * Converts a Deepkit type reflection into a JSON Schema (draft-07) fragment.
 */
export function reflectionToJsonSchema<T = unknown>(
  reflection: Type
): JsonSchema<T> | undefined {
  return reflectionToJsonSchemaInner<T>(reflection);
}

function reflectionToJsonSchemaInner<T = unknown>(
  reflection: Type
): JsonSchema<T> | undefined {
  switch (reflection.kind) {
    case ReflectionKind.any:
    case ReflectionKind.unknown:
    case ReflectionKind.void:
    case ReflectionKind.object:
      return withReflectionTags<T>(reflection, { name: reflection.typeName });
    case ReflectionKind.never:
      return undefined;
    case ReflectionKind.undefined:
    case ReflectionKind.null:
      return withReflectionTags<T>(reflection, {
        type: "null",
        name: reflection.typeName,
        nullable: true
      });
    case ReflectionKind.string:
      return withReflectionTags<T>(reflection, {
        type: "string",
        name: reflection.typeName
      });
    case ReflectionKind.boolean:
      return withReflectionTags<T>(reflection, {
        type: "boolean",
        name: reflection.typeName
      });
    case ReflectionKind.number: {
      const numeric = numberBrandToJsonSchema(reflection.brand);

      return withReflectionTags<T>(reflection, numeric as JsonSchema<T>);
    }
    case ReflectionKind.bigint:
      return withReflectionTags<T>(reflection, {
        type: "integer",
        name: reflection.typeName,
        format: "int64",
        multipleOf: 1
      });
    case ReflectionKind.regexp:
      return withReflectionTags<T>(reflection, {
        type: "string",
        name: reflection.typeName,
        format: "regex",
        contentMediaType: "text/regex"
      });
    case ReflectionKind.literal: {
      const { literal } = reflection;
      if (
        typeof literal === "string" ||
        typeof literal === "number" ||
        typeof literal === "boolean"
      ) {
        return withReflectionTags<T>(reflection, {
          type: typeof literal,
          name: reflection.typeName,
          const: literal
        });
      }
      if (typeof literal === "bigint") {
        return withReflectionTags<T>(reflection, {
          type: "integer",
          name: reflection.typeName,
          format: "int64",
          multipleOf: 1,
          const: String(literal)
        });
      }
      if (literal instanceof RegExp) {
        return withReflectionTags<T>(reflection, {
          type: "string",
          name: reflection.typeName,
          format: "regex",
          const: literal.source
        });
      }
      return withReflectionTags<T>(reflection, {
        name: reflection.typeName
      });
    }
    case ReflectionKind.templateLiteral:
      return withReflectionTags<T>(reflection, { type: "string" });
    case ReflectionKind.enum: {
      const values = reflection.values.filter(
        value =>
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
      );
      if (values.length === 0) {
        return withReflectionTags<T>(reflection, {
          name: reflection.typeName,
          description: reflection.description
        });
      }
      return withReflectionTags<T>(reflection, {
        name: reflection.typeName,
        description: reflection.description,
        enum: values
      });
    }
    case ReflectionKind.array: {
      const items = reflectionToJsonSchemaInner<T>(reflection.type);

      return withReflectionTags<T>(reflection, {
        type: "array",
        name: reflection.typeName,
        items: items ?? {}
      });
    }
    case ReflectionKind.tuple: {
      const items = reflection.types
        .map(member => reflectionToJsonSchemaInner<T>(member.type))
        .filter((item): item is JsonSchema => item !== undefined);
      if (items.length <= 1) {
        return withReflectionTags<T>(reflection, {
          type: "array",
          name: reflection.typeName,
          items: items[0] ?? {}
        });
      }
      return withReflectionTags<T>(reflection, {
        type: "array",
        name: reflection.typeName,
        items,
        minItems: items.length,
        maxItems: items.length
      });
    }
    case ReflectionKind.union: {
      const branches = reflection.types
        .map(inner => reflectionToJsonSchemaInner<T>(inner))
        .filter(isJsonSchema) as JsonSchema<T>[];
      const nullable = reflection.types.some(
        inner =>
          inner.kind === ReflectionKind.null ||
          inner.kind === ReflectionKind.undefined
      );
      const nonNull = branches.filter(
        branch => branch.type !== "null" && !isNullOnlyJsonSchema(branch)
      );

      if (nonNull.length === 0) {
        return withReflectionTags<T>(reflection, {
          type: "null",
          nullable: true
        });
      }

      if (nonNull.length === 1) {
        return withNullable(
          withReflectionTags<T>(reflection, {
            name: reflection.typeName,
            ...nonNull[0]
          }),
          nullable
        );
      }

      const enumValues = nonNull
        .map(branch => branch.const)
        .filter(value => value !== undefined);
      if (enumValues.length === nonNull.length) {
        return withNullable(
          withReflectionTags<T>(reflection, {
            name: reflection.typeName,
            enum: enumValues
          }),
          nullable
        );
      }

      const discriminator = tryReflectionDiscriminator<T>(reflection.types);
      if (discriminator) {
        return withNullable(
          withReflectionTags<T>(reflection, {
            name: reflection.typeName,
            ...discriminator
          }),
          nullable
        );
      }

      return withNullable(
        withReflectionTags<T>(reflection, {
          name: reflection.typeName,
          anyOf: nonNull
        }),
        nullable
      );
    }
    case ReflectionKind.intersection: {
      const members = reflection.types
        .map(inner => reflectionToJsonSchemaInner<T>(inner))
        .filter((item): item is JsonSchema => item !== undefined);
      if (members.length === 0) {
        return undefined;
      }
      if (members.length === 1) {
        return withReflectionTags<T>(reflection, {
          name: reflection.typeName,
          ...members[0]
        });
      }
      if (members.every(isJsonSchemaObject)) {
        return withReflectionTags<T>(reflection, {
          name: reflection.typeName,
          ...mergeObjectSchemas(members)
        });
      }
      return withReflectionTags<T>(reflection, {
        name: reflection.typeName,
        allOf: members
      });
    }
    case ReflectionKind.promise:
      return reflectionToJsonSchemaInner<T>(reflection.type);
    case ReflectionKind.objectLiteral:
      return objectReflectionToJsonSchema(reflection);
    case ReflectionKind.class: {
      const classType = reflection.classType as { name?: string } | undefined;
      const className = classType?.name;
      switch (className) {
        case "Date":
          return withReflectionTags<T>(reflection, {
            type: "string",
            format: "date-time"
          });
        case "RegExp":
          return withReflectionTags<T>(reflection, {
            type: "string",
            format: "regex"
          });
        case "URL":
          return withReflectionTags<T>(reflection, {
            type: "string",
            format: "uri"
          });
        case "Set": {
          const itemType = reflection.arguments?.[0];
          const items = itemType
            ? reflectionToJsonSchemaInner<T>(itemType)
            : undefined;

          return withReflectionTags<T>(reflection, {
            type: "array",
            items: items ?? {},
            uniqueItems: true
          });
        }
        case "Map": {
          const valueType = reflection.arguments?.[1];
          const values = valueType
            ? reflectionToJsonSchemaInner<T>(valueType)
            : undefined;

          return withReflectionTags<T>(reflection, {
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
          return withReflectionTags<T>(reflection, {
            type: "string",
            format: "byte",
            contentEncoding: "base64"
          });
        case undefined:
        default:
          return withReflectionTags<T>(reflection, {
            name: reflection.typeName,
            description: reflection.description,
            ...objectReflectionToJsonSchema(reflection)
          });
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

function mergeObjectSchemas<T = unknown>(
  schemas: JsonSchema<T>[]
): JsonSchema<T> {
  const merged: JsonSchema<T> = {
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

function tryReflectionDiscriminator<T = unknown>(
  types: readonly Type[]
): JsonSchema<T> | undefined {
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

    const body = objectReflectionToJsonSchema(filteredBranch);
    if (!body || !isJsonSchemaObject(body)) {
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
    } as JsonSchemaLike);
  }

  if (!tagKey) {
    return undefined;
  }

  return {
    oneOf: branches,
    discriminator: { propertyName: tagKey }
  } as JsonSchema<T>;
}

function objectReflectionToJsonSchema<
  T extends Record<string, any> = Record<string, any>
>(type: TypeObjectLiteral | TypeClass): JsonSchema<T> {
  const reflection = ReflectionClass.from(type);

  const schema: JsonSchemaObject<T> = {
    type: "object",
    name: reflection.getName(),
    description: reflection.getDescription(),
    properties: {},
    required: [],
    readOnly: reflection.isReadonly(),
    ignore: reflection.isIgnored(),
    internal: reflection.isInternal(),
    runtime: reflection.isRuntime(),
    hidden: reflection.isHidden(),
    primaryKey: reflection
      .getPrimaries()
      .map(primary => primary.getNameAsString()),
    ...(isSetString(reflection.databaseSchemaName)
      ? { databaseSchemaName: reflection.databaseSchemaName }
      : {}),
    ...(isSetString(reflection.getName())
      ? { name: reflection.getName() }
      : {}),
    ...(isSetString(reflection.getDescription())
      ? { description: reflection.getDescription() }
      : {}),
    ...(isSetArray(reflection.getAlias())
      ? { alias: reflection.getAlias() }
      : {}),
    ...(isSetString(reflection.getTitle())
      ? { title: reflection.getTitle() }
      : {})
  };

  for (const propertyReflection of reflection.getProperties()) {
    if (propertyReflection.getKind() === ReflectionKind.indexSignature) {
      schema.additionalProperties =
        reflectionToJsonSchemaInner(propertyReflection.type) ?? true;
      continue;
    }

    let property = reflectionToJsonSchemaInner<any>(propertyReflection.type);
    if (!property) {
      continue;
    }

    property = {
      ...property,
      name: propertyReflection.getNameAsString(),
      description: propertyReflection.getDescription(),
      readOnly: propertyReflection.isReadonly(),
      ignore: propertyReflection.isIgnored(),
      internal: propertyReflection.isInternal(),
      runtime: propertyReflection.isRuntime(),
      hidden: propertyReflection.isHidden(),
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
      ...(isSetArray(propertyReflection.getGroups())
        ? { tags: propertyReflection.getGroups() }
        : {}),
      ...(isSetArray(propertyReflection.getAlias())
        ? { alias: propertyReflection.getAlias() }
        : {}),
      ...(isSetString(propertyReflection.getTitle())
        ? { title: propertyReflection.getTitle() }
        : {})
    };

    if (propertyReflection.isNullable()) {
      property = withNullable(property, true);
    }

    schema.properties ??= {};
    schema.properties[propertyReflection.name] =
      property as JsonSchemaProperty<T>;
    if (!propertyReflection.isOptional()) {
      schema.required ??= [];
      schema.required.push(propertyReflection.name);
    }
  }

  return schema;
}
