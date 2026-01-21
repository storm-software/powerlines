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

import { code, Show, splitProps } from "@alloy-js/core";
import { TypeDeclaration, VarDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  TSDoc,
  TSDocRemarks
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import {
  EnvBuiltin,
  EnvBuiltinProps
} from "@powerlines/plugin-env/components/env";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import defu from "defu";
import { NodeJsPluginContext } from "../types";

/**
 * Generates the NodeJs environment configuration module for the Powerlines project.
 */
export function NodeJsEnvBuiltin(props: EnvBuiltinProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  const context = usePowerlines<NodeJsPluginContext>();

  return (
    <EnvBuiltin
      {...rest}
      imports={defu(
        {
          "node:os": "os",
          "node:path": ["basename", "join"]
        },
        rest.imports ?? {}
      )}>
      <VarDeclaration
        export
        const
        name="isWindows"
        doc="An indicator specifying whether the current operating system is MacOS (darwin kernel)."
        initializer={code`/^win/i.test(process.platform); `}
      />
      <hbr />
      <hbr />
      <VarDeclaration
        export
        const
        name="isLinux"
        doc="An indicator specifying whether the current operating system is Linux."
        initializer={code`/^linux/i.test(process.platform); `}
      />
      <hbr />
      <hbr />
      <VarDeclaration
        export
        const
        name="isMacOS"
        doc="An indicator specifying whether the current operating system is MacOS (darwin kernel)."
        initializer={code`/^darwin/i.test(process.platform); `}
      />
      <hbr />
      <hbr />
      <VarDeclaration const name="homedir" initializer={code`os.homedir(); `} />
      <hbr />
      <hbr />
      <VarDeclaration const name="tmpdir" initializer={code`os.tmpdir(); `} />
      <hbr />
      <hbr />
      <TSDoc heading="The environment path types for storing things like data, config, logs, and cache in the current runtime environment.">
        <TSDocRemarks>
          {`These environment path types are accessed in the {@link EnvPaths} type. `}
        </TSDocRemarks>
      </TSDoc>
      <TypeDeclaration export name="EnvPathType">
        {code`"data" | "config" | "cache" | "log" | "temp"; `}
      </TypeDeclaration>
      <hbr />
      <hbr />
      <TSDoc heading="The environment paths for storing things like data, config, logs, and cache in the current runtime environment." />
      <TypeDeclaration export name="EnvPaths">
        {code`Record<EnvPathType, string>; `}
      </TypeDeclaration>
      <hbr />
      <hbr />
      <TSDoc heading="The resolved application directories based on the current operating system and environment variables.">
        <TSDocRemarks>
          {code`If the \`DATA_DIR\`, \`CONFIG_DIR\`, \`CACHE_DIR\`, \`LOG_DIR\`, or \`TEMP_DIR\` environment variables are set, they will be treated as overrides and used by default. If the environment variables are not set, the paths are determined based on the specific conventions for each operating system (with additional overrides available through operating system specific environment variables):
          - **Linux**: directories are generally created in \`~/.config/<name>\` (this is determined via the [XDG Base Directory spec](https://specifications.freedesktop.org/basedir-spec/latest/))
          - **Windows**: directories are generally created in \`%AppData%/<name>\`
          - **MacOS**: directories are generally created in \`~/Library/Application Support/<name>\`
          `}
        </TSDocRemarks>
      </TSDoc>
      <VarDeclaration
        export
        const
        name="paths"
        initializer={code`isMacOS
            ? {
              data: String(env.DATA_DIR)
                ? join(String(env.DATA_DIR), "${titleCase(
                  context.config.name
                )}")
                : join(homedir, "Library", "Application Support", "${titleCase(
                  context.config.organization
                )}", "${titleCase(context.config.name)}"),
              config: String(env.CONFIG_DIR)
                ? join(String(env.CONFIG_DIR), "${titleCase(
                  context.config.name
                )}")
                : join(homedir, "Library", "Preferences", "${titleCase(
                  context.config.organization
                )}", "${titleCase(context.config.name)}"),
              cache: String(env.CACHE_DIR)
                ? join(String(env.CACHE_DIR), "${titleCase(
                  context.config.name
                )}")
                : join(homedir, "Library", "Caches", "${titleCase(
                  context.config.organization
                )}", "${titleCase(context.config.name)}"),
              log: String(env.LOG_DIR)
                ? join(String(env.LOG_DIR), "${titleCase(context.config.name)}")
                : join(homedir, "Library", "Logs", "${titleCase(
                  context.config.organization
                )}", "${titleCase(context.config.name)}"),
              temp: String(env.TEMP_DIR)
                ? join(String(env.TEMP_DIR), "${titleCase(
                  context.config.name
                )}")
                : join(tmpdir, "${titleCase(
                  context.config.organization
                )}", "${titleCase(context.config.name)}")
            }
              : isWindows
            ? {
              data: String(env.DATA_DIR)
                ? join(String(env.DATA_DIR), "${titleCase(context.config.name)}")
                : join(env.LOCALAPPDATA || join(homedir, "AppData", "Local"), "${titleCase(context.config.organization)}", "${titleCase(
                  context.config.name
                )}", "Data"),
              config: String(env.CONFIG_DIR)
                ? join(env.CONFIG_DIR!, "${titleCase(context.config.name)}")
                : join(env.APPDATA || join(homedir, "AppData", "Roaming"), "${titleCase(context.config.organization)}", "${titleCase(
                  context.config.name
                )}", "Config"),
              cache: String(env.CACHE_DIR)
                ? join(String(env.CACHE_DIR), "${titleCase(context.config.name)}")
                : join(env.LOCALAPPDATA || join(homedir, "AppData", "Local"), "Cache", "${titleCase(context.config.organization)}", "${titleCase(
                  context.config.name
                )}"),
              log: String(env.LOG_DIR)
                ? join(String(env.LOG_DIR), "${titleCase(context.config.name)}")
                : join(env.LOCALAPPDATA || join(homedir, "AppData", "Local"), "${titleCase(context.config.organization)}", "${titleCase(
                  context.config.name
                )}", "Log"),
              temp: String(env.TEMP_DIR)
                ? join(String(env.TEMP_DIR), "${titleCase(context.config.name)}")
                : join(tmpdir, "${titleCase(context.config.organization)}", "${titleCase(context.config.name)}")
            }
              :
            {
              data: String(env.DATA_DIR)
                ? join(String(env.DATA_DIR), "${kebabCase(context.config.name)}")
                : join(
                    env.XDG_DATA_HOME || join(homedir, ".local", "share"),
                    "${kebabCase(context.config.organization)}",
                    "${kebabCase(context.config.name)}"
                  ),
              config: String(env.CONFIG_DIR)
                ? join(String(env.CONFIG_DIR), "${kebabCase(context.config.name)}")
                : join(
                    env.XDG_CONFIG_HOME || join(homedir, ".config"),
                    "${kebabCase(context.config.organization)}",
                    "${kebabCase(context.config.name)}"
                  ),
              cache: String(env.CACHE_DIR)
                ? join(String(env.CACHE_DIR), "${kebabCase(context.config.name)}")
                : join(env.XDG_CACHE_HOME || join(homedir, ".cache"), "${kebabCase(context.config.organization)}", "${kebabCase(
                  context.config.name
                )}"),
              log: String(env.LOG_DIR)
                ? join(String(env.LOG_DIR), "${kebabCase(context.config.name)}")
                : join(env.XDG_STATE_HOME || join(homedir, ".local", "state"), "${kebabCase(context.config.organization)}", "${kebabCase(
                  context.config.name
                )}"),
              temp: String(env.TEMP_DIR)
                ? join(String(env.TEMP_DIR), "${kebabCase(context.config.name)}")
                : (env.DEVENV_RUNTIME || env.XDG_RUNTIME_DIR
                    ? join((env.DEVENV_RUNTIME || env.XDG_RUNTIME_DIR)!, "${kebabCase(context.config.organization)}", "${kebabCase(
                      context.config.name
                    )}")
                    : join(tmpdir, basename(homedir), "${kebabCase(context.config.organization)}", "${kebabCase(context.config.name)}"))
          } as EnvPaths; `}
      />
      <hbr />
      <hbr />
      <Show when={Boolean(children)}>{children}</Show>
    </EnvBuiltin>
  );
}
