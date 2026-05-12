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

import { ExecutionContext } from "@powerlines/core";
import { executeEnvironments } from "@powerlines/core/lib/environment";
import { listFiles } from "@stryke/fs/list-files";
import { joinPaths } from "@stryke/path/join";
import Handlebars from "handlebars";
import { EngineResolvedConfig } from "../types/config";
import { EngineSystemContext } from "../types/context";
import { prepare } from "./prepare";

/**
 * Create a new Powerlines project
 *
 * @param context - The execution context for the create process, which provides access to the project configuration, environment, and utility functions for performing the create operation. The context is used to manage the state and behavior of the create process, allowing for hooks to be called at different stages of the create and for environment-specific configurations to be applied.
 */
export async function create<
  TResolvedConfig extends EngineResolvedConfig,
  TSystemContext extends EngineSystemContext
>(context: ExecutionContext<TResolvedConfig, TSystemContext>) {
  const timer = context.timer("Create a New Project Generation");

  await prepare<TResolvedConfig, TSystemContext>(context, true);
  await executeEnvironments(context, async env => {
    env.debug("Initializing the processing options for the project.");

    await context.callHook("create", {
      environment: env,
      order: "pre"
    });

    const files = await listFiles(
      joinPaths(env.powerlinesPath, "files/common/**/*.hbs")
    );
    for (const file of files) {
      env.trace(`Adding template file to project: ${file}`);

      const template = Handlebars.compile(file);
      await env.fs.write(
        joinPaths(env.config.root, file.replace(".hbs", "")),
        template(env)
      );
    }

    await context.callHook("create", {
      environment: env,
      order: "normal"
    });

    if (env.config.projectType === "application") {
      const appFiles = await listFiles(
        joinPaths(env.powerlinesPath, "files/application/**/*.hbs")
      );
      for (const file of appFiles) {
        env.trace(`Adding application template file: ${file}`);

        const template = Handlebars.compile(file);
        await env.fs.write(
          joinPaths(env.config.root, file.replace(".hbs", "")),
          template(env)
        );
      }
    } else {
      const libFiles = await listFiles(
        joinPaths(env.powerlinesPath, "files/library/**/*.hbs")
      );
      for (const file of libFiles) {
        env.trace(`Adding library template file: ${file}`);

        const template = Handlebars.compile(file);
        await env.fs.write(
          joinPaths(env.config.root, file.replace(".hbs", "")),
          template(env)
        );
      }
    }

    await context.callHook("create", {
      environment: env,
      order: "post"
    });
  });

  timer();
}
