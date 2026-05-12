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

import { executeEnvironments } from "@powerlines/core/lib/environment";
import { handleTypes } from "@powerlines/core/lib/generate-types";
import { installDependencies } from "@powerlines/core/lib/install-dependencies";
import { writeMetaFile } from "@powerlines/core/lib/meta";
import {
  initializeTsconfig,
  resolveTsconfig
} from "@powerlines/core/lib/typescript/tsconfig";
import { format } from "@powerlines/core/lib/utilities/format";
import { ExecutionContext } from "@powerlines/core/types/context";
import { formatLogMessage } from "@storm-software/config-tools/logger";
import { toArray } from "@stryke/convert/to-array";
import { createDirectory } from "@stryke/fs/helpers";
import { omit } from "@stryke/helpers/omit";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";
import { prepare } from "./prepare";

/**
 * Generate runtime types for the Powerlines project.
 *
 * @remarks
 * This function is responsible for generating TypeScript declaration files based on the project's configuration and environment. It executes hooks at various stages of the type generation process, allowing for customization and extension by plugins. The generated types are formatted and written to the appropriate location in the project's file system, ensuring that they are available for use by other parts of the Powerlines system and by end-users of the project.
 *
 * @param context - The execution context for the build process, which provides access to the project configuration, environment, and utility functions for performing the build. The context is used to manage the state and behavior of the build process, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
 */
export async function types<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(context: ExecutionContext<TResolvedConfig, TSystemContext>) {
  const timer = context.timer("Type Generation");
  context.debug(
    " Aggregating configuration options for the Powerlines project"
  );

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

    context.trace(
      `Powerlines configuration has been resolved: \n\n${formatLogMessage({
        ...env.config,
        userConfig: isSetObject(env.config.userConfig)
          ? omit(env.config.userConfig, ["plugins"])
          : undefined,
        inlineConfig: isSetObject(env.config.inlineConfig)
          ? env.config.inlineConfig
          : undefined,
        plugins: env.plugins.map(plugin => plugin.name)
      })}`
    );

    if (!env.fs.existsSync(env.cachePath)) {
      await createDirectory(env.cachePath);
    }

    if (!env.fs.existsSync(env.dataPath)) {
      await createDirectory(env.dataPath);
    }

    if (
      env.config.skipCache === true ||
      env.persistedMeta?.checksum !== env.meta.checksum
    ) {
      env.debug(
        `Using previously prepared files as the meta checksum has not changed.`
      );
    } else {
      env.info(
        `Running \`prepare\` command as the meta checksum has changed since the last run.`
      );

      await prepare(context, true);
    }

    await handleTypes(context, env);

    context.debug("Formatting files generated during the types step.");

    await format(env, env.typesPath, (await env.fs.read(env.typesPath)) ?? "");

    await writeMetaFile(env);
    env.persistedMeta = env.meta;
  });

  timer();
}
