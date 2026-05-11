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

import { defaultProps, splitProps } from "@alloy-js/core";
import { CallSignatureProps } from "@alloy-js/typescript";

/**
 * Get the properties for a call signature, applying any defaults as necessary.
 *
 * @param props - The properties for the call signature.
 * @param defaults - Optional default properties to apply to the call signature.
 * @returns The properties for the call signature, with defaults applied as necessary.
 */
export function getCallSignatureProps(
  props: CallSignatureProps,
  defaults?: Partial<CallSignatureProps>
) {
  const [callSignatureProps] = splitProps(props, [
    "parameters",
    "parametersChildren",
    "typeParameters",
    "typeParametersChildren",
    "returnType"
  ]);

  if (!defaults) {
    return callSignatureProps;
  }

  return defaultProps(callSignatureProps, defaults);
}
