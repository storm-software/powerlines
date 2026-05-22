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

import type { Type } from "@powerlines/deepkit/vendor/type";
import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import type { TypeDefinition } from "@stryke/types/configuration";
import type { FormatName } from "ajv-formats/dist/formats";
import type { InputObject, Schema as _Schema } from "untyped";
import type { BaseIssue, BaseSchema } from "valibot";
import * as z3 from "zod/v3";

export type UntypedInputObject = InputObject;
export type UntypedSchema = _Schema;

export type ValibotSchema<
  TInput = unknown,
  TOutput = unknown,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>
> = BaseSchema<TInput, TOutput, TIssue>;

/**
 * JSON Schema primitive type names used by {@link stringifyType}.
 */
export type JsonSchemaPrimitiveType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "null"
  | "object"
  | "array";

type StrictNullChecksWrapper<Name extends string, Type> = undefined extends null
  ? `strictNullChecks must be true in tsconfig to use ${Name}`
  : Type;

type UnionToIntersection<U> = (U extends any ? (_: U) => void : never) extends (
  _: infer I
) => void
  ? I
  : never;

/**
 * A JSON Schema type that is compatible with all the JSON schema variants, and includes additional Powerlines-specific metadata properties. This type is designed to be flexible and accommodate various schema shapes while still providing the ability to include metadata for documentation or other purposes. The presence of the metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchemaLike = UncheckedJsonSchemaType<Known, true> &
  SchemaMetadata;

type UncheckedPartialSchema<T> = Partial<UncheckedJsonSchemaType<T, true>>;

export type JsonType<
  T extends string,
  IsPartial extends boolean
> = IsPartial extends true ? T | undefined : T;

export type NumberFormat =
  | "int32"
  | "float"
  | "double"
  | "int8"
  | "uint8"
  | "int16"
  | "uint16"
  | "int64"
  | "uint64";

export interface NumberKeywords {
  /** The inclusive lower bound allowed for numeric values. */
  minimum?: number;

  /** The inclusive upper bound allowed for numeric values. */
  maximum?: number;

  /** The exclusive lower bound allowed for numeric values. */
  exclusiveMinimum?: number;

  /** The exclusive upper bound allowed for numeric values. */
  exclusiveMaximum?: number;

  /** The numeric increment that values must be a multiple of. */
  multipleOf?: number;

  /** The numeric format hint recognized by compatible validators. */
  format?: NumberFormat | string;
}

export interface StringKeywords {
  /** The minimum number of characters allowed in the string. */
  minLength?: number;

  /** The maximum number of characters allowed in the string. */
  maxLength?: number;

  /** A regular expression that matching strings must satisfy. */
  pattern?: string;

  /**
   * A format for the schema, which can be used by validation libraries or other tools that support this feature to provide additional validation or formatting rules for the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   *
   * @see https://ajv.js.org/packages/ajv-formats.html
   *
   * @remarks
   * The `format` property is a string that specifies the format of the data that the schema represents. It can be used to indicate that a string should be validated as an email address, a date-time, a URI, or any other format supported by compatible validation libraries. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  format?: FormatName | string;
}

type Known =
  | {
      [key: string]: Known;
    }
  | [Known, ...Known[]]
  | Known[]
  | number
  | string
  | boolean
  | null;

type UncheckedPropertiesSchema<T> = {
  [K in keyof T]-?:
    | (UncheckedJsonSchemaType<T[K], false> & JsonSchemaNullable<T[K]>)
    | {
        $ref: string;
      };
};

type UncheckedRequiredMembers<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

export type JsonSchemaNullable<T> = undefined extends T
  ? {
      /** Indicates that the value may be null in addition to the declared type. */
      nullable: true;

      /** A constant value constrained to null when the schema is nullable. */
      const?: null;

      /** Allowed values, including null when the schema is nullable. */
      enum?: readonly (T | null)[];

      /** The default value to use when none is provided. */
      default?: T | null;
    }
  : {
      /** Indicates whether the value may be null. */
      nullable?: false;

      /** A constant value allowed by the schema. */
      const?: T;

      /** The set of values allowed by the schema. */
      enum?: readonly T[];

      /** The default value to use when none is provided. */
      default?: T;
    };

type UncheckedJsonSchemaType<T, IsPartial extends boolean> = (
  | {
      anyOf: readonly UncheckedJsonSchemaType<T, IsPartial>[];
    }
  | {
      oneOf: readonly UncheckedJsonSchemaType<T, IsPartial>[];
    }
  | ({
      type: readonly (T extends number
        ? JsonType<"number" | "integer", IsPartial>
        : T extends string
          ? JsonType<"string", IsPartial>
          : T extends boolean
            ? JsonType<"boolean", IsPartial>
            : never)[];
    } & UnionToIntersection<
      T extends number
        ? NumberKeywords
        : T extends string
          ? StringKeywords
          : T extends boolean
            ? // eslint-disable-next-line ts/no-empty-object-type
              {}
            : never
    >)
  | ((T extends number
      ? {
          type: JsonType<"number" | "integer", IsPartial>;
        } & NumberKeywords
      : T extends string
        ? {
            type: JsonType<"string", IsPartial>;
          } & StringKeywords
        : T extends boolean
          ? {
              type: JsonType<"boolean", IsPartial>;
            }
          : T extends readonly [any, ...any[]]
            ? {
                type: JsonType<"array", IsPartial>;

                /** The tuple items in order. */
                items: {
                  readonly [K in keyof T]-?: UncheckedJsonSchemaType<
                    T[K],
                    false
                  > &
                    JsonSchemaNullable<T[K]>;
                } & {
                  length: T["length"];
                };

                /** The minimum number of items allowed in the tuple. */
                minItems: T["length"];
              } & (
                | {
                    /** The maximum number of items allowed in the tuple. */
                    maxItems: T["length"];
                  }
                | {
                    /** Disallows items beyond the tuple length. */
                    additionalItems: false;
                  }
              )
            : T extends readonly any[]
              ? {
                  type: JsonType<"array", IsPartial>;

                  /** The schema that each array item must satisfy. */
                  items: UncheckedJsonSchemaType<T[0], false>;

                  /** A schema that at least one array item must satisfy. */
                  contains?: UncheckedPartialSchema<T[0]>;

                  /** The minimum number of items allowed in the array. */
                  minItems?: number;

                  /** The maximum number of items allowed in the array. */
                  maxItems?: number;

                  /** The minimum number of matching items required by {@link contains}. */
                  minContains?: number;

                  /** The maximum number of matching items allowed by {@link contains}. */
                  maxContains?: number;

                  /** Indicates that array items must be unique. */
                  uniqueItems?: true;

                  /** Additional tuple items are not permitted in this schema shape. */
                  additionalItems?: never;
                }
              : T extends Record<string, any>
                ? {
                    type: JsonType<"object", IsPartial>;

                    /** The schema for properties not matched by {@link properties} or {@link patternProperties}. */
                    additionalProperties?:
                      | boolean
                      | UncheckedJsonSchemaType<T[string], false>;

                    /** The schema for properties not yet evaluated by other object keywords. */
                    unevaluatedProperties?:
                      | boolean
                      | UncheckedJsonSchemaType<T[string], false>;

                    /** The declared object properties and their schemas. */
                    properties?: IsPartial extends true
                      ? Partial<UncheckedPropertiesSchema<T>>
                      : UncheckedPropertiesSchema<T>;

                    /** The schemas for properties whose names match the given patterns. */
                    patternProperties?: Record<
                      string,
                      UncheckedJsonSchemaType<T[string], false>
                    >;

                    /** The schema that each property name must satisfy. */
                    propertyNames?: Omit<
                      UncheckedJsonSchemaType<string, false>,
                      "type"
                    > & {
                      type?: "string";
                    };

                    /** A map of property-specific dependency requirements. */
                    dependencies?: {
                      [K in keyof T]?:
                        | readonly (keyof T)[]
                        | UncheckedPartialSchema<T>;
                    };

                    /** Properties that become required when the key property is present. */
                    dependentRequired?: {
                      [K in keyof T]?: readonly (keyof T)[];
                    };

                    /** Subschemas that apply when the key property is present. */
                    dependentSchemas?: {
                      [K in keyof T]?: UncheckedPartialSchema<T>;
                    };

                    /** The minimum number of own properties allowed. */
                    minProperties?: number;

                    /** The maximum number of own properties allowed. */
                    maxProperties?: number;

                    /**
                     * An optional array of property names that are considered primary keys for the object. This property can be used by validation libraries or other tools that support this feature to provide additional validation rules or constraints for the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
                     */
                    primaryKey?: (keyof T)[];

                    /**
                     * A name for the database schema associated with the data represented by this schema. This property can be used by documentation tools or other libraries that support this feature to provide additional context or information about the data model that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
                     */
                    databaseSchemaName?: string;
                  } & (IsPartial extends true
                    ? {
                        /** The set of required property names for partial schemas. */
                        required: readonly (keyof T)[];
                      }
                    : [UncheckedRequiredMembers<T>] extends [never]
                      ? {
                          /** The set of required property names when none are statically required. */
                          required?: readonly UncheckedRequiredMembers<T>[];
                        }
                      : {
                          /** The set of required property names for the object. */
                          required: readonly UncheckedRequiredMembers<T>[];
                        })
                : T extends null
                  ? {
                      /** The JSON Schema null type. */
                      type: JsonType<"null", IsPartial>;

                      /** Indicates that only null is allowed. */
                      nullable: true;
                    }
                  : never) & {
      /** A set of schemas where the data must satisfy all members. */
      allOf?: readonly UncheckedPartialSchema<T>[];

      /** A set of schemas where the data must satisfy at least one member. */
      anyOf?: readonly UncheckedPartialSchema<T>[];

      /** A set of schemas where the data must satisfy exactly one member. */
      oneOf?: readonly UncheckedPartialSchema<T>[];

      /** A schema that the data must not satisfy. */
      if?: UncheckedPartialSchema<T>;

      /** A schema applied when {@link if} matches. */
      then?: UncheckedPartialSchema<T>;

      /** A schema applied when {@link if} does not match. */
      else?: UncheckedPartialSchema<T>;

      /** A schema that must not match the data. */
      not?: UncheckedPartialSchema<T>;
    })
) & {
  /**
   * A unique identifier for the schema, which can be used to reference or identify the schema in various contexts. This property is part of the JSON Schema specification and does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  $id?: string;

  /**
   * A reference to another schema definition, which can be used to reuse or reference schema definitions in other parts of the document or external schemas. This property is part of the JSON Schema specification and does not affect the validation behavior of the schema itself, but it can be used to create modular and reusable schema structures.
   */
  $ref?: string;

  /**
   * A comment or annotation for the schema, which can be used to provide additional context or information about the schema. This property is part of the JSON Schema specification and does not affect the validation behavior of the schema itself, but it can be used by documentation tools or other libraries that support this feature.
   */
  $comment?: string;

  /**
   * A record of schema definitions that can be referenced throughout the schema using {@link UncheckedJsonSchemaType.$ref}. This property can be used to define reusable schema components and reduce redundancy in schema definitions. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  $defs?: Record<string, UncheckedJsonSchemaType<Known, true>>;

  /**
   * A name for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  name?: string;

  /**
   * A unique identifier for the schema, which can be used to reference or identify the schema in various contexts. This property is part of the JSON Schema specification and does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   *
   * @remarks
   * This property is a legacy version of {@link UncheckedJsonSchemaType.$id} and is maintained for backward compatibility with earlier versions of the JSON Schema specification. The presence of this property does not affect the validation behavior of the schema itself, but it can be used to reference or identify the schema in various contexts when used in conjunction with compatible tools.
   *
   * @deprecated Use {@link UncheckedJsonSchemaType.$id} instead.
   */
  id?: string;

  /**
   * A record of schema definitions that can be referenced throughout the schema using {@link UncheckedJsonSchemaType.$ref}. This property is a legacy version of {@link UncheckedJsonSchemaType.$defs} and is maintained for backward compatibility with earlier versions of the JSON Schema specification. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   *
   * @deprecated Use {@link UncheckedJsonSchemaType.$defs} instead.
   */
  definitions?: Record<string, UncheckedJsonSchemaType<Known, true>>;

  [keyword: string]: any;
};

export interface SchemaMetadata {
  /**
   * A title for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  title?: string;

  /**
   * A description for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable explanation or summary of the schema's purpose and usage. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  description?: string;

  /**
   * A URL to external documentation for the schema, which can be used by documentation tools or other libraries that support this feature to provide additional information or resources related to the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  docs?: string;

  /**
   * An array of example values that conform to the schema. This property can be used to provide sample data for documentation purposes or to assist developers in understanding the expected structure and content of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  examples?: unknown[];

  /**
   * An array of strings or an alias reference to indicate that the field is an alias for one or more other fields.
   */
  alias?: string[];

  /**
   * An array of strings indicating groups that the schema belongs to. This property can be used for organizational or categorization purposes in documentation tools or other libraries that support this feature. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  tags?: string[];

  /**
   * An indicator specifying if the field is deprecated or not. This property can be used by documentation tools or other libraries that support this feature to provide additional information or warnings about the usage of the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  deprecated?: boolean;

  /**
   * An indicator specifying if the field should be marked as hidden or not. This property can be used by documentation tools or other libraries that support this feature to provide additional information or warnings about the usage of the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  hidden?: boolean;

  /**
   * An indicator specifying if the field should be ignored or not. This property can be used by documentation tools or other libraries that support this feature to provide additional information or warnings about the usage of the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  ignore?: boolean;

  /**
   * An indicator specifying if the field is internal or not.
   *
   * @internal
   */
  internal?: boolean;

  /**
   * An indicator specifying if the field should only be populated at runtime or not.
   */
  runtime?: boolean;

  /**
   * An indicator specifying if the field is read-only or not.
   */
  readOnly?: boolean;

  /**
   * An indicator specifying if the field is write-only or not. This property can be used by documentation tools or other libraries that support this feature to provide additional information or warnings about the usage of the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  writeOnly?: boolean;

  /**
   * The content media type for the schema, which can be used by documentation tools or other libraries that support this feature to provide additional information about the expected content type of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  contentMediaType?: string;

  /**
   * The content encoding for the schema, which can be used by documentation tools or other libraries that support this feature to provide additional information about the expected encoding of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  contentEncoding?: string;

  /**
   * The content schema for the schema, which can be used by documentation tools or other libraries that support this feature to provide additional information about the expected structure of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  contentSchema?: string;
}

export type JsonSchemaProperty<
  T extends Record<string, any> = Record<string, any>,
  TName extends keyof T & string = keyof T & string
> = JsonSchema<T[TName]> & {
  /** The property name within the parent object schema. */
  name: TName;

  /**
   * An indicator specifying if the field is nullable or not. If `true`, the field can accept `null` as a valid value. This property can be used by validation libraries or other tools that support this feature to provide additional validation rules for the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  nullable: boolean;
};

/**
 * A JSON Schema type that includes additional Powerlines-specific metadata properties. This type extends the standard JSON Schema definition with optional properties such as `name`, `title`, `description`, `default`, `examples`, `groups`, `visibility`, and various flags for controlling how the schema is treated by documentation tools or other libraries that support these features. The presence of these metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchema<T = unknown> = StrictNullChecksWrapper<
  "JsonSchema",
  UncheckedJsonSchemaType<T, false>
> &
  SchemaMetadata;

/**
 * A JSON Schema object type that includes a `type` property set to "object", a `properties` object defining the properties of the schema, and optional metadata properties. This type is used to represent JSON Schema definitions for objects, and it extends the standard JSON Schema definition with additional Powerlines-specific metadata properties. The presence of these metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchemaObject<
  T extends Record<string, any> = Record<string, any>
> = Omit<JsonSchemaLike, "type" | "properties" | "required"> & {
  /** The JSON Schema object type discriminator. */
  type: "object";

  /** The object properties mapped to their schema definitions. */
  properties: Record<string, JsonSchemaProperty<T>>;

  /** The property names that are required on the object. */
  required?: string[];
} & SchemaMetadata;

export type SchemaSourceVariant =
  | "standard-schema"
  | "json-schema"
  | "zod3"
  | "untyped"
  | "valibot"
  | "reflection";

export type SchemaInputVariant = SchemaSourceVariant | "type-definition";

export type SchemaSourceInput<T = unknown> =
  | StandardJSONSchemaV1
  | JsonSchema<T>
  | z3.ZodTypeAny
  | UntypedInputObject
  | UntypedSchema
  | ValibotSchema
  | Type;

export type TypeDefinitionReference = TypeDefinition | string;

export type SchemaInput<T = unknown> =
  | SchemaSourceInput<T>
  | Schema<T>
  | TypeDefinitionReference;

/**
 * A schema extracted from a source input, normalized to JSON Schema.
 */
export interface Schema<T = unknown> {
  /** A stable content hash for the normalized schema. */
  hash: string;

  /** The source variant used to derive the normalized {@link JsonSchema}. */
  variant: SchemaInputVariant;

  /** The normalized schema definition. */
  schema: JsonSchema<T>;
}

export interface BaseSchemaSource<T = unknown> {
  /** A stable content hash for the original source schema. */
  hash: string;

  /** The specific source format used for the schema input. */
  variant: SchemaSourceVariant;

  /** The original schema input captured before normalization. */
  schema: SchemaSourceInput<T>;
}

export interface JsonSchemaSchemaSource<
  T = unknown
> extends BaseSchemaSource<T> {
  /** Indicates the source input already uses JSON Schema syntax. */
  variant: "json-schema";

  /** The original JSON Schema document. */
  schema: JsonSchema<T>;
}

export interface StandardSchemaSchemaSource extends BaseSchemaSource {
  /** Indicates the source input follows the Standard Schema format. */
  variant: "standard-schema";

  /** The original Standard Schema document. */
  schema: StandardJSONSchemaV1;
}

export interface Zod3SchemaSource extends BaseSchemaSource {
  /** Indicates the source input is a Zod v3 schema. */
  variant: "zod3";

  /** The original Zod v3 schema instance. */
  schema: z3.ZodTypeAny;
}

export interface ReflectionSchemaSource extends BaseSchemaSource {
  /** Indicates the source input is a Deepkit reflection {@link Type}. */
  variant: "reflection";

  /** The original Deepkit reflection type. */
  schema: Type;
}

export interface UntypedSchemaSource extends BaseSchemaSource {
  /** Indicates the source input comes from the Untyped schema model. */
  variant: "untyped";

  /** The original Untyped schema input. */
  schema: UntypedInputObject | UntypedSchema;
}

export interface ValibotSchemaSource extends BaseSchemaSource {
  /** Indicates the source input comes from the Valibot schema model. */
  variant: "valibot";

  /** The original Valibot schema input. */
  schema: ValibotSchema;
}

export type SchemaSource =
  | JsonSchemaSchemaSource
  | StandardSchemaSchemaSource
  | Zod3SchemaSource
  | UntypedSchemaSource
  | ValibotSchemaSource
  | ReflectionSchemaSource;

export interface ExtractedSchema<T = unknown> extends Schema<T> {
  /** The schema source that produced this normalized schema. */
  source: SchemaSource;
}
