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
  isBigInt,
  isBoolean,
  isInteger,
  isNull,
  isNumber,
  isRegExp,
  isSetArray,
  isSetObject,
  isSetString,
  isString,
  isUndefined
} from "@stryke/type-checks";
import defu from "defu";
import { getJsonSchemaType } from "./codegen";
import {
  isJsonSchemaObject,
  isJsonSchemaPrimitiveType,
  isNullOnlyJsonSchema
} from "./type-checks";
import {
  JsonSchema,
  JsonSchemaNullable,
  JsonSchemaObject,
  JsonSchemaPrimitiveType
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
): JsonSchema {
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

function withReflectionTags(reflection: Type, schema: JsonSchema): JsonSchema {
  if (
    !isSetObject(schema) ||
    !isSetObject((reflection as { tags?: TagsReflection })?.tags)
  ) {
    return schema;
  }

  const updatedSchema = { ...schema };
  const tags = (reflection as { tags: TagsReflection }).tags;
  if (isSetString(tags.title)) {
    updatedSchema.title = tags.title;
  }
  if (isSetArray(tags.alias)) {
    updatedSchema.alias = tags.alias;
  }
  if (!isUndefined(tags.hidden)) {
    updatedSchema.hidden = tags.hidden;
  }
  if (!isUndefined(tags.ignore)) {
    updatedSchema.ignore = tags.ignore;
  }
  if (!isUndefined(tags.internal)) {
    updatedSchema.internal = tags.internal;
  }
  if (!isUndefined(tags.runtime)) {
    updatedSchema.runtime = tags.runtime;
  }
  if (!isUndefined(tags.readonly)) {
    updatedSchema.readOnly = tags.readonly;
  }

  return updatedSchema;
}

function withNullable(schema: JsonSchema): JsonSchemaNullable {
  if (!isSetObject(schema)) {
    return {
      anyOf: [schema, { type: "null", default: null }]
    };
  }

  const rawType = (schema as { type?: string | readonly string[] }).type;

  const types = Array.isArray(rawType)
    ? [...rawType]
    : rawType
      ? [rawType]
      : [];
  if (!types.includes("null")) {
    types.push("null");
  }

  return {
    ...schema,
    type: types.length === 1 ? types[0] : types
  };
}

/**
 * Converts a Deepkit type reflection into a JSON Schema (draft-07) fragment.
 */
export function reflectionToJsonSchema(
  reflection: Type
): JsonSchema | undefined {
  return reflectionToJsonSchemaInner(reflection);
}

function reflectionToJsonSchemaInner(reflection: Type): JsonSchema | undefined {
  switch (reflection.kind) {
    case ReflectionKind.any:
    case ReflectionKind.unknown:
    case ReflectionKind.void:
    case ReflectionKind.object:
      return withReflectionTags(reflection, { name: reflection.typeName });
    case ReflectionKind.never:
      return undefined;
    case ReflectionKind.undefined:
    case ReflectionKind.null:
      return withReflectionTags(reflection, {
        type: "null",
        name: reflection.typeName,
        default: null
      });
    case ReflectionKind.string:
      return withReflectionTags(reflection, {
        type: "string",
        name: reflection.typeName
      });
    case ReflectionKind.boolean:
      return withReflectionTags(reflection, {
        type: "boolean",
        name: reflection.typeName
      });
    case ReflectionKind.number: {
      const numeric = numberBrandToJsonSchema(reflection.brand);

      return withReflectionTags(reflection, numeric);
    }
    case ReflectionKind.bigint:
      return withReflectionTags(reflection, {
        type: "integer",
        name: reflection.typeName,
        format: "int64"
      });
    case ReflectionKind.regexp:
      return withReflectionTags(reflection, {
        type: "string",
        name: reflection.typeName,
        format: "regex",
        contentMediaType: "text/regex"
      });
    case ReflectionKind.literal: {
      const { literal } = reflection;
      if (isBigInt(literal)) {
        return withReflectionTags(reflection, {
          type: "integer",
          name: reflection.typeName,
          format: "int64",
          const: literal
        });
      }

      if (isRegExp(literal)) {
        return withReflectionTags(reflection, {
          type: "string",
          name: reflection.typeName,
          format: "regex",
          const: literal.source
        });
      }

      return withReflectionTags(reflection, {
        type: getJsonSchemaType(literal),
        name: reflection.typeName,
        const: literal
      });
    }
    case ReflectionKind.templateLiteral:
      return withReflectionTags(reflection, { type: "string" });
    case ReflectionKind.enum: {
      const values = reflection.values.filter(
        value =>
          isString(value) ||
          isInteger(value) ||
          isBigInt(value) ||
          isNumber(value) ||
          isBoolean(value) ||
          isNull(value)
      ) as (string | number | bigint | boolean | null)[];
      if (values.length === 0) {
        return withReflectionTags(reflection, {
          name: reflection.typeName,
          description: reflection.description,
          enum: []
        });
      }

      return withReflectionTags(reflection, {
        type: values.every(value => isString(value))
          ? "string"
          : values.every(value => isInteger(value) || isBigInt(value))
            ? "integer"
            : values.every(value => isNumber(value))
              ? "number"
              : values.every(value => isBoolean(value))
                ? "boolean"
                : values.every(value => isNull(value))
                  ? "null"
                  : values.reduce((ret, value) => {
                      const type = getJsonSchemaType(value);
                      if (
                        isJsonSchemaPrimitiveType(type) &&
                        !ret.includes(type)
                      ) {
                        ret.push(type);
                      }

                      return ret;
                    }, [] as JsonSchemaPrimitiveType[]),
        name: reflection.typeName,
        description: reflection.description,
        enum: values,
        default: values.length === 1 ? values[0] : undefined
      });
    }
    case ReflectionKind.array: {
      const items = reflectionToJsonSchemaInner(reflection.type);

      return withReflectionTags(reflection, {
        type: "array",
        name: reflection.typeName,
        items: items ?? {}
      });
    }
    case ReflectionKind.tuple: {
      const items = reflection.types
        .map(member => reflectionToJsonSchemaInner(member.type))
        .filter((item): item is JsonSchema => item !== undefined);
      if (items.length <= 1) {
        return withReflectionTags(reflection, {
          type: "array",
          name: reflection.typeName,
          items: items.length === 1 ? items[0] : {}
        });
      }

      return withReflectionTags(reflection, {
        type: "array",
        name: reflection.typeName,
        prefixItems: items,
        minItems: items.length,
        maxItems: items.length
      });
    }
    case ReflectionKind.union: {
      const branches = reflection.types
        .map(inner => reflectionToJsonSchemaInner(inner))
        .filter((branch): branch is JsonSchema => branch !== undefined);
      if (
        !reflection.types.some(
          inner =>
            inner.kind === ReflectionKind.null ||
            inner.kind === ReflectionKind.undefined
        )
      ) {
        return withReflectionTags(reflection, {
          name: reflection.typeName,
          anyOf: branches
        });
      }

      const nonNull = branches.filter(branch => !isNullOnlyJsonSchema(branch));
      if (nonNull.length === 0) {
        return withReflectionTags(reflection, {
          type: "null",
          default: null
        });
      }

      if (nonNull.length === 1) {
        const first = nonNull[0]!;

        if (!isSetObject(first)) {
          return withNullable(
            withReflectionTags(reflection, {
              name: reflection.typeName,
              anyOf: [first]
            })
          );
        }

        return withNullable(
          withReflectionTags(reflection, {
            name: reflection.typeName,
            ...(first as Record<string, unknown>)
          })
        );
      }

      const enumValues = nonNull
        .map(branch =>
          isSetObject(branch)
            ? (branch as { const?: unknown }).const
            : undefined
        )
        .filter(
          (value): value is string | number | bigint | boolean | null =>
            value === null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "bigint" ||
            typeof value === "boolean"
        );
      if (enumValues.length === nonNull.length) {
        return withNullable(
          withReflectionTags(reflection, {
            name: reflection.typeName,
            enum: enumValues
          })
        );
      }

      const discriminator = tryReflectionDiscriminator(reflection.types);
      if (discriminator && isSetObject(discriminator)) {
        return withNullable(
          withReflectionTags(reflection, {
            name: reflection.typeName,
            ...(discriminator as Record<string, unknown>)
          })
        );
      }

      return withNullable(
        withReflectionTags(reflection, {
          name: reflection.typeName,
          anyOf: nonNull
        })
      );
    }
    case ReflectionKind.intersection: {
      const members = reflection.types
        .map(inner => reflectionToJsonSchemaInner(inner))
        .filter((item): item is JsonSchema => item !== undefined);
      if (members.length === 0) {
        return undefined;
      }
      if (members.length === 1) {
        if (!isSetObject(members[0])) {
          return members[0];
        }

        return withReflectionTags(reflection, {
          name: reflection.typeName,
          ...members[0]
        });
      }
      if (members.every(isJsonSchemaObject)) {
        return withReflectionTags(reflection, {
          name: reflection.typeName,
          ...mergeObjectSchemas(members)
        });
      }
      return withReflectionTags(reflection, {
        name: reflection.typeName,
        allOf: members
      });
    }
    case ReflectionKind.promise:
      return reflectionToJsonSchemaInner(reflection.type);
    case ReflectionKind.objectLiteral:
      return objectReflectionToJsonSchema(reflection);
    case ReflectionKind.class: {
      const classType = reflection.classType as { name?: string } | undefined;
      const className = classType?.name;
      switch (className) {
        case "Date":
          return withReflectionTags(reflection, {
            type: "string",
            format: "date-time"
          });
        case "RegExp":
          return withReflectionTags(reflection, {
            type: "string",
            format: "regex"
          });
        case "URL":
          return withReflectionTags(reflection, {
            type: "string",
            format: "uri"
          });
        case "Set": {
          const itemType = reflection.arguments?.[0];
          const items = itemType
            ? reflectionToJsonSchemaInner(itemType)
            : undefined;

          return withReflectionTags(reflection, {
            type: "array",
            items: items ?? {},
            uniqueItems: true
          });
        }
        case "Map": {
          const valueType = reflection.arguments?.[1];
          const values = valueType
            ? reflectionToJsonSchemaInner(valueType)
            : undefined;

          return withReflectionTags(reflection, {
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
          return withReflectionTags(reflection, {
            type: "string",
            format: "byte",
            contentEncoding: "base64"
          });
        case undefined:
        default:
          return withReflectionTags(reflection, {
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

function mergeObjectSchemas(schemas: JsonSchemaObject[]): JsonSchemaObject {
  const merged: JsonSchemaObject = {
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

function tryReflectionDiscriminator(
  types: readonly Type[]
): JsonSchema | undefined {
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
  const branches: JsonSchemaObject[] = [];

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
    });
  }

  if (!tagKey) {
    return undefined;
  }

  return {
    oneOf: branches,
    discriminator: { propertyName: tagKey }
  } as JsonSchema;
}

function objectReflectionToJsonSchema(
  type: TypeObjectLiteral | TypeClass
): JsonSchemaObject {
  const reflection = ReflectionClass.from(type);

  const schema: JsonSchemaObject = {
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

    let property = reflectionToJsonSchemaInner(
      propertyReflection.type
    ) as JsonSchema;
    if (!property) {
      continue;
    }

    const propertySchema = isSetObject(property) ? property : {};

    property = {
      ...propertySchema,
      name: propertyReflection.getNameAsString(),
      description: propertyReflection.getDescription(),
      readOnly: propertyReflection.isReadonly(),
      ignore: propertyReflection.isIgnored(),
      internal: propertyReflection.isInternal(),
      runtime: propertyReflection.isRuntime(),
      hidden: propertyReflection.isHidden(),
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
      property = withNullable(property);
    }

    schema.properties ??= {};
    schema.properties[propertyReflection.name] = property;
    if (!propertyReflection.isOptional()) {
      schema.required ??= [];
      schema.required.push(propertyReflection.name);
    }
  }

  return schema;
}
