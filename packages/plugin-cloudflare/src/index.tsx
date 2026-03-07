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

import { For } from "@alloy-js/core";
import { ExportedHandler } from "@cloudflare/workers-types";
import { render } from "@powerlines/plugin-alloy/render";
import { readEnvTypeReflection } from "@powerlines/plugin-env/helpers";
import { resolveModule } from "@powerlines/plugin-esbuild/helpers/resolve";
import * as pulumiCloudflare from "@pulumi/cloudflare";
import { joinPaths } from "@stryke/path";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isFunction } from "@stryke/type-checks/is-function";
import defu from "defu";
import { Plugin } from "powerlines";
import { CloudflareEnvBuiltin } from "./components";
import { CloudflareBuiltin } from "./components/cloudflare-builtin";
import { WorkerEntry } from "./components/worker-entry";
import {
  CloudflarePluginContext,
  CloudflarePluginOptions
} from "./types/plugin";

export * from "./components";
export type * from "./types";

declare module "powerlines" {
  interface Config {
    cloudflare?: CloudflarePluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export function plugin<
  TContext extends CloudflarePluginContext = CloudflarePluginContext
>(options: CloudflarePluginOptions = {}) {
  return [
    {
      name: "cloudflare",
      config() {
        return {
          cloudflare: defu(options, {})
        };
      },
      configResolved() {
        this.devDependencies["@cloudflare/workers-types"] = "^4.20240616.0";
      },
      async prepare() {
        const result = await readEnvTypeReflection(this, "env");

        return render(
          this,
          <>
            <CloudflareBuiltin />
            <CloudflareEnvBuiltin reflection={result} />
          </>
        );
      },
      build: {
        order: "pre",
        async handler() {
          this.workers = await Promise.all(
            this.entry.map(async entry => {
              if (!entry.input) {
                throw new Error(
                  `Cloudflare Worker entry "${entry.name}" is missing an input file.`
                );
              }

              const workerModule = await resolveModule<{
                default: ExportedHandler;
              }>(this, entry.input);
              if (!workerModule?.default) {
                throw new Error(
                  `Cloudflare Worker entry "${
                    entry.name
                  }" does not export a default handler. The Powerlines Cloudflare plugin expects each Worker entry module to export a default object matching the \`ExportedHandler\` interface from "@cloudflare/workers-types".`
                );
              }

              return {
                entry,
                fetch: isFunction(workerModule.default.fetch),
                tail: isFunction(workerModule.default.tail),
                trace: isFunction(workerModule.default.trace),
                tailStream: isFunction(workerModule.default.tailStream),
                scheduled: isFunction(workerModule.default.scheduled),
                test: isFunction(workerModule.default.test),
                email: isFunction(workerModule.default.email),
                queue: isFunction(workerModule.default.queue)
              };
            })
          );

          return render(
            this,
            <For each={this.workers}>
              {worker => <WorkerEntry worker={worker} />}
            </For>
          );
        }
      },
      async deployPulumi() {
        let apiToken = process.env.CLOUDFLARE_API_TOKEN;
        if (!apiToken) {
          apiToken = this.config.cloudflare.apiToken;
          if (apiToken) {
            this.warn(
              "If possible, please use the `CLOUDFLARE_API_TOKEN` environment variable instead of using the `apiToken` option directly. The `apiToken` option will work; however, this is a less secure method of configuration."
            );
          } else {
            throw new Error(
              "Unable to determine the Cloudflare API token. Please set the `CLOUDFLARE_API_TOKEN` environment variable."
            );
          }
        }

        await this.pulumi.setConfig("cloudflare:apiToken", {
          value: apiToken
        });

        const worker = new pulumiCloudflare.WorkersScript(
          `${kebabCase(this.config.name)}-worker`,
          {
            accountId: this.config.cloudflare.accountId,
            scriptName:
              this.config.cloudflare.scriptName || kebabCase(this.config.name),
            contentFile: joinPaths(this.config.output.outputPath, "index.js")
          }
        );

        return {
          worker
        };
      }
    }
  ] as Plugin<TContext>[];
}

export default plugin;
