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

import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "BaseExecutorSchema",
    title: "Base Executor",
    description:
      "A shared/base schema type definition for Powerlines executors",
    required: []
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
  input: {
    $schema: {
      title: "Input Entry File(s)",
      format: "path",
      type: "array",
      description: "The entry file(s) that serve as the input for the project",
      items: { type: "string" }
    },
    $default: ["{sourceRoot}/index.ts"]
  },
  tsconfig: {
    $schema: {
      title: "TSConfig Path",
      type: "string",
      format: "path",
      description: "The path to the tsconfig file"
    },
    $default: "{projectRoot}/tsconfig.json"
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The path to the output directory for the build artifacts"
    }
  },
  sourceMap: {
    $schema: {
      title: "Sourcemap",
      type: "boolean",
      description: "Generate a sourcemap"
    }
  },
  format: {
    $schema: {
      title: "Format",
      type: "array",
      description: "The format to build",
      items: {
        type: "string",
        enum: ["cjs", "esm", "iife"]
      }
    },
    $resolve: (val: string[] = ["cjs", "esm"]) => ([] as string[]).concat(val)
  },
  platform: {
    $schema: {
      title: "Platform",
      type: "string",
      description: "The platform to build",
      enum: ["neutral", "node", "browser"]
    },
    $default: "neutral"
  },
  external: {
    $schema: {
      title: "External",
      type: "array",
      description: "The external dependencies"
    },
    $resolve: (val: string[] = []) => ([] as string[]).concat(val)
  },
  noExternal: {
    $schema: {
      title: "No External",
      type: "array",
      description: "The dependencies that should not be treated as external"
    },
    $resolve: (val: string[] = []) => ([] as string[]).concat(val)
  },
  skipNodeModulesBundle: {
    $schema: {
      title: "Skip Node Modules Bundle",
      type: "boolean",
      description:
        "Skip bundling node_modules during the build process (if required)"
    }
  },
  mode: {
    $schema: {
      title: "Mode",
      type: "string",
      description: "The build mode",
      enum: ["development", "test", "production"]
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
  },
  define: {
    $schema: {
      title: "Define",
      type: "object",
      tsType: "Record<string, string>",
      description: "The `define` values"
    },
    $resolve: (val: Record<string, string> = {}) => val,
    $default: {}
  }
});
