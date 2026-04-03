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
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import {
  BuiltinFile,
  BuiltinFileProps
} from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import defu from "defu";

export interface FeaturesBuiltinProps extends Omit<BuiltinFileProps, "id"> {}

/**
 * Generates the feature flags module for the Powerlines project.
 */
export function FeaturesBuiltin(props: FeaturesBuiltinProps) {
  const [{ children, imports }, rest] = splitProps(props, [
    "children",
    "imports"
  ]);

  // const context = usePowerlines<OpenFeaturePluginContext>();

  return (
    <BuiltinFile
      id="features"
      description="The runtime feature flags module provides an interface to define environment configuration parameters."
      {...rest}
      imports={defu(
        {
          "@openfeature/server-sdk": [
            { name: "OpenFeature" },
            { name: "Provider", type: true },
            { name: "ProviderWrapper", type: true },
            { name: "ServerProviderStatus", type: true }
          ]
        },
        imports ?? {}
      )}>
      <TSDoc>
        {code`A function to set the OpenFeature providers to be used in the application. This function should be called at the entry point of the application to ensure that the providers are registered before any feature flag evaluations occur.`}

        <TSDocParam name="provider">
          {`The provider wrapper containing the OpenFeature provider to set. The provider should be an instance of a class that implements the OpenFeature Provider interface, wrapped in a ProviderWrapper to include any necessary metadata about the provider's status.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        name="setFeatureProvider"
        export
        async
        parameters={[
          {
            name: "provider",
            type: "ProviderWrapper<Provider, ServerProviderStatus>"
          }
        ]}>
        {code`try {
          await OpenFeature.setProviderAndWait(provider);
        } catch (error) {
          console.error('Failed to initialize provider:', error);
        } `}
      </FunctionDeclaration>
      <Spacing />
      <VarDeclaration
        name="client"
        export
        const
        doc="The Open Feature runtime client to provide feature flag evaluations."
        type="ReturnType<typeof OpenFeature.getClient>">
        {code`OpenFeature.getClient(); `}
      </VarDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="feature"
        export
        async
        parameters={[
          {
            name: "featureId",
            type: "string"
          }
        ]}
        returnType="Promise<boolean>">
        {code`try {
          return client.getBooleanValue(featureId);
        } catch (error) {
          console.error('Failed to initialize provider:', error);
        } `}
      </FunctionDeclaration>
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
