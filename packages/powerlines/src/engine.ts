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

import { PowerlinesEngine as InternalPowerlinesEngine } from "@powerlines/engine";
import packageJson from "../package.json" with { type: "json" };
import type { EngineOptions } from "./types";

/**
 * The Powerlines Engine class
 *
 * @remarks
 * This class is responsible for managing the Powerlines project lifecycle, including initialization, building, and finalization.
 *
 * @public
 */
export class PowerlinesEngine extends InternalPowerlinesEngine {
  /**
   * Initialize a Powerlines Engine instance
   *
   * @param options - The options to initialize the context with
   * @returns A new instance of the Powerlines Engine
   */
  public static override async init(
    options: EngineOptions
  ): Promise<PowerlinesEngine> {
    const engine = await InternalPowerlinesEngine.init(options);

    engine.context.info(
      `🔌 The Powerlines Engine v${packageJson.version} has started`
    );

    return engine;
  }
}
