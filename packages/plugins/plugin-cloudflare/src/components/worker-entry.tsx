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

import { code, computed, Show, splitProps } from "@alloy-js/core";
import { Spacing } from "@powerlines/plugin-alloy/core/components";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts";
import {
  EntryFile,
  EntryFileProps
} from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { murmurhash } from "@stryke/hash";
import { relativePath } from "@stryke/path/find";
import { replaceExtension } from "@stryke/path/replace";
import defu from "defu";
import { CloudflarePluginContext, CloudflareWorkerEntryModule } from "../types";

export type WorkerEntryProps = Partial<EntryFileProps> &
  Omit<EntryFileProps, "path"> & {
    worker: CloudflareWorkerEntryModule;
  };

/**
 * Generates a [Cloudflare Worker](https://developers.cloudflare.com/workers/runtime-apis/handlers/) entry module for the Powerlines project, providing a runtime context and utilities for integrating with Cloudflare services. This module defines a `CloudflareContext` interface, an `AsyncLocalStorage` instance for managing the context, and helper functions for retrieving and running code within the context. The generated module is designed to be used as a built-in file within the Powerlines environment, allowing developers to easily access Cloudflare-specific functionality in their applications.
 */
export function WorkerEntry(props: WorkerEntryProps) {
  const [{ worker, children, imports, builtinImports }, rest] = splitProps(
    props,
    ["worker", "children", "imports", "builtinImports"]
  );

  const context = usePowerlines<CloudflarePluginContext>();
  const entryPath = computed(
    () =>
      `./${replaceExtension(
        relativePath(
          context.entryPath,
          worker.metadata.entry.input?.file || worker.metadata.entry.file
        )
      )}`
  );

  return (
    <EntryFile
      path={`worker-${murmurhash(worker.metadata.entry, {
        maxLength: 8
      })}-entry.ts`}
      {...rest}
      imports={defu(
        {
          "@cloudflare/workers-types": [
            { name: "Request", type: true },
            { name: "Response", type: true },
            { name: "ExecutionContext", type: true },
            { name: "IncomingRequestCfProperties", type: true },
            { name: "ScheduledController", type: true },
            { name: "ForwardableEmailMessage", type: true },
            { name: "MessageBatch", type: true },
            { name: "TailStream", type: true },
            { name: "TraceItem", type: true },
            { name: "TailStream.TailEvent", type: true },
            { name: "TailStream.Onset", type: true },
            { name: "TailStream.TailEventHandlerType", type: true }
          ],
          [entryPath.value]: "worker"
        },
        imports ?? {}
      )}
      builtinImports={defu(
        {
          cloudflare: [
            "withFetchContext",
            "withTailContext",
            "withTraceContext",
            "withTailStreamContext",
            "withScheduledContext",
            "withTestContext",
            "withEmailContext",
            "withQueueContext"
          ]
        },
        builtinImports ?? {}
      )}>
      {code`export default { `}
      <hbr />
      <Show when={worker.fetch}>
        {code` async fetch(request: Request<CfHostMetadata, IncomingRequestCfProperties<CfHostMetadata>>, env: CloudflareBindings, ctx: ExecutionContext): Promise<Response> {
        return await withFetchContext({ request, env, ctx }, async (context) => {
          return worker.fetch(context.request, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.tail}>
        {code` async tail(events: TraceItem[], env: CloudflareBindings, ctx: ExecutionContext): Promise<void> {
        return withTailContext({ events, env, ctx }, async (context) => {
          return worker.tail(context.events, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.trace}>
        {code` async trace(traces: TraceItem[], env: CloudflareBindings, ctx: ExecutionContext): Promise<void> {
        return withTraceContext({ traces, env, ctx }, async (context) => {
          return worker.trace(context.traces, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.tailStream}>
        {code` async tailStream(event: TailStream.TailEvent<TailStream.Onset>, env: CloudflareBindings, ctx: ExecutionContext): Promise<ReadableStream> {
        return await withTailStreamContext({ event, env, ctx }, async (context) => {
          return await worker.tailStream(context.event, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.scheduled}>
        {code` async scheduled(controller: ScheduledController, env: CloudflareBindings, ctx: ExecutionContext): Promise<void> {
        return withScheduledContext({ controller, env, ctx }, async (context) => {
          return worker.scheduled(context.controller, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.test}>
        {code` async test(controller: TestController, env: CloudflareBindings, ctx: ExecutionContext): Promise<void> {
        return withTestContext({ controller, env, ctx }, async (context) => {
          return worker.test(context.controller, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.email}>
        {code` async email(message: ForwardableEmailMessage, env: CloudflareBindings, ctx: ExecutionContext): Promise<void> {
        return withEmailContext({ message, env, ctx }, async (context) => {
          return worker.email(context.message, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      <Show when={worker.queue}>
        {code` async queue(batch: MessageBatch, env: CloudflareBindings, ctx: ExecutionContext): Promise<void> {
        return withQueueContext({ batch, env, ctx }, async (context) => {
          return worker.queue(context.batch, context.env, context.ctx);
        });
      }, `}
      </Show>
      <hbr />
      {code` } satisfies ExportedHandler<CloudflareBindings>; `}
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </EntryFile>
  );
}
