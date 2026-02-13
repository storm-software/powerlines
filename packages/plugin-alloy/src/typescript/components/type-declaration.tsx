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

import { Name, Show } from "@alloy-js/core";
import {
  CommonDeclarationProps,
  Declaration,
  ensureTypeRefContext,
  TypeParameterDescriptor
} from "@alloy-js/typescript";
import { TSDoc } from "./tsdoc";
import { TypeParameters } from "./type-parameters";

export interface TypeDeclarationProps extends CommonDeclarationProps {
  /**
   * The generic type parameters of the interface.
   */
  typeParameters?: TypeParameterDescriptor[] | string[];
}

export const TypeDeclaration = ensureTypeRefContext(function TypeDeclaration(
  props: TypeDeclarationProps
) {
  return (
    <>
      <Show when={Boolean(props.doc)}>
        <TSDoc heading={props.doc} />
      </Show>
      <Declaration {...props} kind="type" nameKind="type">
        type <Name />
        {props.typeParameters && (
          <TypeParameters parameters={props.typeParameters} />
        )}{" "}
        = {props.children};
      </Declaration>
    </>
  );
});
