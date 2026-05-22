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
  Block,
  Children,
  childrenArray,
  computed,
  createSymbol,
  createSymbolSlot,
  effect,
  emitSymbol,
  findUnkeyedChildren,
  For,
  MemberDeclaration,
  Name,
  Namekey,
  Refkey,
  Show,
  splitProps,
  takeSymbols
} from "@alloy-js/core";
import {
  CommonDeclarationProps,
  Declaration,
  ensureTypeRefContext,
  TSOutputSymbol,
  TSSymbolFlags,
  TypeParameterDescriptor,
  useTSLexicalScope,
  useTSMemberScope,
  useTSNamePolicy
} from "@alloy-js/typescript";
import {
  getPrimarySchemaType,
  getPropertiesList,
  isSchemaNullable,
  JsonSchema,
  JsonSchemaLike,
  JsonSchemaPrimitiveType,
  JsonSchemaProperty,
  stringifyType
} from "@powerlines/schema";
import { camelCase } from "@stryke/string-format/camel-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { PartialKeys } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import {
  SchemaContext,
  SchemaPropertyContext
} from "../../core/contexts/schema";
import { ComponentProps } from "../../types/components";
import { MemberScope } from "../contexts/member-scope";
import { PropertyName } from "./property-name";
import { TSDoc } from "./tsdoc";
import { TSDocObjectSchema, TSDocSchemaProperty } from "./tsdoc-schema";
import { TypeParameters } from "./type-parameters";

export interface InterfaceDeclarationProps<
  T extends Record<string, any> = Record<string, any>
>
  extends PartialKeys<CommonDeclarationProps, "name">, ComponentProps {
  /**
   * A base type that this interface extends. This can be used to represent inheritance
   */
  extends?: Children;

  /**
   * The generic type parameters of the interface.
   */
  typeParameters?: TypeParameterDescriptor[] | string[];

  /**
   * The JSON Schema that describes the properties of this interface.
   *
   * @remarks
   * This is used to generate the members of the interface based on the properties of the schema.
   */
  schema?: JsonSchema<T>;

  /**
   * Documentation for the interface. This can be a string or any Alloy component that renders documentation content (such as `TSDoc`).
   */
  doc?: Children;
}

export interface InterfaceDeclarationPropertyProps<
  T extends Record<string, any> = Record<string, any>
>
  extends Omit<InterfaceMemberProps<T>, "name">, ComponentProps {
  schema: JsonSchemaProperty<T>;
}

export interface InterfaceExpressionProps {
  children?: Children;
}

export const InterfaceExpression = ensureTypeRefContext(
  function InterfaceExpression(props: InterfaceExpressionProps) {
    const scope = useTSLexicalScope();
    const symbol = createSymbol(TSOutputSymbol, "", undefined, {
      transient: true,
      binder: scope?.binder
    });

    emitSymbol(symbol);

    return (
      <group>
        <MemberScope ownerSymbol={symbol}>
          <Block>{props.children}</Block>
        </MemberScope>
      </group>
    );
  }
);

export interface InterfaceMemberPropsBase {
  children?: Children;
  doc?: Children;
  refkey?: Refkey | Refkey[];
  readOnly?: boolean;
  type?: Children | JsonSchemaPrimitiveType | string;
  nullish?: boolean;
}

export interface InterfacePropertyMemberProps extends InterfaceMemberPropsBase {
  name: string | Namekey;
}

export interface InterfaceIndexerMemberProps extends InterfaceMemberPropsBase {
  indexer: Children;
}

export interface InterfaceSchemaMemberProps<
  T extends Record<string, any> = Record<string, any>
> extends InterfaceMemberPropsBase {
  schema: JsonSchemaProperty<T>;
}

export type InterfaceMemberProps<
  T extends Record<string, any> = Record<string, any>
> =
  | InterfacePropertyMemberProps
  | InterfaceIndexerMemberProps
  | InterfaceSchemaMemberProps<T>;

/**
 * Create a TypeScript interface member.
 *
 * An interface member can either provide a `name` prop to create a named
 * property, or an `indexer` prop to define an indexer for the interface.
 *
 * The type of the member can be provided either as the `type` prop or as the
 * children of the component.
 */
export function InterfaceMember<
  T extends Record<string, any> = Record<string, any>
>(props: InterfaceMemberProps<T>) {
  const type = (props as InterfaceSchemaMemberProps<T>).schema
    ? stringifyType<T[keyof T]>((props as InterfaceSchemaMemberProps<T>).schema)
    : (props.type ?? props.children);

  const readonly =
    ((props as InterfaceSchemaMemberProps<T>).schema &&
      (props as InterfaceSchemaMemberProps<T>).schema?.readOnly) ||
    (!(props as InterfaceSchemaMemberProps<T>).schema && props.readOnly)
      ? "readonly "
      : "";

  if ("indexer" in props) {
    return (
      <>
        <Show when={Boolean(props.doc)}>
          <TSDoc heading={props.doc} />
        </Show>
        {readonly}[{props.indexer}]: {type}
      </>
    );
  }

  const optional =
    !!(
      (props as InterfaceSchemaMemberProps<T>).schema &&
      "nullable" in (props as InterfaceSchemaMemberProps<T>).schema &&
      (props as InterfaceSchemaMemberProps<T>).schema.nullable
    ) || !!props.nullish;

  const scope = useTSMemberScope();
  const sym = createSymbol(
    TSOutputSymbol,
    (((props as InterfaceSchemaMemberProps<T>).schema
      ? (props as InterfaceSchemaMemberProps<T>).schema?.name
      : undefined) || isSetString((props as InterfacePropertyMemberProps).name)
      ? (props as InterfacePropertyMemberProps).name
      : (props as InterfacePropertyMemberProps).name.toString()) ||
      uuid().replace(/-/g, ""),
    scope.ownerSymbol.staticMembers,
    {
      refkeys: props.refkey,
      tsFlags:
        TSSymbolFlags.TypeSymbol |
        (optional ? TSSymbolFlags.Nullish : TSSymbolFlags.None),
      namePolicy: useTSNamePolicy().for("interface-member"),
      binder: scope.binder
    }
  );

  const taken = takeSymbols();
  effect(() => {
    if (taken.size > 1) return;
    const symbol = Array.from(taken)[0];
    if (symbol?.isTransient) {
      symbol.moveMembersTo(sym);
    }
  });

  return (
    <MemberDeclaration symbol={sym}>
      <Show when={Boolean(props.doc)}>
        <TSDoc heading={props.doc} />
      </Show>
      {readonly}
      <PropertyName />
      {optional ? "?" : ""}: {type}
    </MemberDeclaration>
  );
}

const BaseInterfaceDeclaration = ensureTypeRefContext(
  function InterfaceDeclaration(props: InterfaceDeclarationProps) {
    const ExprSlot = createSymbolSlot();

    const children = childrenArray(() => props.children);

    const extendsPart = props.extends ? <> extends {props.extends}</> : "";
    const filteredChildren = findUnkeyedChildren(children);
    const currentScope = useTSLexicalScope();

    const binder = currentScope?.binder;
    const sym = createSymbol(
      TSOutputSymbol,
      (isSetString(props.name) ? props.name : props.name?.toString()) ||
        uuid().replace(/-/g, ""),
      currentScope.types,
      {
        refkeys: props.refkey,
        default: props.default,
        export: props.export,
        metadata: props.metadata,
        tsFlags: TSSymbolFlags.TypeSymbol,
        namePolicy: useTSNamePolicy().for("interface"),
        binder
      }
    );

    effect(() => {
      if (ExprSlot.ref.value) {
        const takenSymbols = ExprSlot.ref.value;
        for (const symbol of takenSymbols) {
          // ignore non-transient symbols (likely not the result of an expression).
          if (symbol.isTransient) {
            symbol.moveMembersTo(sym);
          }
        }
      }
    });

    return (
      <>
        <Show when={Boolean(props.doc)}>
          <TSDoc heading={props.doc} />
        </Show>
        <Declaration {...props} nameKind="interface" kind="type" symbol={sym}>
          interface <Name />
          {props.typeParameters && (
            <TypeParameters parameters={props.typeParameters} />
          )}
          {extendsPart}{" "}
          <ExprSlot>
            <InterfaceExpression>{filteredChildren}</InterfaceExpression>
          </ExprSlot>
        </Declaration>
      </>
    );
  }
);

/**
 * Generates a TypeScript interface for the given schema.
 */
export function InterfaceDeclaration<
  T extends Record<string, any> = Record<string, any>
>(props: InterfaceDeclarationProps<T>) {
  const [{ name, schema, doc }, rest] = splitProps(props, [
    "name",
    "schema",
    "doc"
  ]);

  const interfaceName = computed(() =>
    pascalCase(isSetString(name) ? name : schema?.name || schema?.title || "")
  );
  const properties = computed(() =>
    schema
      ? getPropertiesList<T>(schema as Parameters<typeof getPropertiesList>[0])
          .filter(property => !property?.ignore)
          .sort((a, b) =>
            (a?.readOnly && b?.readOnly) || (!a?.readOnly && !b?.readOnly)
              ? !a.name && !b.name
                ? 0
                : !a.name
                  ? -1
                  : !b.name
                    ? 1
                    : a.name.localeCompare(b.name)
              : a?.readOnly
                ? 1
                : -1
          )
      : []
  );

  return (
    <Show
      when={schema && properties.value.length > 0}
      fallback={
        <BaseInterfaceDeclaration
          {...props}
          schema={{
            type: "object",
            name: interfaceName.value,
            properties: {}
          }}
          name={interfaceName.value}
        />
      }>
      <SchemaContext.Provider value={schema as JsonSchemaLike}>
        <TSDocObjectSchema heading={doc} schema={schema!} />
        <BaseInterfaceDeclaration
          export={true}
          name={interfaceName.value}
          {...rest}>
          <For each={properties} doubleHardline={true} semicolon={true}>
            {property => <InterfaceDeclarationProperty schema={property} />}
          </For>
        </BaseInterfaceDeclaration>
      </SchemaContext.Provider>
    </Show>
  );
}

/**
 * Generates a TypeScript interface property for the given reflection class.
 */
export function InterfaceDeclarationProperty<
  T extends Record<string, any> = Record<string, any>
>(props: InterfaceDeclarationPropertyProps<T>) {
  const [{ schema }, rest] = splitProps(props, ["schema"]);

  const name = computed(
    () =>
      schema?.name ||
      camelCase(schema?.title || schema?.databaseSchemaName || schema?.$id)
  );

  return (
    <Show when={isSetString(name.value)}>
      <SchemaPropertyContext.Provider value={schema as JsonSchemaLike}>
        <TSDocSchemaProperty schema={schema} />
        <InterfaceMember
          name={name.value}
          readOnly={schema?.readOnly}
          nullish={schema?.nullable || isSchemaNullable<T[keyof T]>(schema)}
          type={getPrimarySchemaType<T[keyof T]>(schema)}
          {...rest}
        />
      </SchemaPropertyContext.Provider>
    </Show>
  );
}
