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

import { ReflectionClass } from "@powerlines/deepkit/vendor/type";
import type { SerializedTypes as CapnpSerializedTypes } from "../schemas/reflection";

export type Reflection<T extends Record<string, any> = Record<string, any>> =
  ReflectionClass<T> & {
    dataBuffer?: ArrayBuffer;
    messageRoot?: CapnpSerializedTypes;
  };
export type ReflectionRecord<
  T extends Record<string, any> = Record<string, any>
> = Record<string, Reflection<T>>;

export interface ContextReflectionRecord<
  T extends Record<string, any> = Record<string, any>
> extends Record<string, Reflection<T> | ContextReflectionRecord<T>> {}
