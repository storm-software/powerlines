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
import { FunctionDeclaration, VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components";
import {
  BuiltinFile,
  BuiltinFileProps
} from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  InterfaceDeclaration,
  InterfaceMember
} from "@powerlines/plugin-alloy/typescript/components/interface-declaration";
import {
  TSDoc,
  TSDocParam,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import defu from "defu";

export type CloudflareBuiltinProps = Partial<BuiltinFileProps> &
  Omit<BuiltinFileProps, "id" | "description">;

/**
 * Generates the Cloudflare environment configuration module for the Powerlines project.
 */
export function CloudflareBuiltin(props: CloudflareBuiltinProps) {
  const [{ imports, children }, rest] = splitProps(props, [
    "imports",
    "children"
  ]);

  return (
    <BuiltinFile
      id="cloudflare"
      description="A set of helpful runtime utilities for integrating Cloudflare services."
      {...rest}
      imports={defu(
        {
          "node:async_hooks": ["AsyncLocalStorage"],
          "@cloudflare/workers-types": [
            { name: "Request", type: true },
            { name: "Response", type: true },
            { name: "ExecutionContext", type: true },
            { name: "CloudflareBindings", type: true },
            { name: "IncomingRequestCfProperties", type: true },
            { name: "ScheduledController", type: true },
            { name: "ForwardableEmailMessage", type: true },
            { name: "MessageBatch", type: true },
            { name: "TailStream", type: true },
            { name: "TraceItem", type: true },
            { name: "TailStream.TailEvent", type: true },
            { name: "TailStream.Onset", type: true },
            { name: "TailStream.TailEventHandlerType", type: true }
          ]
        },
        imports ?? {}
      )}>
      <VarDeclaration
        const
        name="globalContextStorage"
        initializer={code`globalThis as unknown as Record<PropertyKey, unknown>; `}
      />
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareFetchContext"
        typeParameters={[
          { name: "Env", default: "CloudflareBindings" },
          { name: "CfHostMetadata", default: "unknown" }
        ]}
        doc="An interface representing the runtime context for Cloudflare operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="request"
          type="Request<CfHostMetadata, IncomingRequestCfProperties<CfHostMetadata>>"
          doc="The incoming Cloudflare request."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the incoming request."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_FETCH_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-fetch"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="fetchContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare fetch context."
        initializer={code`(globalContextStorage[CLOUDFLARE_FETCH_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareFetchContext>()) as AsyncLocalStorage<CloudflareFetchContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare fetch context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare fetch context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getFetchContext"
        typeParameters={[
          { name: "Env", default: "CloudflareBindings" },
          { name: "CfHostMetadata", default: "unknown" }
        ]}
        parameters={[]}
        returnType="CloudflareFetchContext<Env, CfHostMetadata>">
        {code`const context = fetchContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare fetch context is not available. Ensure that you are calling this function within the scope of a Cloudflare fetch request.");
}
return context as CloudflareFetchContext<Env, CfHostMetadata>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare fetch context. This is typically used to set up the context for handling a Cloudflare fetch request, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getFetchContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare fetch context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withFetchContext"
        typeParameters={[
          { name: "Env", default: "CloudflareBindings" },
          { name: "CfHostMetadata", default: "unknown" }
        ]}
        parameters={[
          {
            name: "context",
            type: "CloudflareFetchContext<Env, CfHostMetadata>"
          },
          {
            name: "callback",
            type: "(request: Request<CfHostMetadata, IncomingRequestCfProperties<CfHostMetadata>>, env: Env, ctx: ExecutionContext) => Promise<Response>"
          }
        ]}
        returnType="Promise<Response>">
        {code`return fetchContextStorage.run(context, () => callback(context.request, context.env, context.ctx)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareScheduledContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        doc="An interface representing the runtime context for Cloudflare scheduled operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="controller"
          type="ScheduledController"
          doc="The Cloudflare scheduled controller for the scheduled operation."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the scheduled operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_SCHEDULED_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-scheduled"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="scheduledContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare scheduled runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_SCHEDULED_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareScheduledContext>()) as AsyncLocalStorage<CloudflareScheduledContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare scheduled runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare scheduled runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getScheduledContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[]}
        returnType="CloudflareScheduledContext<Env>">
        {code`const context = scheduledContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare scheduled context is not available. Ensure that you are calling this function within the scope of a Cloudflare scheduled operation.");
}
return context as CloudflareScheduledContext<Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare scheduled context. This is typically used to set up the context for handling a Cloudflare scheduled operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getScheduledContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare scheduled context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withScheduledContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[
          {
            name: "context",
            type: "CloudflareScheduledContext<Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareScheduledContext<Env>) => Promise<void>"
          }
        ]}
        returnType="Promise<void>">
        {code`return scheduledContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareEmailContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        doc="An interface representing the runtime context for Cloudflare email operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="message"
          type="ForwardableEmailMessage"
          doc="The Cloudflare email instance for the email operation."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the email operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_EMAIL_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-email"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="emailContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare email runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_EMAIL_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareEmailContext>()) as AsyncLocalStorage<CloudflareEmailContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare email runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare email runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getEmailContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[]}
        returnType="CloudflareEmailContext<Env>">
        {code`const context = emailContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare email context is not available. Ensure that you are calling this function within the scope of a Cloudflare email operation.");
}
return context as CloudflareEmailContext<Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare email context. This is typically used to set up the context for handling a Cloudflare email operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getEmailContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare email context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`A promise that resolves with the result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withEmailContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[
          {
            name: "context",
            type: "CloudflareEmailContext<Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareEmailContext<Env>) => Promise<void>"
          }
        ]}
        returnType="Promise<void>">
        {code`return emailContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareQueueContext"
        typeParameters={[
          { name: "Message", default: "unknown" },
          { name: "Env", default: "CloudflareBindings" }
        ]}
        doc="An interface representing the runtime context for Cloudflare queue operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="batch"
          type="MessageBatch<Message>"
          doc="The Cloudflare queue event instance for the queue operation."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the queue operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_QUEUE_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-queue"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="queueContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare queue runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_QUEUE_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareQueueContext>()) as AsyncLocalStorage<CloudflareQueueContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare queue runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare queue runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getQueueContext"
        typeParameters={[
          { name: "Message", default: "unknown" },
          { name: "Env", default: "CloudflareBindings" }
        ]}
        parameters={[]}
        returnType="CloudflareQueueContext<Message, Env>">
        {code`const context = queueContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare queue context is not available. Ensure that you are calling this function within the scope of a Cloudflare queue operation.");
}
return context as CloudflareQueueContext<Message, Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare queue context. This is typically used to set up the context for handling a Cloudflare queue operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getQueueContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare queue context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withQueueContext"
        typeParameters={[
          { name: "Message", default: "unknown" },
          { name: "Env", default: "CloudflareBindings" }
        ]}
        parameters={[
          {
            name: "context",
            type: "CloudflareQueueContext<Message, Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareQueueContext<Message, Env>) => Promise<void>"
          }
        ]}
        returnType="Promise<void>">
        {code`return queueContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareTailContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        doc="An interface representing the tail context for Cloudflare tail operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="events"
          type="TraceItem[]"
          doc="An array of trace items representing the events in the Cloudflare tail context."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the tail operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_TAIL_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-tail"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="tailContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare tail runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_TAIL_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareTailContext>()) as AsyncLocalStorage<CloudflareTailContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare tail runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare tail runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getTailContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[]}
        returnType="CloudflareTailContext<Env>">
        {code`const context = tailContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare tail context is not available. Ensure that you are calling this function within the scope of a Cloudflare tail operation.");
}
return context as CloudflareTailContext<Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare tail context. This is typically used to set up the context for handling a Cloudflare tail operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getTailContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare tail context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withTailContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[
          {
            name: "context",
            type: "CloudflareTailContext<Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareTailContext<Env>) => Promise<void>"
          }
        ]}
        returnType="T">
        {code`return tailContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareTailStreamContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        doc="An interface representing the tail context for Cloudflare tail stream operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="event"
          type="TailStream.TailEvent<TailStream.Onset>"
          doc="The tail event associated with the Cloudflare tail stream context."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the tail stream operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_TAIL_STREAM_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-tail-stream"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="tailStreamContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare tail stream runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_TAIL_STREAM_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareTailStreamContext>()) as AsyncLocalStorage<CloudflareTailStreamContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare tail stream runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare tail stream runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getTailStreamContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[]}
        returnType="CloudflareTailStreamContext<Env>">
        {code`const context = tailStreamContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare tail stream context is not available. Ensure that you are calling this function within the scope of a Cloudflare tail stream operation.");
}
return context as CloudflareTailStreamContext<Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare tail stream context. This is typically used to set up the context for handling a Cloudflare tail stream operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getTailStreamContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare tail stream context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withTailStreamContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[
          {
            name: "context",
            type: "CloudflareTailStreamContext<Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareTailStreamContext<Env>) => Promise<TailStream.TailEventHandlerType>"
          }
        ]}
        returnType="Promise<TailStream.TailEventHandlerType>">
        {code`return tailStreamContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareTraceContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        doc="An interface representing the trace context for Cloudflare trace operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="traces"
          type="TraceItem[]"
          doc="An array of trace items associated with the Cloudflare trace context."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the trace operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_TRACE_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-trace"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="traceContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare trace runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_TRACE_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareTraceContext>()) as AsyncLocalStorage<CloudflareTraceContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare trace runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare trace runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getTraceContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[]}
        returnType="CloudflareTraceContext<Env>">
        {code`const context = traceContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare trace context is not available. Ensure that you are calling this function within the scope of a Cloudflare trace operation.");
}
return context as CloudflareTraceContext<Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare trace context. This is typically used to set up the context for handling a Cloudflare trace operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getTraceContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare trace context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withTraceContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[
          {
            name: "context",
            type: "CloudflareTraceContext<Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareTraceContext<Env>) => Promise<void>"
          }
        ]}
        returnType="Promise<void>">
        {code`return traceContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <InterfaceDeclaration
        export
        name="CloudflareTestContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        doc="An interface representing the test context for Cloudflare trace operations, containing relevant information and utilities for performing actions within the Cloudflare environment.">
        <InterfaceMember
          name="controller"
          type="TestController"
          doc="The test controller associated with the Cloudflare test context."
        />
        <InterfaceMember
          name="env"
          type="Env"
          doc="The Cloudflare environment bindings available during runtime."
        />
        <InterfaceMember
          name="ctx"
          type="ExecutionContext"
          doc="The Cloudflare execution context for the test operation."
        />
      </InterfaceDeclaration>
      <hbr />
      <VarDeclaration
        const
        name="CLOUDFLARE_TEST_CONTEXT_KEY"
        initializer={code`Symbol.for("powerlines-cloudflare-test"); `}
      />
      <hbr />
      <VarDeclaration
        export
        const
        name="testContextStorage"
        doc="An AsyncLocalStorage instance for managing the Cloudflare test runtime context."
        initializer={code`(globalContextStorage[CLOUDFLARE_TEST_CONTEXT_KEY] ??= new AsyncLocalStorage<CloudflareTestContext>()) as AsyncLocalStorage<CloudflareTestContext>; `}
      />
      <hbr />
      <TSDoc heading="Retrieves the current Cloudflare test runtime context from the AsyncLocalStorage. This context contains relevant information and utilities for performing actions within the Cloudflare environment. If no context is currently set, this function will throw an error.">
        <TSDocReturns>{code`The current Cloudflare test runtime context.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getTestContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[]}
        returnType="CloudflareTestContext<Env>">
        {code`const context = testContextStorage.getStore();
if (!context) {
  throw new Error("Cloudflare test context is not available. Ensure that you are calling this function within the scope of a Cloudflare test operation.");
}
return context as CloudflareTestContext<Env>; `}
      </FunctionDeclaration>
      <hbr />
      <TSDoc heading="Runs a given function within the scope of a Cloudflare test context. This is typically used to set up the context for handling a Cloudflare test operation, ensuring that any code executed within the function has access to the relevant Cloudflare environment information and utilities. The provided context will be available through the `getTestContext` function for any code executed within the callback.">
        <TSDocParam name="context">{code`The Cloudflare test context to run the function with.`}</TSDocParam>
        <TSDocParam name="callback">{code`The function to execute within the scope of the provided context.`}</TSDocParam>
        <TSDocReturns>{code`The result of the executed function.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="withTestContext"
        typeParameters={[{ name: "Env", default: "CloudflareBindings" }]}
        parameters={[
          {
            name: "context",
            type: "CloudflareTestContext<Env>"
          },
          {
            name: "callback",
            type: "(ctx: CloudflareTestContext<Env>) => Promise<void>"
          }
        ]}
        returnType="Promise<void>">
        {code`return testContextStorage.run(context, () => callback(context)); `}
      </FunctionDeclaration>
      <Spacing />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
