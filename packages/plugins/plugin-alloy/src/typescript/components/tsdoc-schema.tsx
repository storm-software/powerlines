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
  getPrimarySchemaType,
  getSchemaMetadata,
  JsonSchemaObjectType,
  JsonSchemaPrimitiveType,
  JsonSchemaType
} from "@powerlines/schema";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { Spacing } from "../../core/components/spacing";
import { TSDoc, TSDocAttributesTags, TSDocProps } from "./tsdoc";

export interface TSDocObjectSchemaProps extends TSDocProps {
  schema: JsonSchemaObjectType;
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

  const metadata = computed(() => getSchemaMetadata(schema));
  const title = computed(
    () => metadata.value?.title || titleCase(metadata.value?.name)
  );
  const computedHeading = computed(
    () => heading || metadata.value?.description || title.value
  );

  const alias = computed(() => metadata.value?.alias);
  const domain = computed(() => metadata.value?.resourceId);
  const groups = computed(() => metadata.value?.groups);
  const isReadonly = computed(() => metadata.value?.isReadonly);
  const isInternal = computed(() => metadata.value?.isInternal);
  const isRuntime = computed(() => metadata.value?.isRuntime);
  const isIgnore = computed(() => metadata.value?.isIgnored);
  const isHidden = computed(() => metadata.value?.isHidden);

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
          type={getPrimarySchemaType(schema) as JsonSchemaPrimitiveType}
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
  schema: JsonSchemaType;
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

  const metadata = computed(() => getSchemaMetadata(schema));
  const hasAttributes = computed(
    () =>
      isSetString(metadata.value?.title) ||
      (!isUndefined(metadata.value?.alias) &&
        metadata.value?.alias.length > 0) ||
      (!isUndefined(metadata.value?.groups) &&
        metadata.value?.groups.length > 0) ||
      isSetString(metadata.value?.resourceId) ||
      !isUndefined(metadata.value?.isReadonly) ||
      !isUndefined(metadata.value?.isInternal) ||
      !isUndefined(metadata.value?.isRuntime) ||
      !isUndefined(metadata.value?.isIgnored) ||
      !isUndefined(metadata.value?.isHidden) ||
      !isUndefined(metadata.value?.default)
  );

  return (
    <TSDoc heading={metadata.value?.description} {...rest}>
      <Show when={hasAttributes.value}>
        <TSDocAttributesTags
          type={getPrimarySchemaType(schema) as JsonSchemaPrimitiveType}
          title={metadata.value?.title}
          alias={metadata.value?.alias}
          resourceId={metadata.value?.resourceId}
          groups={metadata.value?.groups}
          isReadonly={metadata.value?.isReadonly}
          isInternal={metadata.value?.isInternal}
          isRuntime={metadata.value?.isRuntime}
          isIgnored={metadata.value?.isIgnored}
          isHidden={metadata.value?.isHidden}
          defaultValue={metadata.value?.default}
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
