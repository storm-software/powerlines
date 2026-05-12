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

import {
  EnvironmentContext,
  ExecutionContext,
  formatFolder
} from "@powerlines/core";
import { executeEnvironments } from "@powerlines/core/lib/environment";
import { copyFiles } from "@stryke/fs/copy-file";
import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import chalk from "chalk";
import { existsSync } from "node:fs";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";
import { prepare } from "./prepare";

async function handleBuild<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(
  context: ExecutionContext<TResolvedConfig, TSystemContext>,
  env: EnvironmentContext<TResolvedConfig, TSystemContext>
) {
  await context.callHook("build", {
    environment: env,
    order: "pre"
  });

  env.debug(
    "Formatting the generated entry files before the build process starts."
  );
  await formatFolder(env, env.entryPath);

  await context.callHook("build", {
    environment: env,
    order: "normal"
  });

  if (env.config.output.copy) {
    env.debug("Copying project's files from build output directory.");

    const destinationPath = isParentPath(
      appendPath(env.config.output.path, env.config.cwd),
      appendPath(env.config.root, env.config.cwd)
    )
      ? joinPaths(
          env.config.output.copy.path,
          relativePath(
            appendPath(env.config.root, env.config.cwd),
            appendPath(env.config.output.path, env.config.cwd)
          )
        )
      : joinPaths(env.config.output.copy.path, "dist");
    const sourcePath = env.config.output.path;

    if (existsSync(sourcePath) && sourcePath !== destinationPath) {
      env.debug(
        `Copying files from project's build output directory (${
          env.config.output.path
        }) to the project's copy/publish directory (${destinationPath}).`
      );

      await copyFiles(sourcePath, destinationPath);
    } else {
      env.warn(
        `The source path for the copy operation ${
          !existsSync(sourcePath)
            ? "does not exist"
            : "is the same as the destination path"
        }. Source: ${sourcePath}, Destination: ${
          destinationPath
        }. Skipping copying of build output files.`
      );
    }

    if (
      env.config.output.copy.assets &&
      Array.isArray(env.config.output.copy.assets)
    ) {
      await Promise.all(
        env.config.output.copy.assets.map(async asset => {
          env.trace(
            `Copying asset(s): ${chalk.redBright(
              env.config.cwd === asset.input
                ? asset.glob
                : appendPath(
                    asset.glob,
                    replacePath(asset.input, env.config.cwd)
                  )
            )} -> ${chalk.greenBright(
              appendPath(asset.glob, replacePath(asset.output, env.config.cwd))
            )} ${
              Array.isArray(asset.ignore) && asset.ignore.length > 0
                ? ` (ignoring: ${asset.ignore
                    .map(i => chalk.yellowBright(i))
                    .join(", ")})`
                : ""
            }`
          );

          await env.fs.copy(asset, asset.output);
        })
      );
    }
  } else {
    env.debug(
      "No copy configuration found for the project output. Skipping the copying of build output files."
    );
  }

  await context.callHook("build", {
    environment: env,
    order: "post"
  });
}

/**
 * Build the project
 *
 * @param context - The execution context for the build process, which provides access to the project configuration, environment, and utility functions for performing the build. The context is used to manage the state and behavior of the build process, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
 */
export async function build<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(context: ExecutionContext<TResolvedConfig, TSystemContext>) {
  const timer = context.timer("Building");

  await context.generateChecksum();
  if (
    context.meta.checksum !== context.persistedMeta?.checksum ||
    context.config.skipCache
  ) {
    context.info(
      !context.persistedMeta?.checksum
        ? "No previous build cache found. Preparing the project for the initial build."
        : context.meta.checksum !== context.persistedMeta.checksum
          ? "The project has been modified since the last time `prepare` was ran. Re-preparing the project."
          : "The project is configured to skip cache. Re-preparing the project."
    );

    await prepare<TResolvedConfig, TSystemContext>(context);
  }

  if (context.config.singleBuild) {
    await handleBuild<TResolvedConfig, TSystemContext>(
      context,
      await context.toEnvironment()
    );
  } else {
    await executeEnvironments(context, async env => {
      await handleBuild<TResolvedConfig, TSystemContext>(context, env);
    });
  }

  timer();
}
