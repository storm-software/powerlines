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

import { Show, splitProps } from "@alloy-js/core";
import { PartialKeys } from "@stryke/types/base";
import { HCLFile, HCLFileProps } from "./hcl-file";

export type TerraformFileProps = PartialKeys<HCLFileProps, "filetype">;

/**
 * A base component representing a Powerlines generated [Terraform](https://developer.hashicorp.com/terraform/language) or [OpenTofu](https://opentofu.org/docs/language/) source file.
 *
 * @see https://developer.hashicorp.com/terraform
 * @see https://opentofu.org
 *
 * @param props - The properties for the source file.
 * @returns The rendered source file component.
 */
export function TerraformFile(props: TerraformFileProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  return (
    <HCLFile filetype="tf" {...rest}>
      <Show when={Boolean(children)}>{children}</Show>
    </HCLFile>
  );
}
