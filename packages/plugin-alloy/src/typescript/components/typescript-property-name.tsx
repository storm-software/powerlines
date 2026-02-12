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

import { MemberDeclarationContext, useContext } from "@alloy-js/core";
import { memo } from "@alloy-js/core/jsx-runtime";
import { TSOutputSymbol } from "@alloy-js/typescript";
import { isValidJSIdentifier } from "../helpers/utilities";

export interface TypescriptPropertyNameProps {
  /**
   * The name of the property.
   */
  name?: string;

  /**
   * Whether the property is a private property. If `true`, the property will be prefixed with `#`.
   */
  private?: boolean;
}

/**
 * A TypeScript property name for an interface, class, or object member.
 *
 * @remarks
 * If the name is not a valid JavaScript identifier, it will be quoted. If a `name` prop is provided, it will be used as the property name. Otherwise, the name will be taken from the {@link (MemberDeclarationContext:variable)}.
 */
export function TypescriptPropertyName(props: TypescriptPropertyNameProps) {
  if (props.name) {
    return memo(() => {
      if (props.private) {
        return `#${props.name}`;
      }
      return quoteIfNeeded(props.name!);
    });
  } else {
    const declSymbol = useContext(MemberDeclarationContext) as TSOutputSymbol;
    if (!declSymbol) {
      return "(no member declaration context)";
    }

    if (declSymbol.isPrivateMemberSymbol) {
      return <>#{declSymbol.name}</>;
    } else {
      return <>{quoteIfNeeded(declSymbol.name)}</>;
    }
  }
}

function quoteIfNeeded(name: string) {
  if (isValidJSIdentifier(name)) {
    return name;
  } else {
    return `"${name.replace(/"/g, '\\"')}"`;
  }
}
