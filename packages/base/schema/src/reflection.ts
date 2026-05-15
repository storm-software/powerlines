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
import { JTDSchemaType, SomeJTDSchemaType } from "ajv/dist/types/jtd-schema";

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
 * Attaches a `description` annotation to a JTD form's `metadata` bag.
 *
 * @param form - The JTD form to decorate.
 * @param description - The description text, or `undefined` to skip.
 * @returns The same JTD form, decorated when a description was provided.
 */
function attachDescription<S extends SomeJTDSchemaType>(
  form: S,
  description: string | undefined
): S {
  if (!description) {
    return form;
  }
  const metadata =
    (form as { metadata?: Record<string, unknown> }).metadata ?? {};
  metadata.description = description;
  (form as { metadata?: Record<string, unknown> }).metadata = metadata;
  return form;
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
  T = unknown,
  D extends Record<string, unknown> = Record<string, unknown>
>(reflection: Type): JTDSchemaType<T, D> | undefined {
  const result = reflectionToJtd(reflection);

  return result as JTDSchemaType<T, D> | undefined;
}

/**
 * Internal worker that performs the recursive Deepkit reflection → JTD conversion.
 *
 * @param reflection - The Deepkit type reflection to convert.
 * @returns The corresponding JTD form, or `undefined` if the type cannot be represented.
 */
function reflectionToJtd(reflection: Type): SomeJTDSchemaType | undefined {
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
      return { type: "string" };
    case ReflectionKind.boolean:
      return { type: "boolean" };
    case ReflectionKind.number:
      return { type: numberBrandToJtdType(reflection.brand) };
    case ReflectionKind.bigint:
      // JTD has no native 64-bit integer type — float64 is the widest numeric form.
      return { type: "float64" };
    case ReflectionKind.regexp:
      return { type: "string" };
    case ReflectionKind.literal: {
      const { literal } = reflection;
      if (typeof literal === "string") {
        return { enum: [literal] };
      }
      if (typeof literal === "number" || typeof literal === "bigint") {
        return { enum: [String(literal)] };
      }
      if (typeof literal === "boolean") {
        // JTD has no boolean literal — emit the type form.
        return { type: "boolean" };
      }
      if (literal instanceof RegExp) {
        return { type: "string" };
      }
      return {};
    }
    case ReflectionKind.templateLiteral:
      return { type: "string" };
    case ReflectionKind.enum: {
      const values = reflection.values
        .filter(
          (value): value is string | number =>
            typeof value === "string" || typeof value === "number"
        )
        .map(value => String(value));
      const unique = Array.from(new Set(values));
      if (unique.length === 0) {
        return {};
      }
      return { enum: unique };
    }
    case ReflectionKind.array: {
      const items = reflectionToJtd(reflection.type);

      return { elements: items ?? {} };
    }
    case ReflectionKind.tuple: {
      const items = reflection.types
        .map(member => reflectionToJtd(member.type))
        .filter((item): item is SomeJTDSchemaType => item !== undefined);
      if (items.length === 0) {
        return { elements: {} };
      }
      if (items.length === 1) {
        return { elements: items[0]! };
      }
      // JTD has no tuple form — accept any element shape.
      return { elements: {} };
    }
    case ReflectionKind.union: {
      const branches = reflection.types
        .map(inner => reflectionToJtd(inner))
        .filter((item): item is SomeJTDSchemaType => item !== undefined);

      const nullable = reflection.types.some(
        inner =>
          inner.kind === ReflectionKind.null ||
          inner.kind === ReflectionKind.undefined
      );
      const nonNull = branches.filter(b => !isPureNullable(b));

      if (nonNull.length === 0) {
        return { nullable: true };
      }
      if (nonNull.length === 1) {
        const only = nonNull[0]!;
        if (nullable) {
          (only as { nullable?: boolean }).nullable = true;
        }
        return only;
      }

      // String-enum union: combine all enum branches into one JTD enum.
      if (nonNull.every(isEnumForm)) {
        const merged = Array.from(
          new Set(nonNull.flatMap(b => (b as { enum: string[] }).enum))
        );
        const form: SomeJTDSchemaType = { enum: merged };
        if (nullable) {
          (form as { nullable?: boolean }).nullable = true;
        }
        return form;
      }

      // Discriminated union of object literals: detect a shared string-literal tag.
      const discriminator = tryReflectionDiscriminator(reflection.types);
      if (discriminator) {
        if (nullable) {
          (discriminator as { nullable?: boolean }).nullable = true;
        }
        return discriminator;
      }

      // Fallback — JTD has no general union; allow any value.
      const fallback: SomeJTDSchemaType = {};
      if (nullable) {
        (fallback as { nullable?: boolean }).nullable = true;
      }
      return fallback;
    }
    case ReflectionKind.intersection: {
      const members = reflection.types
        .map(inner => reflectionToJtd(inner))
        .filter((item): item is SomeJTDSchemaType => item !== undefined);
      if (members.length === 0) {
        return undefined;
      }
      if (members.length === 1) {
        return members[0]!;
      }
      if (members.every(isPropertiesForm)) {
        return mergePropertiesForms(members);
      }
      return members[0]!;
    }
    case ReflectionKind.promise:
      return reflectionToJtd(reflection.type);
    case ReflectionKind.objectLiteral:
      return objectReflectionToJtd(reflection);
    case ReflectionKind.class: {
      const classType = reflection.classType as { name?: string } | undefined;
      const className = classType?.name;
      switch (className) {
        case "Date":
          return { type: "timestamp" };
        case "RegExp":
          return { type: "string" };
        case "URL":
          return { type: "string" };
        case "Set": {
          const itemType = reflection.arguments?.[0];
          const items = itemType ? reflectionToJtd(itemType) : undefined;

          return { elements: items ?? {} };
        }
        case "Map": {
          const valueType = reflection.arguments?.[1];
          const values = valueType ? reflectionToJtd(valueType) : undefined;

          return { values: values ?? {} };
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
          return { type: "string" };
        case undefined:
        default:
          return objectReflectionToJtd(reflection);
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
function isEnumForm(
  form: SomeJTDSchemaType
): form is { enum: string[]; nullable?: boolean } {
  return Array.isArray((form as { enum?: unknown[] }).enum);
}

/**
 * Tests whether a JTD form is a properties form (object).
 *
 * @param form - The JTD form to inspect.
 * @returns `true` if the form is a JTD properties form.
 */
function isPropertiesForm(form: SomeJTDSchemaType): boolean {
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
function isPureNullable(form: SomeJTDSchemaType): boolean {
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
function mergePropertiesForms(forms: SomeJTDSchemaType[]): SomeJTDSchemaType {
  const merged: {
    properties: Record<string, SomeJTDSchemaType>;
    optionalProperties: Record<string, SomeJTDSchemaType>;
    additionalProperties?: boolean;
  } = {
    properties: {},
    optionalProperties: {}
  };
  for (const form of forms) {
    const p = (form as { properties?: Record<string, SomeJTDSchemaType> })
      .properties;
    const o = (
      form as { optionalProperties?: Record<string, SomeJTDSchemaType> }
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
  const result: SomeJTDSchemaType = {};
  if (hasProperties) {
    (result as { properties: Record<string, SomeJTDSchemaType> }).properties =
      merged.properties;
  } else if (!hasOptional) {
    (result as { properties: Record<string, SomeJTDSchemaType> }).properties =
      {};
  }
  if (hasOptional) {
    (
      result as { optionalProperties: Record<string, SomeJTDSchemaType> }
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
function tryReflectionDiscriminator(
  types: readonly Type[]
): SomeJTDSchemaType | undefined {
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
  const mapping: Record<string, SomeJTDSchemaType> = {};

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
    const body = objectReflectionToJtd(filteredBranch);
    if (!body || !isPropertiesForm(body)) {
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
 * Builds a JTD properties form from a Deepkit class or object literal type.
 *
 * @param type - The class or object literal type whose members should be serialized.
 * @returns A JTD properties form describing the type's members.
 */
export function objectReflectionToJsonSchema<
  T = unknown,
  D extends Record<string, unknown> = Record<string, unknown>
>(type: TypeObjectLiteral | TypeClass): JTDSchemaType<T, D> {
  return objectReflectionToJtd(type) as JTDSchemaType<T, D>;
}

/**
 * Internal worker that produces a JTD properties form (or `values` form for index signatures alone) from a Deepkit object-like type.
 *
 * @param type - The class or object literal type whose members should be serialized.
 * @returns A JTD properties or values form describing the type's members.
 */
function objectReflectionToJtd(
  type: TypeObjectLiteral | TypeClass
): SomeJTDSchemaType {
  const properties: Record<string, SomeJTDSchemaType> = {};
  const optionalProperties: Record<string, SomeJTDSchemaType> = {};
  let indexValueSchema: SomeJTDSchemaType | undefined;
  const description =
    "description" in type && typeof type.description === "string"
      ? type.description
      : undefined;

  for (const member of type.types) {
    if (
      member.kind === ReflectionKind.property ||
      member.kind === ReflectionKind.propertySignature
    ) {
      if (typeof member.name !== "string") {
        continue;
      }
      const propertySchema = reflectionToJtd(member.type);
      if (!propertySchema) {
        continue;
      }
      if (typeof member.description === "string") {
        attachDescription(propertySchema, member.description);
      }
      if (member.optional) {
        optionalProperties[member.name] = propertySchema;
      } else {
        properties[member.name] = propertySchema;
      }
    } else if (member.kind === ReflectionKind.indexSignature) {
      const valueSchema = reflectionToJtd(member.type);
      if (valueSchema) {
        indexValueSchema = valueSchema;
      }
    }
  }

  const hasProperties = Object.keys(properties).length > 0;
  const hasOptional = Object.keys(optionalProperties).length > 0;

  // Open map with no declared properties → JTD values form.
  if (!hasProperties && !hasOptional && indexValueSchema) {
    return attachDescription({ values: indexValueSchema }, description);
  }

  const form: {
    properties?: Record<string, SomeJTDSchemaType>;
    optionalProperties?: Record<string, SomeJTDSchemaType>;
    additionalProperties?: boolean;
  } = {};
  if (hasProperties) {
    form.properties = properties;
  } else if (!hasOptional) {
    form.properties = {};
  }
  if (hasOptional) {
    form.optionalProperties = optionalProperties;
  }
  if (indexValueSchema) {
    form.additionalProperties = true;
  }
  return attachDescription(form as SomeJTDSchemaType, description);
}
