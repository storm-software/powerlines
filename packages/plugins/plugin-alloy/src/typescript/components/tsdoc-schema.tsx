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
  childrenArray,
  computed,
  List,
  Show,
  splitProps
} from "@alloy-js/core";

import {
  JTDSchemaObjectType,
  JTDSchemaType,
  JTDType
} from "@powerlines/schema";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { Spacing } from "../../core/components/spacing";
import { TSDoc, TSDocAttributesTags, TSDocProps } from "./tsdoc";

export interface TSDocObjectSchemaProps extends TSDocProps {
  schema: JTDSchemaObjectType;
}

/**
 * Generates a TSDoc documentation block for the given reflection class. This component will render the description of the reflection as the main content of the documentation block, and will render any additional attributes (such as title, alias, domain, permission, etc.) as tags in the documentation block. If there are child elements provided, they will be rendered as a list below the main content of the documentation block. This is useful for rendering additional details about the reflection that may not be included in the description, such as information about properties or methods of a class.
 */
export function TSDocObjectSchema(props: TSDocObjectSchemaProps) {
  const [{ children, heading, schema }, rest] = splitProps(props, [
    "heading",
    "children",
    "schema"
  ]);

  if (!isSetObject(schema)) {
    return null;
  }

  const title = computed(
    () => schema.metadata?.title || titleCase(schema.metadata?.name)
  );
  const computedHeading = computed(
    () => heading || schema.metadata?.description || title.value
  );

  const alias = computed(() => schema.metadata?.alias);
  const domain = computed(() => schema.metadata?.resourceId);
  const groups = computed(() => schema.metadata?.groups);
  const isReadonly = computed(() => schema.metadata?.isReadonly);
  const isInternal = computed(() => schema.metadata?.isInternal);
  const isRuntime = computed(() => schema.metadata?.isRuntime);
  const isIgnore = computed(() => schema.metadata?.isIgnore);
  const isHidden = computed(() => schema.metadata?.isHidden);

  if (
    !computedHeading.value ||
    (isSetString(computedHeading.value) && computedHeading.value.trim() === "")
  ) {
    return null;
  }

  const hasAttributes = computed(
    () =>
      isSetString(title.value) ||
      (!isUndefined(alias.value) && alias.value.length > 0) ||
      (!isUndefined(groups.value) && groups.value.length > 0) ||
      isSetString(domain.value) ||
      !isUndefined(isReadonly.value) ||
      !isUndefined(isInternal.value) ||
      !isUndefined(isRuntime.value) ||
      !isUndefined(isIgnore.value) ||
      !isUndefined(isHidden.value)
  );

  return (
    <TSDoc
      {...rest}
      heading={
        isSetString(computedHeading.value)
          ? computedHeading.value.trim()
          : computedHeading.value
      }>
      <Show when={hasAttributes.value}>
        <TSDocAttributesTags
          type={(schema as { type?: JTDType }).type}
          title={title.value}
          alias={alias.value}
          resourceId={domain.value}
          groups={groups.value}
          isReadonly={Boolean(isReadonly.value)}
          isInternal={Boolean(isInternal.value)}
          isRuntime={Boolean(isRuntime.value)}
          isIgnored={Boolean(isIgnore.value)}
          isHidden={Boolean(isHidden.value)}
        />
      </Show>
      <Show
        when={
          !isUndefined(children) &&
          childrenArray(() => children).filter(Boolean).length > 0
        }>
        <Show when={hasAttributes.value}>
          <Spacing />
        </Show>
        <List>{childrenArray(() => children)}</List>
      </Show>
    </TSDoc>
  );
}

export interface TSDocSchemaPropertyProps extends TSDocProps {
  schema: JTDSchemaType;
}

/**
 * Generates a TSDoc documentation block for the given reflection property. This component will render the description of the reflection as the main content of the documentation block, and will render any additional attributes (such as title, alias, domain, permission, etc.) as tags in the documentation block. If there are child elements provided, they will be rendered as a list below the main content of the documentation block. This is useful for rendering additional details about the reflection that may not be included in the description, such as information about parameters of a method or properties of a class.
 */
export function TSDocSchemaProperty(props: TSDocSchemaPropertyProps) {
  const [{ children, schema }, rest] = splitProps(props, [
    "children",
    "schema"
  ]);

  if (!isSetObject(schema)) {
    return null;
  }

  const hasAttributes = computed(
    () =>
      isSetString(schema.metadata?.title) ||
      (!isUndefined(schema.metadata?.alias) &&
        schema.metadata?.alias.length > 0) ||
      (!isUndefined(schema.metadata?.groups) &&
        schema.metadata?.groups.length > 0) ||
      isSetString(schema.metadata?.resourceId) ||
      !isUndefined(schema.metadata?.isReadonly) ||
      !isUndefined(schema.metadata?.isInternal) ||
      !isUndefined(schema.metadata?.isRuntime) ||
      !isUndefined(schema.metadata?.isIgnored) ||
      !isUndefined(schema.metadata?.isHidden) ||
      !isUndefined(schema?.metadata?.default)
  );

  return (
    <TSDoc heading={schema.metadata?.description} {...rest}>
      <Show when={hasAttributes.value}>
        <TSDocAttributesTags
          type={(schema as { type?: JTDType }).type}
          title={schema.metadata?.title}
          alias={schema.metadata?.alias}
          resourceId={schema.metadata?.resourceId}
          groups={schema.metadata?.groups}
          isReadonly={schema.metadata?.isReadonly}
          isInternal={schema.metadata?.isInternal}
          isRuntime={schema.metadata?.isRuntime}
          isIgnored={schema.metadata?.isIgnored}
          isHidden={schema.metadata?.isHidden}
          defaultValue={schema.metadata?.default}
        />
      </Show>
      <Show
        when={
          !isUndefined(children) &&
          childrenArray(() => children).filter(Boolean).length > 0
        }>
        <Show when={hasAttributes.value}>
          <Spacing />
        </Show>
        <List>{childrenArray(() => children)}</List>
      </Show>
    </TSDoc>
  );
}

// export interface TSDocReflectionMethodProps extends TSDocProps {
//   reflection: ReflectionMethod;
// }

// /**
//  * Generates a TSDoc documentation block for the given reflection method. This component will render the description of the reflection as the main content of the documentation block, and will render any additional attributes (such as title, alias, domain, permission, etc.) as tags in the documentation block. If there are child elements provided, they will be rendered as a list below the main content of the documentation block. Additionally, this component will render information about the parameters and return type of the method, if available.
//  */
// export function TSDocReflectionMethod(props: TSDocReflectionMethodProps) {
//   const [{ children, reflection }, rest] = splitProps(props, [
//     "children",
//     "reflection"
//   ]);

//   if (!isSetObject(reflection)) {
//     return null;
//   }

//   const heading = computed(
//     () =>
//       reflection.getDescription() ||
//       (isString(reflection.getName())
//         ? code`${String(reflection.getName())} method definition`
//         : undefined)
//   );

//   return (
//     <TSDoc heading={heading.value} {...rest}>
//       <TSDocAttributesTags
//         title={reflection.getTitle()}
//         alias={reflection.getAlias()}
//         resourceId={reflection.getDomain()}
//         permission={reflection.getPermission()}
//         isReadonly={reflection.isReadonly()}
//         isInternal={reflection.isInternal()}
//         isRuntime={reflection.isRuntime()}
//         isIgnored={reflection.isIgnored()}
//         isHidden={reflection.isHidden()}
//       />
//       <Show
//         when={Boolean(children) && childrenArray(() => children).length > 0}>
//         <List>{childrenArray(() => children)}</List>
//       </Show>
//       <Show when={reflection.getParameters().length > 0}>
//         <Spacing />
//         <For each={reflection.getParameters()} hardline ender={<hbr />}>
//           {param => (
//             <TSDocParam
//               name={param.getName()}
//               optional={param.isOptional()}
//               defaultValue={
//                 param.hasDefault() ? param.getDefaultValue() : undefined
//               }>
//               <Show
//                 when={Boolean(param.parameter.description)}
//                 fallback={code`A parameter to provide a ${param.getName()} value to the function.`}>
//                 {param.parameter.description}
//               </Show>
//             </TSDocParam>
//           )}
//         </For>
//       </Show>
//       <Show when={reflection.getReturnType().kind !== ReflectionKind.void}>
//         <Spacing />
//         <TSDocReturns>
//           {code`The return value of the function, which is of type ${stringifyType(
//             reflection.getReturnType()
//           )}.`}
//         </TSDocReturns>
//       </Show>
//     </TSDoc>
//   );
// }

// /**
//  * Uses the `useReflectionMethod` hook to retrieve the reflection method from the context, and then renders a `TSDocReflectionMethod` component with the retrieved reflection method. This is a convenience component that allows you to easily render a TSDoc documentation block for the current reflection method without having to manually retrieve the reflection method from the context.
//  */
// export function TSDocContextMethod(props: TSDocProps) {
//   const reflection = useReflectionMethod();

//   return (
//     <Show when={isSetObject(reflection)}>
//       <TSDocReflectionMethod {...props} reflection={reflection} />
//     </Show>
//   );
// }
