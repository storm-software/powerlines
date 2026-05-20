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
  getProperties,
  getSchemaMetadata,
  isSchemaNullable,
  JsonSchemaObjectType,
  JsonSchemaPrimitiveType,
  JsonSchemaType,
  SchemaProperty,
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

export interface InterfaceDeclarationProps
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
  schema?: JsonSchemaObjectType;

  /**
   * Documentation for the interface. This can be a string or any Alloy component that renders documentation content (such as `TSDoc`).
   */
  doc?: Children;
}

export interface InterfaceDeclarationPropertyProps
  extends Omit<InterfaceMemberProps, "name">, ComponentProps {
  schema: JsonSchemaType | SchemaProperty;
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
}
export interface InterfacePropertyMemberProps extends InterfaceMemberPropsBase {
  name: string | Namekey;
  isReadonly?: boolean;
  type?: Children | JsonSchemaPrimitiveType;
  optional?: boolean;
  nullish?: boolean;
}

export interface InterfaceIndexerMemberProps extends InterfaceMemberPropsBase {
  indexer: Children;
  isReadonly?: boolean;
  type?: Children | JsonSchemaPrimitiveType;
}

export interface InterfaceSchemaMemberProps extends InterfaceMemberPropsBase {
  schema: JsonSchemaType | SchemaProperty;
}

export type InterfaceMemberProps =
  | InterfacePropertyMemberProps
  | InterfaceIndexerMemberProps
  | InterfaceSchemaMemberProps;

/**
 * Create a TypeScript interface member.
 *
 * An interface member can either provide a `name` prop to create a named
 * property, or an `indexer` prop to define an indexer for the interface.
 *
 * The type of the member can be provided either as the `type` prop or as the
 * children of the component.
 */
export function InterfaceMember(props: InterfaceMemberProps) {
  const type = (props as InterfaceSchemaMemberProps).schema
    ? stringifyType((props as InterfaceSchemaMemberProps).schema)
    : ((props as InterfacePropertyMemberProps | InterfaceIndexerMemberProps)
        .type ?? props.children);

  const readonly =
    ((props as InterfaceSchemaMemberProps).schema &&
      getSchemaMetadata((props as InterfaceSchemaMemberProps).schema)
        ?.isReadonly) ||
    (!(props as InterfaceSchemaMemberProps).schema &&
      (props as InterfacePropertyMemberProps | InterfaceIndexerMemberProps)
        .isReadonly)
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
      (props as InterfaceSchemaMemberProps).schema &&
      ("optional" in (props as InterfaceSchemaMemberProps).schema
        ? (props as InterfaceSchemaMemberProps).schema.optional
        : false)
    ) ||
    !!(
      !(props as InterfaceSchemaMemberProps).schema &&
      (props as InterfacePropertyMemberProps).optional
    );

  const scope = useTSMemberScope();
  const sym = createSymbol(
    TSOutputSymbol,
    String(
      ((props as InterfaceSchemaMemberProps).schema
        ? getSchemaMetadata((props as InterfaceSchemaMemberProps).schema)
            ?.name ||
          getSchemaMetadata((props as InterfaceSchemaMemberProps).schema)
            ?.resourceId
        : isSetString((props as InterfacePropertyMemberProps).name)
          ? (props as InterfacePropertyMemberProps).name
          : (props as InterfacePropertyMemberProps).name.toString()) ||
        uuid().replace(/-/g, "")
    ),
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
export function InterfaceDeclaration(props: InterfaceDeclarationProps) {
  const [{ name, schema, doc }, rest] = splitProps(props, [
    "name",
    "schema",
    "doc"
  ]);

  const interfaceName = computed(() =>
    pascalCase(
      isSetString(name)
        ? name
        : getSchemaMetadata(schema)?.name || getSchemaMetadata(schema)?.title || ""
    )
  );
  const properties = computed(() =>
    schema
      ? Object.values(getProperties(schema))
          .filter(property => !property.metadata?.isIgnored)
          .sort((a, b) =>
            (a.metadata?.isReadonly && b.metadata?.isReadonly) ||
            (!a.metadata?.isReadonly && !b.metadata?.isReadonly)
              ? a.name.localeCompare(b.name)
              : a.metadata?.isReadonly
                ? 1
                : -1
          )
      : []
  );

  return (
    <Show
      when={schema && properties.value.length > 0}
      fallback={
        <BaseInterfaceDeclaration {...props} name={interfaceName.value} />
      }>
      <SchemaContext.Provider value={schema}>
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
export function InterfaceDeclarationProperty(
  props: InterfaceDeclarationPropertyProps
) {
  const [{ schema }, rest] = splitProps(props, ["schema"]);

  const name = computed(
    () =>
      schema.metadata?.name ||
      camelCase(
        schema.metadata?.title || schema.metadata?.resourceId || schema.name
      )
  );

  return (
    <Show when={isSetString(name.value)}>
      <SchemaPropertyContext.Provider value={schema}>
        <TSDocSchemaProperty schema={schema} />
        <InterfaceMember
          name={name.value!}
          isReadonly={schema.metadata?.isReadonly}
          optional={schema.optional}
          nullish={schema.nullable || isSchemaNullable(schema)}
          type={getPrimarySchemaType(schema) as JsonSchemaPrimitiveType}
          {...rest}
        />
      </SchemaPropertyContext.Provider>
    </Show>
  );
}
