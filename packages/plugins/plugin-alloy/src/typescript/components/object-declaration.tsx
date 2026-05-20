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

import {
  computed,
  Declaration as CoreDeclaration,
  createSymbolSlot,
  For,
  Name,
  Show,
  splitProps
} from "@alloy-js/core";
import {
  createValueSymbol,
  ObjectExpression,
  ObjectProperty,
  TSSymbolFlags,
  TypeRefContext,
  useTSNamePolicy,
  VarDeclarationProps
} from "@alloy-js/typescript";
import {
  getPropertiesList,
  JsonSchema,
  JsonSchemaLike,
  JsonSchemaProperty
} from "@powerlines/schema";
import { camelCase } from "@stryke/string-format/camel-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import {
  SchemaContext,
  SchemaPropertyContext
} from "../../core/contexts/schema";
import { ComponentProps } from "../../types/components";
import { TSDocObjectSchema, TSDocSchemaProperty } from "./tsdoc-schema";

export interface ObjectDeclarationProps<
  T extends Record<string, any> = Record<string, any>
> extends VarDeclarationProps {
  schema?: JsonSchema<T>;
}

/**
 * Generates a TypeScript object for the given reflection class.
 */
export function ObjectDeclaration<
  T extends Record<string, any> = Record<string, any>
>(props: ObjectDeclarationProps<T>) {
  const { schema } = props;
  if (!schema) {
    return null;
  }

  const name = computed(() =>
    camelCase(isSetString(props.name) ? props.name : schema?.name)
  );

  const defaultValues = computed(
    () => (schema?.default || {}) as Record<string, unknown>
  );
  const properties = computed(() =>
    getPropertiesList<T>(schema)
      .filter(
        property =>
          !property.metadata?.isIgnored &&
          !property.metadata?.isRuntime &&
          !isUndefined(
            defaultValues.value[property.name] ??
              property?.alias?.reduce((ret, alias) => {
                if (
                  isUndefined(ret) &&
                  !isUndefined(defaultValues.value[alias])
                ) {
                  return defaultValues.value[alias];
                }

                return ret;
              }, undefined as any) ??
              property?.default
          )
      )
      .sort((a, b) =>
        (a.metadata?.isReadonly && b.metadata?.isReadonly) ||
        (!a.metadata?.isReadonly && !b.metadata?.isReadonly)
          ? a.name.localeCompare(b.name)
          : a.metadata?.isReadonly
            ? 1
            : -1
      )
  );

  const TypeSymbolSlot = createSymbolSlot();
  const ValueTypeSymbolSlot = createSymbolSlot();
  const sym = createValueSymbol(name.value || "schema", {
    refkeys: props.refkey,
    default: props.default,
    export: props.export,
    metadata: props.metadata,
    tsFlags: props.nullish ? TSSymbolFlags.Nullish : TSSymbolFlags.None,
    type: props.type ? TypeSymbolSlot.firstSymbol : undefined,
    namePolicy: useTSNamePolicy().for("variable")
  });

  if (!props.type) {
    ValueTypeSymbolSlot.moveMembersTo(sym);
  }

  const keyword = props.var ? "var" : props.let ? "let" : "const";
  const type = props.type ? (
    <TypeRefContext>
      : <TypeSymbolSlot>{props.type}</TypeSymbolSlot>
    </TypeRefContext>
  ) : undefined;

  return (
    <Show when={!!schema}>
      <SchemaContext.Provider value={schema as JsonSchemaLike}>
        <Show when={!!name.value && !!type}>
          <TSDocObjectSchema schema={schema} />
          <CoreDeclaration symbol={sym}>
            {props.export ? "export " : ""}
            {props.default ? "default " : ""}
            {keyword} <Name />
            {type} ={" "}
            <ValueTypeSymbolSlot>
              {props.initializer ?? props.children ?? (
                <ObjectExpression>
                  <For
                    each={properties.value ?? []}
                    comma={true}
                    doubleHardline={true}>
                    {property => (
                      <ObjectDeclarationProperty schema={property} />
                    )}
                  </For>
                </ObjectExpression>
              )}
            </ValueTypeSymbolSlot>
          </CoreDeclaration>
        </Show>
        <hbr />
      </SchemaContext.Provider>
    </Show>
  );
}

export interface ObjectDeclarationPropertyProps<
  T extends Record<string, any> = Record<string, any>
> extends ComponentProps {
  schema: JsonSchemaProperty<T>;
}

/**
 * Generates a TypeScript object property for the given reflection class.
 */
export function ObjectDeclarationProperty<
  T extends Record<string, any> = Record<string, any>
>(props: ObjectDeclarationPropertyProps<T>) {
  const [{ schema }, rest] = splitProps(props, ["schema"]);

  const name = computed(
    () =>
      schema.metadata?.name ||
      camelCase(
        schema.metadata?.title ||
          schema.metadata?.resourceId ||
          ("name" in schema ? schema.name : undefined)
      )
  );

  return (
    <Show when={isSetString(name.value)}>
      <SchemaPropertyContext.Provider value={schema as JsonSchemaLike}>
        <TSDocSchemaProperty schema={schema} />
        <ObjectProperty
          name={name.value}
          value={
            !isUndefined(schema.metadata?.default)
              ? JSON.stringify(schema.metadata?.default)
              : undefined
          }
          {...rest}
        />
        <hbr />
      </SchemaPropertyContext.Provider>
    </Show>
  );
}
