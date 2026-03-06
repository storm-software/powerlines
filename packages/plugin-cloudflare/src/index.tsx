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

import { ExportedHandler } from "@cloudflare/workers-types";
import { render } from "@powerlines/plugin-alloy/render";
import { resolveModule } from "@powerlines/plugin-esbuild/helpers/resolve";
import { isFunction } from "@stryke/type-checks/is-function";
import defu from "defu";
import { For } from "node_modules/@alloy-js/core/dist/src/components/For";
import { Plugin } from "powerlines";
import { CloudflareBuiltin } from "./components/cloudflare-builtin";
import { WorkerEntry } from "./components/worker-entry";
import {
  CloudflarePluginContext,
  CloudflarePluginOptions
} from "./types/plugin";

export * from "./components";
export * from "./types";

declare module "@powerlines/core" {
  interface BaseConfig {
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
        return render(this, <CloudflareBuiltin />);
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
      }
    }
  ] as Plugin<TContext>[];
}

export default plugin;
