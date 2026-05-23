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
  JsonSchemaObject,
  JsonSchemaType,
  stringifyValue
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

export interface ObjectDeclarationProps extends VarDeclarationProps {
  schema?: JsonSchemaObject;
}

/**
 * Generates a TypeScript object for the given reflection class.
 */
export function ObjectDeclaration(props: ObjectDeclarationProps) {
  const { schema } = props;
  if (!schema) {
    return null;
  }

  const name = computed(() =>
    camelCase(isSetString(props.name) ? props.name : schema?.name)
  );

  const defaultValues = computed(() =>
    Object.fromEntries(
      getPropertiesList(schema).map(property => [
        property.name,
        property.default
      ]) || {}
    )
  );
  const properties = computed(() =>
    getPropertiesList(schema)
      .filter(
        property =>
          !property?.ignore &&
          !property?.runtime &&
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
        (a?.readOnly && b?.readOnly) || (!a?.readOnly && !b?.readOnly)
          ? a.name.localeCompare(b.name)
          : a?.readOnly
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
      <SchemaContext.Provider value={schema}>
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
                      <ObjectDeclarationProperty
                        name={property.name}
                        schema={property}
                      />
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

export interface ObjectDeclarationPropertyProps extends ComponentProps {
  name: string;
  required?: boolean;
  value?: unknown;
  schema: JsonSchema;
}

/**
 * Generates a TypeScript object property for the given reflection class.
 */
export function ObjectDeclarationProperty(
  props: ObjectDeclarationPropertyProps
) {
  const [{ schema, name, value }, rest] = splitProps(props, [
    "schema",
    "name",
    "value"
  ]);

  return (
    <Show when={isSetString(name)}>
      <SchemaPropertyContext.Provider value={schema}>
        <TSDocSchemaProperty schema={schema} defaultValue={value} />
        <ObjectProperty
          name={name}
          value={stringifyValue(
            value,
            (schema as { type?: JsonSchemaType }).type
          )}
          {...rest}
        />
        <hbr />
      </SchemaPropertyContext.Provider>
    </Show>
  );
}
