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

import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import babel from "@powerlines/plugin-babel";
import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { joinPaths } from "@stryke/path/join";
import { constantCase } from "@stryke/string-format/constant-case";
import defu from "defu";
import type { Plugin, UnresolvedContext } from "powerlines";
import { getDocsOutputPath } from "powerlines/plugin-utils";
import type { UserConfig as ViteUserConfig } from "vite";
import { envBabelPlugin } from "./babel/plugin";
import { EnvDocsFile } from "./components/docs";
import { EnvBuiltin } from "./components/env-builtin";
import { env } from "./helpers/automd-generator";
import {
  extractEnvSchema,
  getDefaultSecretsTypeDefinition,
  getDefaultVarsTypeDefinition,
  readActiveEnv,
  writeActiveEnv
} from "./helpers/schema";
import type { EnvPluginContext, EnvPluginOptions } from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  interface Config {
    env?: EnvPluginOptions;
  }
}

/**
 * A Powerlines plugin to inject environment variables into the source code.
 */
export const plugin = <TContext extends EnvPluginContext = EnvPluginContext>(
  options: EnvPluginOptions = {}
) => {
  return [
    babel(options.babel),
    {
      name: "env",
      async config() {
        this.debug(
          "Providing default configuration for the Powerlines `env` build plugin."
        );

        const config = {
          env: defu(options, {
            validate: false,
            inject: false,
            prefix: []
          }),
          babel: {
            ...options.babel,
            skipTransform: !options.inject,
            plugins: [envBabelPlugin]
          }
        };

        if (!config.env.vars) {
          this.warn(
            "The `env.vars` configuration parameter was not provided. Please ensure this is expected."
          );

          config.env.vars = await getDefaultVarsTypeDefinition(
            this as UnresolvedContext
          );
        }

        if (!config.env.secrets) {
          config.env.secrets = await getDefaultSecretsTypeDefinition(
            this as UnresolvedContext
          );
        }

        config.env.prefix = toArray(
          (config.env.prefix ?? []) as string[]
        ).reduce(
          (ret: string[], prefix: string) => {
            const formattedPrefix = constantCase(prefix);
            if (!ret.includes(formattedPrefix)) {
              ret.push(formattedPrefix);
            }

            return ret;
          },
          [
            "POWERLINES_",
            this.config.framework?.name &&
              this.config.framework?.name !== "powerlines" &&
              `${constantCase(this.config.framework?.name)}_`
          ].filter(Boolean) as string[]
        );

        config.env.prefix = getUnique(
          toArray(config.env.prefix).reduce((ret, prefix) => {
            if (!ret.includes(prefix.replace(/_$/g, ""))) {
              ret.push(prefix.replace(/_$/g, ""));
            }
            return ret;
          }, [] as string[])
        );

        return config;
      },
      async configResolved() {
        this.debug(
          `Environment plugin configuration has been resolved for the Powerlines project.`
        );

        await extractEnvSchema(this, options);
      },
      async prepare() {
        this.debug(
          `Preparing the Environment runtime artifacts for the Powerlines project.`
        );

        await readActiveEnv(this);

        return render(
          this,
          <EnvBuiltin defaultConfig={this.config.env.defaultConfig} />
        );
      },
      async docs() {
        this.debug(
          `Documenting environment variables configuration values in "${joinPaths(
            getDocsOutputPath(this.config.root),
            "env.md"
          )}"`
        );

        await readActiveEnv(this);

        return render(this, <EnvDocsFile levelOffset={0} />);
      },
      async buildEnd() {
        this.debug("Writing active environment variables to disk.");

        await writeActiveEnv(this);
      }
    },
    {
      name: "env:automd-generator",
      configResolved() {
        return {
          automd: defu(options.automd ?? {}, {
            generators: {
              env: env(this)
            }
          })
        };
      }
    },
    {
      name: "env:vite",
      vite: {
        configResolved(this: TContext) {
          return {
            envPrefix: this.config?.env?.prefix
          } as ViteUserConfig;
        }
      }
    },
    automd(options.automd)
  ] as Plugin<TContext>[];
};

export default plugin;
