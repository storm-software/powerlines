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
  Children,
  MemberScope as CoreMemberScope,
  createScope
} from "@alloy-js/core";
import {
  TSMemberScope,
  TSOutputSymbol,
  useTSLexicalScopeIfPresent
} from "@alloy-js/typescript";

export interface MemberScopeProps {
  children: Children;

  /**
   * The symbol that this member scope will create member symbols on.
   */
  ownerSymbol: TSOutputSymbol;
}

/**
 * A member scope for TypeScript. Member declarations will create symbols
 * in this scope, which will be added to the owner symbol's members.
 */
export function MemberScope(props: MemberScopeProps) {
  const parentScope = useTSLexicalScopeIfPresent();
  const binder = props.ownerSymbol.binder ?? parentScope?.binder;
  const memberScope = createScope(
    TSMemberScope,
    "member-scope",
    parentScope,
    props.ownerSymbol,
    {
      binder
    }
  );

  return (
    <CoreMemberScope value={memberScope}>{props.children}</CoreMemberScope>
  );
}
