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

import assert from "node:assert";
import path from "node:path";
// eslint-disable-next-line camelcase
import type { Unstable_Config, Unstable_RawConfig } from "wrangler";
import * as z from "zod";
import * as z4 from "zod/v4/core";

export type OptionalZodTypeOf<T extends z4.$ZodType | undefined> =
  T extends z4.$ZodType ? z4.infer<T> : undefined;

// https://github.com/colinhacks/zod/blob/59768246aa57133184b2cf3f7c2a1ba5c3ab08c3/README.md?plain=1#L1302-L1317
export const LiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null()
]);
export type Literal = z.infer<typeof LiteralSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    LiteralSchema,
    z.array(JsonSchema),
    z.record(z.string(), JsonSchema)
  ])
);

let rootPath: string | undefined;
export async function parseWithRootPath<Z extends z4.$ZodType>(
  newRootPath: string,
  schema: Z,
  payload: z4.ParsePayload<any>,
  ctx: z.core.ParseContextInternal
) {
  rootPath = newRootPath;
  try {
    return await schema._zod.parse(payload, ctx);
  } finally {
    rootPath = undefined;
  }
}
export const PathSchema = z.string().transform(p => {
  assert(
    rootPath !== undefined,
    "Expected `PathSchema` to be parsed within `parseWithRootPath()`"
  );
  return path.resolve(rootPath, p);
});

export function isCyclic(value: unknown, seen = new Set<unknown>()) {
  if (typeof value !== "object" || value === null) return false;
  for (const child of Object.values(value)) {
    if (seen.has(child)) return true;
    seen.add(child);
    if (isCyclic(child, seen)) return true;
    seen.delete(child);
  }
  return false;
}

// eslint-disable-next-line camelcase
export type WranglerUserConfig = Unstable_RawConfig;

/**
 * This is the static type definition for the configuration object.
 *
 * It reflects a normalized and validated version of the configuration that you can write in a Wrangler configuration file,
 * and optionally augment with arguments passed directly to wrangler.
 *
 * For more information about the configuration object, see the documentation at https://developers.cloudflare.com/workers/cli-wrangler/configuration
 *
 * @remarks
 * - Fields that are only specified in `ConfigFields` and not `Environment` can only appear
 *   in the top level config and should not appear in any environments.
 * - Fields that are specified in `PagesConfigFields` are only relevant for Pages projects
 * - All top level fields in config and environments are optional in the Wrangler configuration file.
 */
// eslint-disable-next-line camelcase
export type WranglerResolvedConfig = Unstable_Config;

export const defaultWranglerConfig: WranglerResolvedConfig = {
  /* COMPUTED_FIELDS */
  configPath: undefined,
  userConfigPath: undefined,
  topLevelName: undefined,
  definedEnvironments: undefined,
  targetEnvironment: undefined,

  /*= =================================================== */
  /*      Fields supported by both Workers & Pages      */
  /*= =================================================== */
  /* TOP-LEVEL ONLY FIELDS */
  pages_build_output_dir: undefined,
  send_metrics: undefined,
  dev: {
    ip: process.platform === "win32" ? "127.0.0.1" : "localhost",
    port: undefined, // the default of 8787 is set at runtime
    inspector_port: undefined, // the default of 9229 is set at runtime
    inspector_ip: undefined, // the default of 127.0.0.1 is set at runtime
    local_protocol: "http",
    upstream_protocol: "http",
    host: undefined,
    // Note this one is also workers only
    enable_containers: true,
    container_engine: undefined,
    generate_types: false
  },

  /** INHERITABLE ENVIRONMENT FIELDS */
  name: undefined,
  compatibility_date: undefined,
  compatibility_flags: [],
  limits: undefined,
  placement: undefined,

  /** NON-INHERITABLE ENVIRONMENT FIELDS */
  vars: {},
  durable_objects: { bindings: [] },
  kv_namespaces: [],
  queues: {
    producers: [],
    consumers: [] // WORKERS SUPPORT ONLY!!
  },
  r2_buckets: [],
  d1_databases: [],
  vectorize: [],
  hyperdrive: [],
  workflows: [],
  secrets_store_secrets: [],
  services: [],
  analytics_engine_datasets: [],
  ai: undefined,
  images: undefined,
  stream: undefined,
  media: undefined,
  version_metadata: undefined,
  unsafe_hello_world: [],
  ratelimits: [],
  worker_loaders: [],

  /*= =================================================== */
  /*           Fields supported by Workers only         */
  /*= =================================================== */
  /* TOP-LEVEL ONLY FIELDS */
  legacy_env: true,
  site: undefined,
  wasm_modules: undefined,
  text_blobs: undefined,
  data_blobs: undefined,
  keep_vars: undefined,
  alias: undefined,

  /** INHERITABLE ENVIRONMENT FIELDS */
  account_id: undefined,
  main: undefined,
  find_additional_modules: undefined,
  preserve_file_names: undefined,
  base_dir: undefined,
  workers_dev: undefined,
  preview_urls: undefined,
  route: undefined,
  routes: undefined,
  tsconfig: undefined,
  jsx_factory: "React.createElement",
  jsx_fragment: "React.Fragment",
  migrations: [],
  triggers: {
    crons: undefined
  },
  rules: [],
  build: { command: undefined, watch_dir: "./src", cwd: undefined },
  no_bundle: undefined,
  minify: undefined,
  keep_names: undefined,
  dispatch_namespaces: [],
  first_party_worker: undefined,
  logfwdr: { bindings: [] },
  logpush: undefined,
  upload_source_maps: undefined,
  assets: undefined,
  observability: { enabled: true },
  cache: undefined,
  /** The default here is undefined so that we can delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable. */
  compliance_region: undefined,
  python_modules: { exclude: ["**/*.pyc"] },

  /** NON-INHERITABLE ENVIRONMENT FIELDS */
  define: {},
  cloudchamber: {},
  containers: undefined,
  send_email: [],
  browser: undefined,
  unsafe: {},
  mtls_certificates: [],
  tail_consumers: undefined,
  streaming_tail_consumers: undefined,
  pipelines: [],
  vpc_services: []
};
