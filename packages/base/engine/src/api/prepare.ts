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

import type { ExecutionContext } from "@powerlines/core";
import { executeEnvironments } from "@powerlines/core/lib/environment";
import { handleTypes } from "@powerlines/core/lib/generate-types";
import { installDependencies } from "@powerlines/core/lib/install-dependencies";
import { writeMetaFile } from "@powerlines/core/lib/meta";
import {
  initializeTsconfig,
  resolveTsconfig
} from "@powerlines/core/lib/typescript/tsconfig";
import { formatFolder } from "@powerlines/core/lib/utilities/format";
import { formatConfig } from "@powerlines/core/plugin-utils";
import { toArray } from "@stryke/convert/to-array";
import { createDirectory } from "@stryke/fs/helpers";
import { isObject } from "@stryke/type-checks/is-object";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";

/**
 * Prepare the project
 *
 * @param context - The execution context for the build process, which provides access to the project configuration, environment, and utility functions for performing the build. The context is used to manage the state and behavior of the build process, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
 */
export async function prepare<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(
  context: ExecutionContext<TResolvedConfig, TSystemContext>,
  skipTypes = false
) {
  const timer = context.timer("Preparation");

  await executeEnvironments(context, async env => {
    env.debug(
      `Initializing the processing options for the Powerlines project.`
    );

    await context.callHook("configResolved", {
      environment: env,
      order: "pre"
    });

    await initializeTsconfig<TResolvedConfig, TSystemContext>(env);

    await context.callHook("configResolved", {
      environment: env,
      order: "normal"
    });

    if (env.entry.length > 0) {
      env.debug(
        `The configuration provided ${
          isObject(env.config.input)
            ? Object.keys(env.config.input).length
            : toArray(env.config.input).length
        } entry point(s), Powerlines has found ${
          env.entry.length
        } entry files(s) for the ${env.config.title} project${
          env.entry.length > 0 && env.entry.length < 10
            ? `: \n${env.entry
                .map(
                  entry =>
                    `- ${entry.file}${
                      entry.output ? ` -> ${entry.output}` : ""
                    }`
                )
                .join(" \n")}`
            : ""
        }`
      );
    } else {
      env.warn(
        `No entry files were found for the ${
          env.config.title
        } project. Please ensure this is correct. Powerlines plugins generally require at least one entry point to function properly.`
      );
    }

    await resolveTsconfig<TResolvedConfig, TSystemContext>(env);
    await installDependencies(env);

    await context.callHook("configResolved", {
      environment: env,
      order: "post"
    });

    env.trace({
      meta: {
        category: "config"
      },
      message: `Powerlines configuration after configResolved hook: \n${formatConfig(
        env.config
      )}`
    });

    if (!env.fs.existsSync(env.cachePath)) {
      await createDirectory(env.cachePath);
    }

    if (!env.fs.existsSync(env.dataPath)) {
      await createDirectory(env.dataPath);
    }

    await context.callHook("prepare", {
      environment: env,
      order: "pre"
    });
    await context.callHook("prepare", {
      environment: env,
      order: "normal"
    });

    await context.callHook("prepare", {
      environment: env,
      order: "post"
    });

    if (!skipTypes && env.config.output.types !== false) {
      await handleTypes(context, env);
    }

    context.debug("Formatting files generated during the prepare step.");

    await Promise.all([
      formatFolder(env, env.builtinsPath),
      formatFolder(env, env.entryPath)
    ]);

    await writeMetaFile(env);
    env.persistedMeta = env.meta;
  });

  timer();
}
