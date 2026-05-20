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

import { Type } from "@powerlines/deepkit/vendor/type";
import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import type { TypeDefinition } from "@stryke/types/configuration";
import { FormatName } from "ajv-formats/dist/formats";
import { InputObject, Schema as _Schema } from "untyped";
import * as z3 from "zod/v3";

export type UntypedInputObject = InputObject;
export type UntypedSchema = _Schema;

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
export type JsonSchemaLike = UncheckedJSONSchemaType<Known, true> &
  SchemaMetadata;

type UncheckedPartialSchema<T> = Partial<UncheckedJSONSchemaType<T, true>>;

type JSONType<
  T extends string,
  IsPartial extends boolean
> = IsPartial extends true ? T | undefined : T;

interface NumberKeywords {
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  format?: string;
}

interface StringKeywords {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
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
    | (UncheckedJSONSchemaType<T[K], false> & Nullable<T[K]>)
    | {
        $ref: string;
      };
};

type UncheckedRequiredMembers<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

type Nullable<T> = undefined extends T
  ? {
      nullable: true;
      const?: null;
      enum?: readonly (T | null)[];
      default?: T | null;
    }
  : {
      nullable?: false;
      const?: T;
      enum?: readonly T[];
      default?: T;
    };

type UncheckedJSONSchemaType<T, IsPartial extends boolean> = (
  | {
      anyOf: readonly UncheckedJSONSchemaType<T, IsPartial>[];
    }
  | {
      oneOf: readonly UncheckedJSONSchemaType<T, IsPartial>[];
    }
  | ({
      type: readonly (T extends number
        ? JSONType<"number" | "integer", IsPartial>
        : T extends string
          ? JSONType<"string", IsPartial>
          : T extends boolean
            ? JSONType<"boolean", IsPartial>
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
          type: JSONType<"number" | "integer", IsPartial>;
        } & NumberKeywords
      : T extends string
        ? {
            type: JSONType<"string", IsPartial>;

            /**
             * A format for the schema, which can be used by validation libraries or other tools that support this feature to provide additional validation or formatting rules for the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
             *
             * @see https://ajv.js.org/packages/ajv-formats.html
             *
             * @remarks
             * The `format` property is a string that specifies the format of the data that the schema represents. It can be used to indicate that a string should be validated as an email address, a date-time, a URI, or any other format supported by compatible validation libraries. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
             */
            format?: FormatName;
          } & StringKeywords
        : T extends boolean
          ? {
              type: JSONType<"boolean", IsPartial>;
            }
          : T extends readonly [any, ...any[]]
            ? {
                type: JSONType<"array", IsPartial>;
                items: {
                  readonly [K in keyof T]-?: UncheckedJSONSchemaType<
                    T[K],
                    false
                  > &
                    Nullable<T[K]>;
                } & {
                  length: T["length"];
                };
                minItems: T["length"];
              } & (
                | {
                    maxItems: T["length"];
                  }
                | {
                    additionalItems: false;
                  }
              )
            : T extends readonly any[]
              ? {
                  type: JSONType<"array", IsPartial>;
                  items: UncheckedJSONSchemaType<T[0], false>;
                  contains?: UncheckedPartialSchema<T[0]>;
                  minItems?: number;
                  maxItems?: number;
                  minContains?: number;
                  maxContains?: number;
                  uniqueItems?: true;
                  additionalItems?: never;
                }
              : T extends Record<string, any>
                ? {
                    type: JSONType<"object", IsPartial>;
                    additionalProperties?:
                      | boolean
                      | UncheckedJSONSchemaType<T[string], false>;
                    unevaluatedProperties?:
                      | boolean
                      | UncheckedJSONSchemaType<T[string], false>;
                    properties?: IsPartial extends true
                      ? Partial<UncheckedPropertiesSchema<T>>
                      : UncheckedPropertiesSchema<T>;
                    patternProperties?: Record<
                      string,
                      UncheckedJSONSchemaType<T[string], false>
                    >;
                    propertyNames?: Omit<
                      UncheckedJSONSchemaType<string, false>,
                      "type"
                    > & {
                      type?: "string";

                      /**
                       * A format for the schema, which can be used by validation libraries or other tools that support this feature to provide additional validation or formatting rules for the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
                       *
                       * @see https://ajv.js.org/packages/ajv-formats.html
                       *
                       * @remarks
                       * The `format` property is a string that specifies the format of the data that the schema represents. It can be used to indicate that a string should be validated as an email address, a date-time, a URI, or any other format supported by compatible validation libraries. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
                       */
                      format?: FormatName;
                    };
                    dependencies?: {
                      [K in keyof T]?:
                        | readonly (keyof T)[]
                        | UncheckedPartialSchema<T>;
                    };
                    dependentRequired?: {
                      [K in keyof T]?: readonly (keyof T)[];
                    };
                    dependentSchemas?: {
                      [K in keyof T]?: UncheckedPartialSchema<T>;
                    };
                    minProperties?: number;
                    maxProperties?: number;
                  } & (IsPartial extends true
                    ? {
                        required: readonly (keyof T)[];
                      }
                    : [UncheckedRequiredMembers<T>] extends [never]
                      ? {
                          required?: readonly UncheckedRequiredMembers<T>[];
                        }
                      : {
                          required: readonly UncheckedRequiredMembers<T>[];
                        })
                : T extends null
                  ? {
                      type: JSONType<"null", IsPartial>;
                      nullable: true;
                    }
                  : never) & {
      allOf?: readonly UncheckedPartialSchema<T>[];
      anyOf?: readonly UncheckedPartialSchema<T>[];
      oneOf?: readonly UncheckedPartialSchema<T>[];
      if?: UncheckedPartialSchema<T>;
      then?: UncheckedPartialSchema<T>;
      else?: UncheckedPartialSchema<T>;
      not?: UncheckedPartialSchema<T>;
    })
) & {
  [keyword: string]: any;
  $id?: string;
  $ref?: string;
  $defs?: Record<string, UncheckedJSONSchemaType<Known, true>>;
  definitions?: Record<string, UncheckedJSONSchemaType<Known, true>>;
};

export interface SchemaMetadata {
  /**
   * A name for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  name?: string;

  /**
   * A title for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable name or description for the schema. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  title?: string;

  /**
   * A description for the schema, which can be used by documentation tools or other libraries that support this feature to provide a human-readable explanation or summary of the schema's purpose and usage. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  description?: string;

  /**
   * A default value for the schema, which can be used by validation libraries or other tools that support this feature. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  default?: unknown;

  /**
   * An array of example values that conform to the schema. This property can be used to provide sample data for documentation purposes or to assist developers in understanding the expected structure and content of the data that the schema represents. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the expected data when used in conjunction with compatible tools.
   */
  examples?: unknown[];

  /**
   * An array of strings indicating groups that the schema belongs to. This property can be used for organizational or categorization purposes in documentation tools or other libraries that support this feature. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  groups?: string[];

  /**
   * A visibility level for the schema, which can be used by documentation tools or other libraries that support this feature to determine how the schema should be presented or accessed. The presence of this property does not affect the validation behavior of the schema itself, but it can provide additional context or information about the schema when used in conjunction with compatible tools.
   */
  visibility?: "public" | "protected" | "private";

  /**
   * An indicator specifying if the field should be marked as hidden or not.
   */
  isHidden?: boolean;

  /**
   * An indicator specifying if the field should be ignored or not.
   */
  isIgnored?: boolean;

  /**
   * An indicator specifying if the field is internal or not.
   *
   * @internal
   */
  isInternal?: boolean;

  /**
   * An indicator specifying if the field should only be populated at runtime or not.
   */
  isRuntime?: boolean;

  /**
   * An indicator specifying if the field is read-only or not.
   */
  isReadonly?: boolean;

  /**
   * An indicator specifying if the field is a primary key or not.
   */
  isPrimaryKey?: boolean;

  /**
   * An array of strings or an alias reference to indicate that the field is an alias for one or more other fields.
   */
  alias?: string[];
}

export type JsonSchemaProperty<
  T extends Record<string, any> = Record<string, any>,
  TName extends string = string
> = JsonSchemaObject<T[TName]> & {
  name: TName;
  nullable: boolean;
};

/**
 * A JSON Schema type that includes additional Powerlines-specific metadata properties. This type extends the standard JSON Schema definition with optional properties such as `name`, `title`, `description`, `default`, `examples`, `groups`, `visibility`, and various flags for controlling how the schema is treated by documentation tools or other libraries that support these features. The presence of these metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchema<T = unknown> = StrictNullChecksWrapper<
  "JsonSchema",
  UncheckedJSONSchemaType<T, false>
> &
  SchemaMetadata;

/**
 * A JSON Schema object type that includes a `type` property set to "object", a `properties` object defining the properties of the schema, and optional metadata properties. This type is used to represent JSON Schema definitions for objects, and it extends the standard JSON Schema definition with additional Powerlines-specific metadata properties. The presence of these metadata properties does not affect the validation behavior of the schema itself, but they can provide additional context or information about the schema when used in conjunction with compatible tools.
 */
export type JsonSchemaObject<
  T extends Record<string, any> = Record<string, any>
> = Omit<JsonSchemaLike, "type" | "properties" | "required"> & {
  type: "object";
  properties: Record<string, JsonSchemaProperty<T>>;
  required?: string[];
} & SchemaMetadata;

export type SchemaSourceVariant =
  | "standard-schema"
  | "json-schema"
  | "zod3"
  | "untyped"
  | "reflection";

export type SchemaInputVariant = SchemaSourceVariant | "type-definition";

export type SchemaSourceInput<T = unknown> =
  | StandardJSONSchemaV1
  | JsonSchema<T>
  | z3.ZodTypeAny
  | UntypedInputObject
  | UntypedSchema
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
  hash: string;
  variant: SchemaInputVariant;
  schema: JsonSchema<T>;
}

export interface BaseSchemaSource {
  hash: string;
  variant: SchemaSourceVariant;
  schema: SchemaSourceInput;
}

export interface JsonSchemaSchemaSource<
  TMetadata extends SchemaMetadata = SchemaMetadata
> extends BaseSchemaSource {
  variant: "json-schema";
  schema: JsonSchema<TMetadata>;
}

export interface StandardSchemaSchemaSource extends BaseSchemaSource {
  variant: "standard-schema";
  schema: StandardJSONSchemaV1;
}

export interface Zod3SchemaSource extends BaseSchemaSource {
  variant: "zod3";
  schema: z3.ZodTypeAny;
}

export interface ReflectionSchemaSource extends BaseSchemaSource {
  variant: "reflection";
  schema: Type;
}

export interface UntypedSchemaSource extends BaseSchemaSource {
  variant: "untyped";
  schema: UntypedInputObject | UntypedSchema;
}

export type SchemaSource =
  | JsonSchemaSchemaSource
  | StandardSchemaSchemaSource
  | Zod3SchemaSource
  | UntypedSchemaSource
  | ReflectionSchemaSource;

export interface ExtractedSchema<T = unknown> extends Schema<T> {
  source: SchemaSource;
}
