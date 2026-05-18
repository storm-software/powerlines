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
import { JTDSchemaType, SchemaMetadata } from "./types";

/**
 * Maps a Deepkit numeric `brand` to the JTD numeric `type` keyword that best preserves the underlying width and signedness.
 *
 * @param brand - The Deepkit `TypeNumberBrand` of a numeric reflection, or `undefined` when no brand is set.
 * @returns The JTD numeric `type` keyword to use.
 */
function numberBrandToJtdType(
  brand: TypeNumberBrand | undefined
):
  | "int8"
  | "uint8"
  | "int16"
  | "uint16"
  | "int32"
  | "uint32"
  | "float32"
  | "float64" {
  switch (brand) {
    case TypeNumberBrand.integer:
      return "int32";
    case TypeNumberBrand.int8:
      return "int8";
    case TypeNumberBrand.uint8:
      return "uint8";
    case TypeNumberBrand.int16:
      return "int16";
    case TypeNumberBrand.uint16:
      return "uint16";
    case TypeNumberBrand.int32:
      return "int32";
    case TypeNumberBrand.uint32:
      return "uint32";
    case TypeNumberBrand.float:
    case TypeNumberBrand.float32:
      return "float32";
    case TypeNumberBrand.float64:
      return "float64";
    case undefined:
    default:
      return "float64";
  }
}

/**
 * Converts a Deepkit type reflection into a JSON Type Definition (RFC 8927) form suitable for AJV's JTD validator.
 *
 * @remarks
 * Some TypeScript constructs have no direct JTD equivalent and are handled with the closest available form:
 *
 * - `null` and `undefined` become the empty JTD form with `nullable: true`.
 * - Unions of primitives that cannot be expressed as a JTD enum collapse to the empty form (which validates any value).
 * - String/number/bigint literal unions are emitted as a JTD enum (non-string members are stringified, as JTD requires string enum members).
 * - Tuples are emitted as a JTD elements form whose element schema is the single tuple member type, or the empty schema for mixed tuples.
 * - `Date` is emitted as `{ type: "timestamp" }`.
 * - Discriminated unions of object literals (a shared string-literal tag property) are emitted as a JTD discriminator form.
 *
 * @param reflection - The Deepkit type reflection to convert.
 * @returns The corresponding JTD form, or `undefined` if the type cannot be represented.
 */
export function reflectionToJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type): JTDSchemaType<TMetadata> | undefined {
  const result = reflectionToJtd<TMetadata>(reflection);

  return result;
}

/**
 * Internal worker that performs the recursive Deepkit reflection → JTD conversion.
 *
 * @param reflection - The Deepkit type reflection to convert.
 * @returns The corresponding JTD form, or `undefined` if the type cannot be represented.
 */
function reflectionToJtd<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type): JTDSchemaType<TMetadata> | undefined {
  const schema = {} as JTDSchemaType<TMetadata>;

  if (isSetObject((reflection as { tags?: TagsReflection })?.tags)) {
    const tags = (reflection as { tags: TagsReflection }).tags;

    schema.metadata = (schema.metadata ?? {}) as TMetadata;
    if (tags.readonly === true) {
      schema.metadata.isReadonly = true;
    }
    if (tags.ignore === true) {
      schema.metadata.isIgnored = true;
    }
    if (tags.internal === true) {
      schema.metadata.isInternal = true;
    }
    if (tags.runtime === true) {
      schema.metadata.isRuntime = true;
    }
    if (tags.hidden === true) {
      schema.metadata.isHidden = true;
    }
    if (isSetArray(tags.alias)) {
      schema.metadata.alias = tags.alias;
    }
    if (isSetString(tags.title)) {
      schema.metadata.title = tags.title;
    }
  }

  switch (reflection.kind) {
    case ReflectionKind.any:
    case ReflectionKind.unknown:
    case ReflectionKind.void:
    case ReflectionKind.object:
      return {};
    case ReflectionKind.never:
      return undefined;
    case ReflectionKind.undefined:
    case ReflectionKind.null:
      return { nullable: true };
    case ReflectionKind.string:
      return { ...schema, type: "string" };
    case ReflectionKind.boolean:
      return { ...schema, type: "boolean" };
    case ReflectionKind.number:
      return {
        ...schema,
        type: numberBrandToJtdType(reflection.brand)
      };
    case ReflectionKind.bigint:
      // JTD has no native 64-bit integer type — float64 is the widest numeric form.
      return { ...schema, type: "float64" };
    case ReflectionKind.regexp:
      return { ...schema, type: "string" };
    case ReflectionKind.literal: {
      const { literal } = reflection;
      if (typeof literal === "string") {
        return { ...schema, enum: [literal] };
      }

      if (typeof literal === "number" || typeof literal === "bigint") {
        return {
          ...schema,
          enum: [String(literal)]
        };
      }

      if (typeof literal === "boolean") {
        // JTD has no boolean literal — emit the type form.
        return { ...schema, type: "boolean" };
      }

      if (literal instanceof RegExp) {
        return { ...schema, type: "string" };
      }

      return schema;
    }
    case ReflectionKind.templateLiteral:
      return { ...schema, type: "string" };
    case ReflectionKind.enum: {
      const values = reflection.values
        .filter(
          (value): value is string | number =>
            typeof value === "string" || typeof value === "number"
        )
        .map(value => String(value));

      const unique = Array.from(new Set(values));
      if (unique.length === 0) {
        return schema;
      }

      return { ...schema, enum: unique };
    }
    case ReflectionKind.array: {
      const items = reflectionToJtd<TMetadata>(reflection.type);

      return { ...schema, elements: items ?? {} };
    }
    case ReflectionKind.tuple: {
      const items = reflection.types
        .map(member => reflectionToJtd<TMetadata>(member.type))
        .filter((item): item is JTDSchemaType<TMetadata> => item !== undefined);
      if (items.length === 0) {
        return { ...schema, elements: {} };
      }

      if (items.length === 1) {
        return { ...schema, elements: items[0]! };
      }

      // JTD has no tuple form — accept any element shape.
      return { ...schema, elements: {} };
    }
    case ReflectionKind.union: {
      const branches = reflection.types
        .map(inner => reflectionToJtd<TMetadata>(inner))
        .filter((item): item is JTDSchemaType<TMetadata> => item !== undefined);

      const nullable = reflection.types.some(
        inner =>
          inner.kind === ReflectionKind.null ||
          inner.kind === ReflectionKind.undefined
      );
      const nonNull = branches.filter(b => !isPureNullable(b));

      if (nonNull.length === 0) {
        return { ...schema, nullable: true };
      }

      if (nonNull.length === 1) {
        const only = nonNull[0]!;
        if (nullable) {
          (only as { nullable?: boolean }).nullable = true;
        }

        return { ...schema, ...only };
      }

      // String-enum union: combine all enum branches into one JTD enum.
      if (nonNull.every(isEnumForm)) {
        const merged = Array.from(
          new Set(nonNull.flatMap(b => (b as { enum: string[] }).enum))
        );
        const form: JTDSchemaType<TMetadata> = { ...schema, enum: merged };

        if (nullable) {
          (form as { nullable?: boolean }).nullable = true;
        }

        return { ...schema, ...form };
      }

      // Discriminated union of object literals: detect a shared string-literal tag.
      const discriminator = tryReflectionDiscriminator<TMetadata>(
        reflection.types
      );
      if (discriminator) {
        if (nullable) {
          (discriminator as { nullable?: boolean }).nullable = true;
        }

        return { ...schema, ...discriminator };
      }

      // Fallback — JTD has no general union; allow any value.
      const fallback: JTDSchemaType<TMetadata> = {};
      if (nullable) {
        (fallback as { nullable?: boolean }).nullable = true;
      }

      return { ...schema, ...fallback };
    }
    case ReflectionKind.intersection: {
      const members = reflection.types
        .map(inner => reflectionToJtd<TMetadata>(inner))
        .filter(
          (item): item is JTDSchemaType<TMetadata> | undefined =>
            item !== undefined
        );
      if (members.length === 0) {
        return undefined as JTDSchemaType<TMetadata> | undefined;
      }

      if (members.length === 1) {
        return { ...schema, ...members[0] };
      }

      if (
        members.every(member => member && isPropertiesForm<TMetadata>(member))
      ) {
        return mergePropertiesForms<TMetadata>(
          members as JTDSchemaType<TMetadata>[]
        );
      }

      return { ...schema, ...members[0] };
    }
    case ReflectionKind.promise:
      return reflectionToJtd<TMetadata>(reflection.type);
    case ReflectionKind.objectLiteral:
      return objectReflectionToJtd<TMetadata>(reflection);
    case ReflectionKind.class: {
      const classType = reflection.classType as { name?: string } | undefined;
      const className = classType?.name;
      switch (className) {
        case "Date":
          return { ...schema, type: "timestamp" };
        case "RegExp":
          return { ...schema, type: "string" };
        case "URL":
          return { ...schema, type: "string" };
        case "Set": {
          const itemType = reflection.arguments?.[0];
          const items = itemType
            ? reflectionToJtd<TMetadata>(itemType)
            : undefined;

          return { ...schema, elements: items ?? {} };
        }
        case "Map": {
          const valueType = reflection.arguments?.[1];
          const values = valueType
            ? reflectionToJtd<TMetadata>(valueType)
            : undefined;

          return { ...schema, values: values ?? {} };
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
          // Base64-encoded binary payload — represented as a plain string in JTD.
          return { ...schema, type: "string" };
        case undefined:
        default:
          return objectReflectionToJtd<TMetadata>(reflection);
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
 * Tests whether a JTD form is an enum form.
 *
 * @param form - The JTD form to inspect.
 * @returns `true` if the form is a JTD enum form.
 */
function isEnumForm<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(
  form: JTDSchemaType<TMetadata>
): form is { enum: string[]; nullable?: boolean; metadata?: TMetadata } {
  return Array.isArray((form as { enum?: unknown[] }).enum);
}

/**
 * Tests whether a JTD form is a properties form (object).
 *
 * @param form - The JTD form to inspect.
 * @returns `true` if the form is a JTD properties form.
 */
function isPropertiesForm<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(
  form: JTDSchemaType<TMetadata>
): form is {
  properties: Record<string, JTDSchemaType<TMetadata>>;
  optionalProperties?: Record<string, JTDSchemaType<TMetadata>>;
  nullable?: boolean;
  metadata?: TMetadata;
} {
  return (
    "properties" in (form as object) || "optionalProperties" in (form as object)
  );
}

/**
 * Tests whether a JTD form is the empty `{ nullable: true }` placeholder.
 *
 * @param form - The JTD form to inspect.
 * @returns `true` if the form has no shape constraints beyond `nullable`.
 */
function isPureNullable<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(form: JTDSchemaType<TMetadata>): boolean {
  const keys = Object.keys(form as object).filter(
    k => k !== "nullable" && k !== "metadata"
  );

  return (
    keys.length === 0 && (form as { nullable?: boolean }).nullable === true
  );
}

/**
 * Shallow-merges two JTD properties forms, unioning their `properties` and `optionalProperties` maps.
 *
 * @param forms - The JTD properties forms to merge.
 * @returns The merged JTD properties form.
 */
function mergePropertiesForms<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(forms: JTDSchemaType<TMetadata>[]): JTDSchemaType<TMetadata> {
  const merged: {
    properties: Record<string, JTDSchemaType<TMetadata>>;
    optionalProperties: Record<string, JTDSchemaType<TMetadata>>;
    additionalProperties?: boolean;
  } = {
    properties: {},
    optionalProperties: {}
  };

  for (const form of forms) {
    const p = (
      form as { properties?: Record<string, JTDSchemaType<TMetadata>> }
    ).properties;
    const o = (
      form as { optionalProperties?: Record<string, JTDSchemaType<TMetadata>> }
    ).optionalProperties;
    if (p) {
      Object.assign(merged.properties, p);
    }
    if (o) {
      Object.assign(merged.optionalProperties, o);
    }
    if ((form as { additionalProperties?: boolean }).additionalProperties) {
      merged.additionalProperties = true;
    }
  }

  const hasProperties = Object.keys(merged.properties).length > 0;
  const hasOptional = Object.keys(merged.optionalProperties).length > 0;
  const result: JTDSchemaType<TMetadata> = {};

  if (hasProperties) {
    (
      result as { properties: Record<string, JTDSchemaType<TMetadata>> }
    ).properties = merged.properties;
  } else if (!hasOptional) {
    (
      result as { properties: Record<string, JTDSchemaType<TMetadata>> }
    ).properties = {};
  }

  if (hasOptional) {
    (
      result as { optionalProperties: Record<string, JTDSchemaType<TMetadata>> }
    ).optionalProperties = merged.optionalProperties;
  }

  if (merged.additionalProperties) {
    (result as { additionalProperties: boolean }).additionalProperties = true;
  }

  return result;
}

/**
 * Detects whether a Deepkit union represents a tagged union and, when so, emits the corresponding JTD discriminator form.
 *
 * @param types - The Deepkit reflection types that make up the union branches.
 * @returns A JTD discriminator form if every non-null branch is an object literal that shares a string-literal tag property, otherwise `undefined`.
 */
function tryReflectionDiscriminator<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(types: readonly Type[]): JTDSchemaType<TMetadata> | undefined {
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
  const mapping: Record<string, JTDSchemaType<TMetadata>> = {};

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

    // Build the branch body excluding the discriminator property.
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

    const body = objectReflectionToJtd<TMetadata>(filteredBranch);
    if (!body || !isPropertiesForm<TMetadata>(body)) {
      return undefined;
    }

    mapping[first.literal] = body;
  }

  if (!tagKey) {
    return undefined;
  }

  return { discriminator: tagKey, mapping };
}

/**
 * Internal worker that produces a JTD properties form (or `values` form for index signatures alone) from a Deepkit object-like type.
 *
 * @param type - The class or object literal type whose members should be serialized.
 * @returns A JTD properties or values form describing the type's members.
 */
function objectReflectionToJtd<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(type: TypeObjectLiteral | TypeClass): JTDSchemaType<TMetadata> {
  const reflection = ReflectionClass.from(type);

  const schema = {} as {
    properties?: Record<string, JTDSchemaType<TMetadata>>;
    optionalProperties?: Record<string, JTDSchemaType<TMetadata>>;
    additionalProperties?: boolean;
    metadata?: TMetadata;
  };

  schema.metadata = (schema.metadata ?? {}) as TMetadata;
  schema.metadata.isReadonly = reflection.isReadonly();
  schema.metadata.isIgnored = reflection.isIgnored();
  schema.metadata.isInternal = reflection.isInternal();
  schema.metadata.isRuntime = reflection.isRuntime();
  schema.metadata.isHidden = reflection.isHidden();

  if (isSetString(reflection.databaseSchemaName)) {
    schema.metadata.table = reflection.databaseSchemaName;
  }
  if (isSetString(reflection.getDescription())) {
    schema.metadata.description = reflection.getDescription();
  }
  if (isSetArray(reflection.getAlias())) {
    schema.metadata.alias = reflection.getAlias();
  }
  if (isSetString(reflection.getTitle())) {
    schema.metadata.title = reflection.getTitle();
  }

  const properties: Record<string, JTDSchemaType<TMetadata>> = {};
  const optionalProperties: Record<string, JTDSchemaType<TMetadata>> = {};

  for (const propertyReflection of reflection.getProperties()) {
    if (propertyReflection.getKind() === ReflectionKind.indexSignature) {
      const valueSchema = reflectionToJtd<TMetadata>(propertyReflection.type);
      if (valueSchema) {
        return {
          ...schema,
          values: valueSchema,
          additionalProperties: true
        };
      }
    } else {
      const property = reflectionToJtd<TMetadata>(propertyReflection.type);
      if (!property) {
        continue;
      }

      property.metadata = (property.metadata ?? {}) as TMetadata;
      property.metadata.isReadonly = propertyReflection.isReadonly();
      property.metadata.isIgnored = propertyReflection.isIgnored();
      property.metadata.isInternal = propertyReflection.isInternal();
      property.metadata.isRuntime = propertyReflection.isRuntime();
      property.metadata.isPrimaryKey = propertyReflection.isPrimaryKey();
      property.metadata.isHidden = propertyReflection.isHidden();

      if (propertyReflection.hasDefault()) {
        property.metadata.default = propertyReflection.getDefaultValue();
      }
      if (isSetString(propertyReflection.getDescription())) {
        property.metadata.description = propertyReflection.getDescription();
      }
      if (isSetArray(propertyReflection.getAlias())) {
        property.metadata.alias = propertyReflection.getAlias();
      }
      if (isSetString(propertyReflection.getTitle())) {
        property.metadata.title = propertyReflection.getTitle();
      }

      if (propertyReflection.isOptional()) {
        optionalProperties[propertyReflection.name] = property;
      } else {
        properties[propertyReflection.name] = property;
      }
    }
  }

  if (Object.keys(properties).length > 0) {
    schema.properties = properties;
  } else if (Object.keys(optionalProperties).length > 0) {
    schema.optionalProperties = optionalProperties;
  } else {
    schema.properties = {};
  }

  return schema;
}
