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

import { Scope, ScopePropsWithInfo, ScopePropsWithValue } from "@alloy-js/core";
import { createLexicalScope, TSLexicalScope } from "@alloy-js/typescript";

export interface LexicalScopePropsWithScopeValue extends ScopePropsWithValue {}
export interface LexicalScopePropsWithScopeInfo extends ScopePropsWithInfo {}

export type LexicalScopeProps =
  | LexicalScopePropsWithScopeValue
  | LexicalScopePropsWithScopeInfo;

/**
 * A lexical scope for TypeScript, which contains declaration spaces for types and values. Declaration components will create symbols in this scope.
 */
export function LexicalScope(props: LexicalScopeProps) {
  let scope;
  if ("value" in props) {
    if (!(props.value instanceof TSLexicalScope)) {
      throw new TypeError(
        "LexicalScope value must be a TSLexicalScope instance"
      );
    }
    scope = props.value;
  } else {
    scope = createLexicalScope(props.name ?? "Lexical scope", props);
  }

  return <Scope value={scope}>{props.children}</Scope>;
}
