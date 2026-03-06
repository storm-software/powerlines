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
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import {
  EnvBuiltin,
  EnvBuiltinProps
} from "@powerlines/plugin-env/components/env-builtin";
import defu from "defu";

export type CloudflareEnvBuiltinProps = Omit<EnvBuiltinProps, "defaultConfig">;

/**
 * Generates the Cloudflare environment configuration module for the Powerlines project.
 */
export function CloudflareEnvBuiltin(props: CloudflareEnvBuiltinProps) {
  const [{ children, imports }, rest] = splitProps(props, [
    "children",
    "imports"
  ]);

  return (
    <EnvBuiltin
      defaultConfig={code`env`}
      {...rest}
      imports={defu(
        {
          "cloudflare:workers": ["env"]
        },
        imports ?? {}
      )}>
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </EnvBuiltin>
  );
}
