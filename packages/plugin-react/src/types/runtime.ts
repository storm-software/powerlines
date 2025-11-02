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

import { EnvInterface } from "@powerlines/plugin-env/types/runtime";

export interface ReactEnvInterface extends EnvInterface {
  /**
   * Disables the React compiler optimizations when set to true.
   *
   * @remarks
   * This environment variable can be used to turn off the optimizations provided by the React compiler, which may be useful for debugging or development purposes.
   */
  DISABLE_REACT_COMPILER: boolean;
}
