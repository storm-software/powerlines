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

import type { EngineOptions } from "@powerlines/engine";
import { createEngine } from "@powerlines/engine";
import { titleCase } from "@stryke/string-format/title-case";
import packageJson from "../package.json" with { type: "json" };

export type * from "@powerlines/engine";
export type * from "@powerlines/engine/context";

/**
 * Creates a new {@link PowerlinesEngine} instance.
 *
 * @param options - The user configuration options.
 * @returns A promise that resolves to a {@link PowerlinesEngine} instance.
 */
export async function createPowerlines(
  options: Omit<EngineOptions, "framework">
) {
  const engine = await createEngine(options);

  engine.context.info(
    `🔌 ${titleCase(engine.context.framework.name) || "Powerlines"} Engine v${
      engine.context.framework.version || packageJson.version || "1.0.0"
    } is running...`
  );

  return engine;
}
