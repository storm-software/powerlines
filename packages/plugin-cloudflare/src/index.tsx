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
import { getCloudflarePreset } from "@cloudflare/unenv-preset";
import { render } from "@powerlines/plugin-alloy/render";
import { readEnvTypeReflection } from "@powerlines/plugin-env/helpers";
import { resolveModule } from "@powerlines/plugin-esbuild/helpers/resolve";
import unenv from "@powerlines/plugin-unenv";
import * as pulumiCloudflare from "@pulumi/cloudflare";
import { omit } from "@stryke/helpers/omit";
import { joinPaths, replaceExtension } from "@stryke/path";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isFunction } from "@stryke/type-checks/is-function";
import defu from "defu";
import { Plugin } from "powerlines";
import { CloudflareEnvBuiltin } from "./components";
import { CloudflareBuiltin } from "./components/cloudflare-builtin";
import { WorkerEntry } from "./components/worker-entry";
import {
  CloudflarePluginContext,
  CloudflarePluginOptions,
  CloudflareWorkerEntryModule
} from "./types/plugin";
import { WorkerModule } from "./types/worker-module";

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
    unenv(options.unenv),
    {
      name: "cloudflare",
      config() {
        return {
          cloudflare: defu(omit(options, ["unenv"]), {}),
          resolve: {
            skipNodeModulesBundle: false
          },
          unenv: {
            presets: [
              getCloudflarePreset({
                compatibilityDate: this.config.compatibilityDate?.toString(),
                compatibilityFlags: ["nodejs_als"]
              })
            ]
          }
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
            this.entry.map(async (entry, i, arr) => {
              if (!entry.input) {
                throw new Error(
                  `Cloudflare Worker entry "${entry.file}" is missing an input file.`
                );
              }

              const workerModule = await resolveModule<WorkerModule>(
                this,
                entry.input
              );
              if (!workerModule?.default) {
                throw new Error(
                  `Cloudflare Worker entry "${
                    entry.file
                  }" does not export a default handler. The Powerlines Cloudflare plugin expects each Worker entry module to export a default object matching the \`ExportedHandler\` interface from "@cloudflare/workers-types".`
                );
              }

              const name =
                workerModule.metadata?.name ||
                replaceExtension(entry.input.file || entry.file) ||
                arr.length > 1
                  ? `${this.config.name}-${i}`
                  : this.config.name;

              return {
                metadata: {
                  name,
                  pattern: `${name}.{domain}`,
                  entry
                },
                fetch: isFunction(workerModule.default.fetch),
                tail: isFunction(workerModule.default.tail),
                trace: isFunction(workerModule.default.trace),
                tailStream: isFunction(workerModule.default.tailStream),
                scheduled: isFunction(workerModule.default.scheduled),
                test: isFunction(workerModule.default.test),
                email: isFunction(workerModule.default.email),
                queue: isFunction(workerModule.default.queue)
              } satisfies CloudflareWorkerEntryModule;
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

        const provider = new pulumiCloudflare.Provider("cloudflare-provider", {
          apiToken
        });

        const zone = await pulumiCloudflare.getZone(
          {
            filter: {
              account: { id: this.config.cloudflare.accountId },
              name: this.config.cloudflare.domain
            }
          },
          { provider }
        );

        const workerScripts = [] as pulumiCloudflare.WorkersScript[];
        const workerRoutes = [] as pulumiCloudflare.WorkersRoute[];
        const dnsRecords = [] as pulumiCloudflare.DnsRecord[];
        for (const worker of this.workers) {
          const workerScript = new pulumiCloudflare.WorkersScript(
            `${this.config.organization ? `${this.config.organization}.` : ""}${
              kebabCase(this.config.name) === kebabCase(worker.metadata.name)
                ? kebabCase(this.config.name)
                : `${kebabCase(this.config.name)}.${kebabCase(
                    worker.metadata.name
                  )}`
            }.${kebabCase(this.config.mode)}.worker-script`,
            defu(
              {
                accountId: this.config.cloudflare.accountId,
                scriptName: worker.metadata.name,
                contentFile: joinPaths(this.config.output.path, "index.js"),
                module: true
              },
              worker.metadata,
              {
                compatibilityDate:
                  this.config.compatibilityDate?.cloudflare?.toString() as string,
                compatibilityFlags: ["nodejs_als"]
              }
            ) as pulumiCloudflare.WorkersScriptArgs,
            { provider }
          );
          workerScripts.push(workerScript);

          const workerRoute = new pulumiCloudflare.WorkersRoute(
            `${this.config.organization ? `${this.config.organization}.` : ""}${
              kebabCase(this.config.name) === kebabCase(worker.metadata.name)
                ? kebabCase(this.config.name)
                : `${kebabCase(this.config.name)}-${kebabCase(
                    worker.metadata.name
                  )}`
            }.${kebabCase(this.config.mode)}.worker-route`,
            defu(
              {
                zoneId: zone.id,
                pattern: worker.metadata.pattern.replace(
                  "{domain}",
                  this.config.cloudflare.domain
                ),
                script: workerScript.scriptName
              },
              worker.metadata
            ),
            { provider }
          );
          workerRoutes.push(workerRoute);

          const dnsRecord = new pulumiCloudflare.DnsRecord(
            `${this.config.organization ? `${this.config.organization}.` : ""}${
              kebabCase(this.config.name) === kebabCase(worker.metadata.name)
                ? kebabCase(this.config.name)
                : `${kebabCase(this.config.name)}-${kebabCase(
                    worker.metadata.name
                  )}`
            }.${kebabCase(this.config.mode)}.dns-record`,
            {
              name: workerRoute.pattern,
              type: "A",
              content: "192.0.2.1",
              zoneId: zone.id,
              proxied: true,
              ttl: 1
            },
            { provider }
          );
          dnsRecords.push(dnsRecord);
        }

        return {
          workerScripts,
          workerRoutes,
          dnsRecords
        };
      }
    }
  ] as Plugin<TContext>[];
}

export default plugin;
