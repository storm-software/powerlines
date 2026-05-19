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

import type { ComponentContext } from "@alloy-js/core";
import { createContext, createNamedContext, useContext } from "@alloy-js/core";
import type {
  ReflectionMethod,
  ReflectionParameter
} from "@powerlines/deepkit/vendor/type";
import { JTDSchemaType } from "@powerlines/schema";

/**
 * The reflection class context used in template rendering.
 */
export const SchemaContext: ComponentContext<JTDSchemaType> =
  createContext<JTDSchemaType>();

/**
 * Hook to access the schema context.
 *
 * @returns A reactive version of the current schema.
 */
export function useSchema() {
  const context = useContext<JTDSchemaType>(SchemaContext)!;

  if (!context) {
    throw new Error(
      "Powerlines - Schema Context is not set. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return context;
}

/**
 * The schema property context used in template rendering.
 */
export const SchemaPropertyContext: ComponentContext<JTDSchemaType> =
  createNamedContext<JTDSchemaType>("SchemaProperty");

/**
 * Hook to access the Schema Property context.
 *
 * @returns A reactive version of the current schema property.
 */
export function useSchemaProperty() {
  const context = useContext<JTDSchemaType>(SchemaPropertyContext)!;
  if (!context) {
    throw new Error(
      "Powerlines - Schema Property Context is not set. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return context;
}

/**
 * The reflection method context used in template rendering.
 */
export const ReflectionMethodContext: ComponentContext<ReflectionMethod> =
  createNamedContext<ReflectionMethod>("ReflectionMethod");

/**
 * Hook to access the Reflection Method context.
 *
 * @returns A reactive version of the current reflection.
 */
export function useReflectionMethod() {
  const context = useContext<ReflectionMethod>(ReflectionMethodContext)!;

  if (!context) {
    throw new Error(
      "Powerlines - Reflection Method Context is not set. Please make sure the Alloy components are being provided to an invocation of the `render` function added to plugins by `@powerlines/plugin-alloy`."
    );
  }

  return context;
}

/**
 * The reflection parameter context used in template rendering.
 */
export const ReflectionParameterContext: ComponentContext<ReflectionParameter> =
  createNamedContext<ReflectionParameter>("ReflectionParameter");

/**
 * Hook to access the Reflection Parameter context.
 *
 * @returns A reactive version of the current reflection.
 */
export function useReflectionParameter() {
  return useContext<ReflectionParameter>(ReflectionParameterContext)!;
}
