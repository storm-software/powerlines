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

import type { Context } from "@powerlines/core";
import { isFileReference } from "@powerlines/core";
import { esbuildPlugin } from "@powerlines/deepkit/esbuild-plugin";
import { isType, stringifyType, Type } from "@powerlines/deepkit/vendor/type";
import { StandardJSONSchemaV1 } from "@standard-schema/spec";
import { extractFileReference } from "@stryke/convert/extract-file-reference";
import { murmurhash } from "@stryke/hash";
import { deepClone } from "@stryke/helpers/deep-clone";
import { isStandardJsonSchema } from "@stryke/json";
import { findFileExtensionSafe } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
import { list } from "@stryke/string-format/list";
import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { FileReferenceInput } from "@stryke/types";
import {
  extractJsonSchema as extractJsonSchemaZod,
  isZod3Type
} from "@stryke/zod";
import { toJsonSchema } from "@valibot/to-json-schema";
import defu from "defu";
import * as z3 from "zod/v3";
import { BundleOptions } from "./bundle";
import { VALID_SOURCE_FILE_EXTENSIONS } from "./constants";
import { getCacheDirectory, writeSchema } from "./persistence";
import { reflectionToJsonSchema } from "./reflection";
import { resolve } from "./resolve";
import {
  isJsonSchema,
  isJsonSchemaObject,
  isSchema,
  isSchemaWithSource,
  isUntypedInput,
  isUntypedInputStrict,
  isUntypedSchema,
  isUntypedSchemaStrict,
  isValibotSchema
} from "./type-checks";
import {
  ExtractedSchema,
  JsonSchema,
  Schema,
  SchemaInput,
  SchemaInputVariant,
  SchemaSource,
  SchemaSourceInput,
  SchemaSourceVariant,
  UntypedInputObject,
  UntypedSchema,
  ValibotSchema
} from "./types";

const SCHEMA_BUNDLE_BASE_URI = "https://powerlines.invalid/";

function normalizeUri(uri: string): string {
  return uri.endsWith("#") ? uri.slice(0, -1) : uri;
}

function stripUriFragment(uri: string): string {
  const hashIndex = uri.indexOf("#");

  return hashIndex >= 0 ? uri.slice(0, hashIndex) : uri;
}

function escapeJsonPointerToken(token: string): string {
  return token.replaceAll("~", "~0").replaceAll("/", "~1");
}

function toJsonPointer(path: string[]): string {
  if (path.length === 0) {
    return "";
  }

  return `/${path.map(segment => escapeJsonPointerToken(segment)).join("/")}`;
}

function resolveUri(reference: string, baseUri: string): string {
  try {
    return normalizeUri(new URL(reference, baseUri).toString());
  } catch {
    return normalizeUri(reference);
  }
}

function collectReferenceTargets(
  value: unknown,
  path: string[],
  baseUri: string,
  uriToPointer: Map<string, string>,
  dynamicUriToFragment: Map<string, string>
): void {
  if (!isSetObject(value)) {
    return;
  }

  const schema = value as Record<string, unknown>;
  const pointer = toJsonPointer(path);

  const currentBaseUri = isSetString(schema.$id)
    ? resolveUri(schema.$id, baseUri)
    : baseUri;

  const currentDocumentUri = stripUriFragment(currentBaseUri);

  uriToPointer.set(currentBaseUri, pointer);
  uriToPointer.set(currentDocumentUri, pointer);

  if (isSetString(schema.$anchor)) {
    uriToPointer.set(`${currentDocumentUri}#${schema.$anchor}`, pointer);
  }

  if (isSetString(schema.$dynamicAnchor)) {
    const dynamicTarget = `${currentDocumentUri}#${schema.$dynamicAnchor}`;
    uriToPointer.set(dynamicTarget, pointer);
    dynamicUriToFragment.set(dynamicTarget, `#${schema.$dynamicAnchor}`);
  }

  for (const [key, child] of Object.entries(schema)) {
    if (Array.isArray(child)) {
      child.forEach((entry, index) => {
        collectReferenceTargets(
          entry,
          [...path, key, String(index)],
          currentBaseUri,
          uriToPointer,
          dynamicUriToFragment
        );
      });
      continue;
    }

    collectReferenceTargets(
      child,
      [...path, key],
      currentBaseUri,
      uriToPointer,
      dynamicUriToFragment
    );
  }
}

function rewriteReferenceTargets(
  value: unknown,
  path: string[],
  baseUri: string,
  uriToPointer: Map<string, string>,
  dynamicUriToFragment: Map<string, string>
): void {
  if (!isSetObject(value)) {
    return;
  }

  const schema = value as Record<string, unknown>;

  const currentBaseUri = isSetString(schema.$id)
    ? resolveUri(schema.$id, baseUri)
    : baseUri;

  if (isSetString(schema.$ref)) {
    const resolvedRefUri = resolveUri(schema.$ref, currentBaseUri);
    const pointer =
      uriToPointer.get(resolvedRefUri) ??
      uriToPointer.get(stripUriFragment(resolvedRefUri));

    if (pointer !== undefined) {
      schema.$ref = pointer.length > 0 ? `#${pointer}` : "#";
    }
  }

  if (isSetString(schema.$dynamicRef)) {
    const resolvedDynamicRefUri = resolveUri(
      schema.$dynamicRef,
      currentBaseUri
    );
    const dynamicFragment = dynamicUriToFragment.get(resolvedDynamicRefUri);

    if (dynamicFragment) {
      schema.$dynamicRef = dynamicFragment;
    } else {
      const pointer =
        uriToPointer.get(resolvedDynamicRefUri) ??
        uriToPointer.get(stripUriFragment(resolvedDynamicRefUri));

      if (pointer !== undefined) {
        schema.$dynamicRef = pointer.length > 0 ? `#${pointer}` : "#";
      }
    }
  }

  for (const [key, child] of Object.entries(schema)) {
    if (Array.isArray(child)) {
      child.forEach((entry, index) => {
        rewriteReferenceTargets(
          entry,
          [...path, key, String(index)],
          currentBaseUri,
          uriToPointer,
          dynamicUriToFragment
        );
      });
      continue;
    }

    rewriteReferenceTargets(
      child,
      [...path, key],
      currentBaseUri,
      uriToPointer,
      dynamicUriToFragment
    );
  }
}

/**
 * Bundles all external references in a JSON Schema into a single schema document by collecting all reference targets and rewriting the references to point to the bundled definitions. This ensures that the resulting schema is self-contained and can be used independently without relying on external documents.
 *
 * @param schema - The JSON Schema to bundle references for.
 * @returns A new JSON Schema with all references bundled and rewritten to point to the bundled definitions.
 */
export function bundleReferences(schema: JsonSchema): JsonSchema {
  if (!isSetObject(schema)) {
    return schema;
  }

  const bundledSchema = deepClone(schema) as Record<string, unknown>;
  const baseUri = isSetString(bundledSchema.$id)
    ? resolveUri(bundledSchema.$id, SCHEMA_BUNDLE_BASE_URI)
    : SCHEMA_BUNDLE_BASE_URI;

  const uriToPointer = new Map<string, string>();
  const dynamicUriToFragment = new Map<string, string>();

  collectReferenceTargets(
    bundledSchema,
    [],
    baseUri,
    uriToPointer,
    dynamicUriToFragment
  );

  rewriteReferenceTargets(
    bundledSchema,
    [],
    baseUri,
    uriToPointer,
    dynamicUriToFragment
  );

  return bundledSchema;
}

function convertNestedUntypedSchema(value: unknown): unknown {
  if (isUntypedSchema(value)) {
    return convertUntypedSchemaToJsonSchema(value);
  }

  if (isSetObject(value)) {
    if (isUntypedInput(value)) {
      return convertUntypedInputToJsonSchema(value);
    }

    const nested = value as Record<string, unknown>;
    if ("$schema" in nested && isUntypedSchema(nested.$schema)) {
      return convertUntypedSchemaToJsonSchema(nested.$schema);
    }
  }

  return value;
}

function convertNestedUntypedSchemaArray(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map(item => convertNestedUntypedSchema(item));
}

function convertValibotSchemaToJsonSchema(schema: unknown): JsonSchema {
  return toJsonSchema(schema as never, {
    target: "draft-2020-12"
  }) as JsonSchema;
}

function convertUntypedSchemaToJsonSchema(
  schema: UntypedSchema | Record<string, unknown>
): JsonSchema {
  const source = schema as Record<string, unknown>;
  const jsonSchema: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    if (
      key === "tsType" ||
      key === "markdownType" ||
      key === "tags" ||
      key === "args" ||
      key === "resolve"
    ) {
      continue;
    }

    if (key === "id" && isSetString(value)) {
      jsonSchema.$id = value;
      continue;
    }

    if (
      key === "properties" ||
      key === "patternProperties" ||
      key === "dependentSchemas" ||
      key === "$defs" ||
      key === "definitions"
    ) {
      if (!isSetObject(value)) {
        jsonSchema[key] = value;
        continue;
      }

      jsonSchema[key] = Object.fromEntries(
        Object.entries(value).map(([propertyKey, propertyValue]) => [
          propertyKey,
          convertNestedUntypedSchema(propertyValue)
        ])
      );
      continue;
    }

    if (
      key === "items" ||
      key === "contains" ||
      key === "if" ||
      key === "then" ||
      key === "else" ||
      key === "not" ||
      key === "propertyNames" ||
      key === "additionalProperties" ||
      key === "unevaluatedProperties"
    ) {
      jsonSchema[key] = convertNestedUntypedSchema(value);
      continue;
    }

    if (key === "oneOf" || key === "anyOf" || key === "allOf") {
      jsonSchema[key] = convertNestedUntypedSchemaArray(value);
      continue;
    }

    jsonSchema[key] = value;
  }

  return jsonSchema;
}

function convertUntypedInputToJsonSchema(
  input: UntypedInputObject
): JsonSchema {
  const inputObject = input as Record<string, unknown>;
  const base = isUntypedSchema(inputObject.$schema)
    ? convertUntypedSchemaToJsonSchema(inputObject.$schema)
    : {};
  const properties: Record<string, JsonSchema> = {};

  for (const [key, value] of Object.entries(inputObject)) {
    if (key.startsWith("$")) {
      continue;
    }

    if (!isSetObject(value)) {
      continue;
    }

    if (isUntypedInput(value)) {
      properties[key] = convertUntypedInputToJsonSchema(value);
      continue;
    }

    const nested = value as Record<string, unknown>;
    if ("$schema" in nested && isUntypedSchema(nested.$schema)) {
      properties[key] = convertUntypedSchemaToJsonSchema(nested.$schema);
      continue;
    }

    if (isUntypedSchema(value)) {
      properties[key] = convertUntypedSchemaToJsonSchema(value);
    }
  }

  if (!isJsonSchemaObject(base)) {
    throw new Error(
      `Failed to convert untyped input to JSON Schema. The base schema must be a valid JSON Schema object.`
    );
  }

  const baseProperties = isSetObject(base.properties) ? base.properties : {};
  const mergedProperties = {
    ...baseProperties,
    ...properties
  };

  return {
    ...base,
    type: base.type ?? "object",
    ...(Object.keys(mergedProperties).length > 0
      ? { properties: mergedProperties }
      : {})
  };
}

/**
 * Creates a hash string for a given schema definition input.
 */
export function extractHash(
  variant: SchemaInputVariant,
  input: SchemaInput
): string {
  if (isSetString(input)) {
    return murmurhash({ variant, input });
  } else if (typeof input === "boolean") {
    return murmurhash({ variant, input });
  } else if (isSetObject(input)) {
    if (isZod3Type(input)) {
      return murmurhash({ variant, input: input._def });
    } else if (isStandardJsonSchema(input)) {
      return murmurhash({ variant, input: input["~standard"] });
    } else if (isJsonSchema(input)) {
      return murmurhash({ variant, input });
    } else if (isValibotSchema(input)) {
      return murmurhash({
        variant,
        input: convertValibotSchemaToJsonSchema(input)
      });
    } else if (isUntypedInput(input)) {
      return murmurhash({
        variant,
        input: convertUntypedInputToJsonSchema(input)
      });
    } else if (isUntypedSchema(input)) {
      return murmurhash({
        variant,
        input: convertUntypedSchemaToJsonSchema(input)
      });
    } else if (isType(input)) {
      return murmurhash({ variant, input: stringifyType(input) });
    }
  }

  throw new Error(
    `Failed to create an input hash for the provided schema definition input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a Valibot BaseSchema, or a reflected Deepkit Type object.`
  );
}

/**
 * Converts a reflected Deepkit {@link Type} into a JSON Schema (draft-2020-12) representation.
 */
export function extractReflection(reflection: Type): JsonSchema | undefined {
  if (!isType(reflection)) {
    return undefined;
  }

  return reflectionToJsonSchema(reflection);
}

/**
 * Extracts a JSON Schema from Zod, Standard Schema, Valibot, untyped, or JSON Schema inputs.
 */
export function extractJsonSchema(schema: unknown): JsonSchema | undefined {
  if (isSetObject(schema)) {
    if (isZod3Type(schema)) {
      return extractJsonSchemaZod(schema, {
        target: "draft-2020-12"
      }) as JsonSchema;
    }
    if (isUntypedInputStrict(schema)) {
      return convertUntypedInputToJsonSchema(schema);
    }
    if (isUntypedSchemaStrict(schema)) {
      return convertUntypedSchemaToJsonSchema(schema);
    }
    if (isStandardJsonSchema(schema)) {
      return schema["~standard"].jsonSchema.input({
        target: "draft-2020-12"
      });
    }
    if (isValibotSchema(schema)) {
      return convertValibotSchemaToJsonSchema(schema);
    }
    if (isJsonSchema(schema)) {
      return schema;
    }
  }

  return undefined;
}

/**
 * Resolves the concrete source variant for a schema source input.
 *
 * @param input - The schema source input to inspect.
 * @returns The resolved schema source variant.
 * @throws Will throw an error when the input cannot be mapped to a supported source variant.
 */
export function extractResolvedVariant(
  input: SchemaSourceInput
): SchemaSourceVariant {
  if (typeof input === "boolean") {
    return "json-schema";
  }

  if (isSetObject(input)) {
    if (isZod3Type(input)) {
      return "zod3";
    } else if (isUntypedInputStrict(input) || isUntypedSchemaStrict(input)) {
      return "untyped";
    } else if (isStandardJsonSchema(input)) {
      return "standard-schema";
    } else if (isJsonSchema(input)) {
      return "json-schema";
    } else if (isValibotSchema(input)) {
      return "valibot";
    } else if (isType(input)) {
      return "reflection";
    }
  }

  throw new Error(
    `Failed to determine the variant of the provided schema definition input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a Valibot BaseSchema, a reflected Deepkit Type object, or an Untyped schema.`
  );
}

/**
 * Determines the top-level input variant for schema extraction.
 *
 * @param input - The schema input to classify.
 * @returns The resolved schema input variant.
 */
export function extractVariant(input: SchemaInput): SchemaInputVariant {
  if (isFileReference(input)) {
    return "file-reference";
  }

  return extractResolvedVariant(input as SchemaSourceInput);
}

/**
 * Extracts and normalizes a JSON Schema from a concrete schema source input.
 *
 * @param input - The schema source input to extract from.
 * @param variant - Optional source variant override. When omitted, the variant is inferred from the input.
 * @returns A promise that resolves to a bundled JSON Schema.
 * @throws Will throw an error if no valid JSON Schema can be extracted from the input.
 */
export async function extractSchema(
  input: SchemaSourceInput,
  variant?: SchemaInputVariant
): Promise<JsonSchema> {
  if (isSchemaWithSource(input)) {
    return input.schema;
  }

  const resolvedVariant = variant ?? extractResolvedVariant(input);

  let schema: JsonSchema | undefined;
  if (
    resolvedVariant === "zod3" ||
    resolvedVariant === "json-schema" ||
    resolvedVariant === "standard-schema" ||
    resolvedVariant === "untyped" ||
    resolvedVariant === "valibot"
  ) {
    schema = extractJsonSchema(input);
  } else if (resolvedVariant === "reflection") {
    schema = extractReflection(input as Type);
  }

  if (schema) {
    return bundleReferences(schema);
  }

  throw new Error(
    `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a Valibot BaseSchema, an untyped schema, or a reflected Deepkit Type object.`
  );
}

/**
 * Builds source metadata for a schema input using a known source variant.
 *
 * @param variant - The schema source variant associated with the input.
 * @param input - The schema source input to wrap.
 * @returns The normalized schema source payload, including the source hash and variant.
 * @throws Will throw an error if the provided variant is unsupported.
 */
export function extractSource(
  variant: SchemaSourceVariant,
  input: SchemaSourceInput
): SchemaSource {
  if (variant === "zod3") {
    return {
      hash: extractHash(variant, input),
      variant: "zod3",
      schema: input as z3.ZodTypeAny
    };
  } else if (variant === "untyped") {
    return {
      hash: extractHash(variant, input),
      variant: "untyped",
      schema: input as UntypedInputObject | UntypedSchema
    };
  } else if (variant === "standard-schema") {
    return {
      hash: extractHash(variant, input),
      variant: "standard-schema",
      schema: input as StandardJSONSchemaV1
    };
  } else if (variant === "json-schema") {
    return {
      hash: extractHash(variant, input),
      variant: "json-schema",
      schema: input as JsonSchema
    };
  } else if (variant === "valibot") {
    return {
      hash: extractHash(variant, input),
      variant: "valibot",
      schema: input as ValibotSchema
    };
  } else if (variant === "reflection") {
    return {
      hash: extractHash(variant, input),
      variant: "reflection",
      schema: input as Type
    };
  }

  throw new Error(
    `Failed to extract source information from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object.`
  );
}

/**
 * Extracts a JSON Schema from a given schema definition input, which can be a Zod schema, a Valibot schema, any Standard JSON Schema type, a plain JSON Schema object, an untyped schema, or a Deepkit Type object. If the input is a type definition reference (e.g. a file path with an export), it will be resolved and bundled using Rolldown to obtain the actual schema definition before extraction.
 *
 * @example
 * ```ts
 * // Resolve a schema definition from a file path
 * const schema1 = await extract(context, "./schemas.ts#MySchema");
 * // Resolve a schema definition from a JSON Schema object
 * const schema2 = await extract(context, schemaObject);
 * // Resolve a schema definition from a Zod schema
 * const schema3 = await extract(context, zodSchema);
 * // Resolve a schema definition from a reflected Deepkit Type object
 * const schema4 = await extract(context, reflectionType);
 * ```
 *
 * @see https://zod.dev/
 * @see https://valibot.dev/
 * @see https://standardschema.dev/json-schema#what-schema-libraries-support-this-spec
 * @see https://json-schema.org/
 * @see https://ajv.js.org/json-type-definition.html
 * @see https://deepkit.io/en/documentation/runtime-types/reflection
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param input - The schema definition input to extract, which can be a Zod schema, a Valibot schema, any Standard JSON Schema type, a plain JSON Schema object, an untyped schema, or a reflected Deepkit Type object. If the input is a string or a type definition reference, it will be resolved and bundled to obtain the actual schema definition before extraction.
 * @param options - Optional overrides for the Rolldown configuration used during extraction. This can include custom plugins, loaders, or other build options to control how the schema definition is resolved and bundled when the input is a type definition reference.
 * @returns A promise that resolves to the extracted and normalized schema as a JSON Schema object. The function will attempt to extract a valid JSON Schema from the provided input, and if successful, it will return the schema. If the extraction process fails or if the input is not a valid schema definition, it will throw an error indicating the failure.
 */
export async function extractSchemaWithSource(
  context: Context,
  input: SchemaInput,
  options: BundleOptions = {}
): Promise<ExtractedSchema> {
  if (isSchemaWithSource(input)) {
    return input;
  }

  if (isSchema(input)) {
    return {
      ...input,
      source: {
        hash: extractHash("json-schema", input.schema),
        variant: "json-schema",
        schema: input.schema
      }
    };
  }

  let source: SchemaSource;

  const variant = extractVariant(input);
  const hash = extractHash(variant, input);

  if (variant === "file-reference") {
    const fileReference = extractFileReference(input as FileReferenceInput);
    if (!fileReference) {
      throw new Error(
        `Failed to extract a valid file reference from the provided input "${JSON.stringify(
          input
        )}". Please ensure that the input is correctly formatted as a file reference (e.g. "./schema.ts#MySchema") and that the file exists at the specified path.`
      );
    }

    if (
      !VALID_SOURCE_FILE_EXTENSIONS.includes(
        findFileExtensionSafe(fileReference.file)
      )
    ) {
      throw new Error(
        `The provided schema file input "${
          fileReference.file
        }" has an invalid file extension. Please ensure that the file has one of the following extensions: ${list(
          VALID_SOURCE_FILE_EXTENSIONS,
          { conjunction: "or" }
        )}.`
      );
    }

    const resolved = await resolve<SchemaSourceInput>(
      context,
      input as FileReferenceInput,
      defu(options, {
        plugins: [
          esbuildPlugin(context, {
            reflection: "default",
            level: "all"
          })
        ]
      })
    );

    source = extractSource(extractResolvedVariant(resolved), resolved);
  } else if (
    [
      "json-schema",
      "standard-schema",
      "zod3",
      "untyped",
      "valibot",
      "reflection"
    ].includes(variant)
  ) {
    source = extractSource(variant, input as SchemaSourceInput);
  } else {
    throw new Error(
      `Invalid schema definition input "${
        variant
      }". The variant must be one of "file-reference", "json-schema", "standard-schema", "zod3", "untyped", or "reflection".`
    );
  }

  return {
    variant,
    source,
    schema: await extractSchema(source.schema, source.variant),
    hash
  };
}

/**
 * Extracts a JSON Schema from a given schema definition input, which can be a Zod schema, a Valibot schema, any Standard JSON Schema type, a plain JSON Schema object, an untyped schema, or a Deepkit Type object. If the input is a type definition reference (e.g. a file path with an export), it will be resolved and bundled using Rolldown to obtain the actual schema definition before extraction.
 *
 * @example
 * ```ts
 * // Resolve a schema definition from a file path
 * const schema1 = await extract(context, "./schemas.ts#MySchema");
 * // Resolve a schema definition from a JSON Schema object
 * const schema2 = await extract(context, schemaObject);
 * // Resolve a schema definition from a Zod schema
 * const schema3 = await extract(context, zodSchema);
 * // Resolve a schema definition from a reflected Deepkit Type object
 * const schema4 = await extract(context, reflectionType);
 * ```
 *
 * @see https://zod.dev/
 * @see https://valibot.dev/
 * @see https://standardschema.dev/json-schema#what-schema-libraries-support-this-spec
 * @see https://json-schema.org/
 * @see https://ajv.js.org/json-type-definition.html
 * @see https://deepkit.io/en/documentation/runtime-types/reflection
 * @see https://github.com/unjs/untyped
 * @see https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param input - The schema definition input to extract, which can be a Zod schema, a Valibot schema, any Standard JSON Schema type, a plain JSON Schema object, an untyped schema, or a reflected Deepkit Type object.
 * @param options - Optional overrides for the Rolldown configuration used during extraction.
 * @returns A promise that resolves to the extracted and normalized schema as a JSON Schema object.
 * @throws Will throw an error if the input is not a valid schema definition or if the extraction process fails to produce a valid schema.
 */
export async function extract(
  context: Context,
  input: SchemaInput,
  options: BundleOptions = {}
): Promise<Schema> {
  if (isSchemaWithSource(input) || isSchema(input)) {
    return input;
  }

  let result: Schema | undefined;

  const variant = extractVariant(input);
  const hash = extractHash(variant, input);

  const cacheFilePath = joinPaths(getCacheDirectory(context), `${hash}.json`);
  if (
    context.config.skipCache !== true &&
    context.fs.existsSync(cacheFilePath)
  ) {
    const schema = await context.fs.read(cacheFilePath);
    if (schema) {
      result = {
        variant,
        hash,
        schema: JSON.parse(schema) as JsonSchema
      };
    }
  }

  result ??= await extractSchemaWithSource(context, input, options);
  if (!result?.schema) {
    throw new Error(
      `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Valibot schema, any Standard JSON Schema type, a plain JSON Schema object, an untyped schema, or a reflected Deepkit Type object.`
    );
  }

  if (context.config.skipCache !== true) {
    await writeSchema(context, result);
  }

  return result;
}
