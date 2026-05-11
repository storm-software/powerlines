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

import { Prose, Show } from "@alloy-js/core";
import { code } from "../../core/helpers/code";
import { ComponentProps } from "../../types/components";

export interface BlockDeclarationProps extends ComponentProps {
  type: string;
  label: string | string[];
}

/**
 * A base component representing a block declaration in HCL. The children are rendered as a prose element, which means that they are broken into multiple lines. This component can be used to create more specific block declaration components, such as resource blocks, provider blocks, etc.
 *
 * @see https://developer.hashicorp.com/terraform/language#about-the-terraform-language
 * @see https://opentofu.org/docs/language/attr-as-blocks/#summary
 *
 * @param props - The properties for the source file.
 * @returns The rendered source file component.
 */
export function BlockDeclaration(props: BlockDeclarationProps) {
  const { children, type, label } = props;

  return (
    <>
      {code`${type} ${Array.isArray(label) ? label.join(" ") : label} {`}
      <Prose>
        <Show when={Boolean(children)}>{children}</Show>
      </Prose>
      {code`} `}
    </>
  );
}
