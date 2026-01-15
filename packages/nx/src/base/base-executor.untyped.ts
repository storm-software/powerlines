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

import baseExecutorSchema from "@storm-software/workspace-tools/base/base-executor.untyped";
import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "BaseExecutorSchema",
    title: "Base Executor",
    description:
      "A shared/base schema type definition for Powerlines executors",
    required: []
  },
  tsconfig: {
    $schema: {
      title: "TypeScript Configuration File",
      type: "string",
      format: "path",
      description: "The path to the tsconfig file"
    }
  },
  configFile: {
    $schema: {
      title: "Powerlines Configuration File",
      type: "string",
      format: "path",
      description: "The path to the Powerlines configuration file"
    },
    $default: "{projectRoot}/powerlines.config.ts"
  },
  mode: {
    $schema: {
      title: "Mode",
      type: "string",
      description: "The build mode",
      enum: ["development", "test", "production"]
    }
  },
  autoInstall: {
    $schema: {
      title: "Auto Install",
      type: "boolean",
      description: "Automatically install dependencies during prepare stage"
    }
  },
  skipCache: {
    $schema: {
      title: "Skip Cache",
      type: "boolean",
      description:
        "Skip the caching mechanism during the build process (if required)"
    }
  },
  logLevel: {
    $schema: {
      title: "Log Level",
      type: "string",
      description: "The log level to use for the build process",
      enum: [
        "fatal",
        "error",
        "warn",
        "success",
        "info",
        "debug",
        "trace",
        "silent"
      ]
    }
  }
});
