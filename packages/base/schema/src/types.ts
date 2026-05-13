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
import type { JsonSchema7Type } from "@stryke/json";
import type { TypeDefinitionParameter } from "@stryke/types/configuration";
import * as z3 from "zod/v3";

export type SchemaDefinitionVariant =
  | "json-schema"
  | "standard-schema"
  | "zod3"
  | "reflection";

export interface SchemaDefinitionBase {
  schema: JsonSchema7Type;
  variant: SchemaDefinitionVariant;
  input: SchemaDefinitionInput;
}

export interface SchemaDefinitionJsonSchema extends SchemaDefinitionBase {
  schema: JsonSchema7Type;
  variant: "json-schema";
  input: JsonSchema7Type;
}

export interface SchemaDefinitionStandardSchema extends SchemaDefinitionBase {
  schema: JsonSchema7Type;
  variant: "standard-schema";
  input: StandardJSONSchemaV1;
}

export interface SchemaDefinitionZod3 extends SchemaDefinitionBase {
  schema: JsonSchema7Type;
  variant: "zod3";
  input: z3.ZodTypeAny;
}

export interface SchemaDefinitionReflection extends SchemaDefinitionBase {
  schema: JsonSchema7Type;
  variant: "reflection";
  input: Type;
}

export type SchemaDefinition =
  | SchemaDefinitionJsonSchema
  | SchemaDefinitionStandardSchema
  | SchemaDefinitionZod3
  | SchemaDefinitionReflection;

export type SchemaDefinitionInput =
  | SchemaDefinition
  | JsonSchema7Type
  | StandardJSONSchemaV1
  | z3.ZodTypeAny
  | Type;

export type SchemaDefinitionParameter =
  | SchemaDefinitionInput
  | TypeDefinitionParameter;
