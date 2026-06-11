/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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
import { Level, Mode } from "@powerlines/deepkit/vendor/type-compiler/config";
import { SerializedTypes as CapnpSerializedTypes } from "../schemas/reflection";

export interface ReflectionConfig {
  /**
   * Allows to exclude type definitions/TS files from being included in the type compilation step. When a global .d.ts is matched, their types won't be embedded (useful to exclude DOM for example)
   */
  exclude?: string[];

  /**
   * Either a boolean indication general reflection mode, or a list of globs to match against.
   *
   * @remarks
   * - `default`: The default reflection mode, which includes a standard set of type information in the output.
   * - `true`: An alias for "default", enabling the default reflection mode.
   * - `false`: Disables reflection, resulting in no type information being included in the output.
   * - `string[]`: A list of glob patterns to match against files for which reflection should be applied. Only files matching these patterns will have type information included in the output.
   *
   * @defaultValue "default"
   */
  reflection?: string[] | Mode;

  /**
   * Defines the level of reflection to be used during the transpilation process.
   *
   * @remarks
   * The level determines how much extra data is captured in the byte code for each type. This can be one of the following values:
   * - `minimal` - Only the essential type information is captured. (only "hidden", "ignore" and "internal", "readonly")
   * - `default` - Additional type information is captured, including some contextual data. (adds "alias" and "runtime")
   * - `extended` - Even more detailed type information is captured, including extended contextual data. (adds "permissions" and "domain")
   * - `all` - All available type information is captured, including detailed contextual data. (adds "title" and "description")
   */
  level?: Level;
}

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
