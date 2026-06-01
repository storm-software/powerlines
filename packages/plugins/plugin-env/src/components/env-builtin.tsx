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

import {
  Children,
  code,
  computed,
  For,
  Show,
  splitProps
} from "@alloy-js/core";
import {
  InterfaceDeclaration as BaseInterfaceDeclaration,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { refkey } from "@powerlines/plugin-alloy/helpers/refkey";
import type { ComponentProps } from "@powerlines/plugin-alloy/types/components";
import {
  BuiltinFile,
  BuiltinFileProps,
  InterfaceDeclaration,
  InterfaceMember,
  ObjectDeclaration,
  TSDocSchemaProperty
} from "@powerlines/plugin-alloy/typescript/components";
import {
  TSDoc,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import {
  generateParserCode,
  getPropertiesList,
  GetPropertiesResult,
  JsonSchema
} from "@powerlines/schema";
import { getUnique } from "@stryke/helpers/get-unique";
import { loadEnvFromContext } from "../helpers/load";
import type { EnvPluginContext } from "../types/plugin";

/**
 * Generates the environment configuration typescript definition for the Powerlines project.
 */
export function EnvTypeDefinition() {
  const context = usePowerlines<EnvPluginContext>();

  return (
    <>
      <InterfaceDeclaration
        name="UnprefixedEnv"
        schema={context.env.config.schema}
        export
      />
      <Spacing />
      <TSDoc heading="The environment configuration object with prefixed keys.">
        <TSDocRemarks>
          {`The \`Env\` type extends the \`UnprefixedEnv\` interface by including additional keys that are prefixed according to the project's configuration. This allows for flexibility in accessing environment variables with different naming conventions.`}
        </TSDocRemarks>
      </TSDoc>
      <BaseInterfaceDeclaration name="Env" export extends="UnprefixedEnv">
        <For
          each={getUnique(context.config.env.prefix).map(prefix =>
            prefix.replace(/_$/, "")
          )}
          doubleHardline>
          {prefix => (
            <For
              each={
                getPropertiesList(context.env.config.schema).filter(
                  property => !property.ignore
                ) ?? []
              }
              doubleHardline>
              {property => (
                <>
                  <TSDocSchemaProperty
                    schema={property}
                    defaultValue={property?.default}
                  />
                  <InterfaceMember
                    name={`${prefix}_${property.name}`}
                    type={`UnprefixedEnv["${property.name}"]`}
                    schema={property}
                    required={property.required}
                    readOnly={property.readOnly}
                  />
                </>
              )}
            </For>
          )}
        </For>
      </BaseInterfaceDeclaration>
      <Spacing />
    </>
  );
}

interface ConfigPropertyConditionalProps extends ComponentProps {
  context: EnvPluginContext;
  name: string;
}

function ConfigPropertyConditional(props: ConfigPropertyConditionalProps) {
  const [{ context, name }] = splitProps(props, ["context", "name"]);

  return code`propertyName === "${name}" || propertyName.replace(/^(${getUnique(
    context.config.env.prefix
      .sort((a, b) =>
        a.startsWith(b) ? -1 : b.startsWith(a) ? 1 : a.localeCompare(b)
      )
      .map(prefix => `${prefix.replace(/_$/, "")}_`)
  ).join("|")})/g, "").toLowerCase().replace(/[\\s\\-_]+/g, "") === "${name
    .toLowerCase()
    .replace(/[\s\-_]+/g, "")}"`;
}

interface ConfigPropertyProps extends ComponentProps {
  index: number;
  context: EnvPluginContext;
  name: string;
  property: JsonSchema;
}

function ConfigPropertyGet(props: ConfigPropertyProps) {
  const [{ context, name, property, index }] = splitProps(props, [
    "context",
    "name",
    "property",
    "index"
  ]);

  return (
    <>
      {index === 0 ? (
        <IfStatement
          condition={
            <>
              <ConfigPropertyConditional name={name} context={context} />
              <Show when={property?.alias && property?.alias.length > 0}>
                {code` || `}
                <For each={property?.alias ?? []} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`return target["${name}"];`}
        </IfStatement>
      ) : (
        <ElseIfClause
          condition={
            <>
              <ConfigPropertyConditional name={name} context={context} />
              <Show when={property?.alias && property?.alias.length > 0}>
                {code` || `}
                <For each={property?.alias ?? []} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`return target["${name}"];`}
        </ElseIfClause>
      )}
    </>
  );
}

function ConfigPropertySet(props: ConfigPropertyProps) {
  const [{ context, name, property, index }] = splitProps(props, [
    "context",
    "name",
    "property",
    "index"
  ]);

  return (
    <>
      {index === 0 ? (
        <IfStatement
          condition={
            <>
              <ConfigPropertyConditional name={name} context={context} />
              <Show when={property?.alias && property?.alias.length > 0}>
                {code` || `}
                <For each={property?.alias ?? []} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`
    target["${name}"] = newValue;
    return true;
`}
        </IfStatement>
      ) : (
        <ElseIfClause
          condition={
            <>
              <ConfigPropertyConditional name={name} context={context} />
              <Show when={property?.alias && property?.alias.length > 0}>
                {code` || `}
                <For each={property?.alias ?? []} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`
    target["${name}"] = newValue;
    return true;
`}
        </ElseIfClause>
      )}
    </>
  );
}

export interface EnvBuiltinProps extends Omit<BuiltinFileProps, "id"> {
  defaultConfig?: Children;
}

const createEnvRefkey = refkey("createEnv");
const envRefkey = refkey("env");

/**
 * Generates the environment configuration module for the Powerlines project.
 */
export function EnvBuiltin(props: EnvBuiltinProps) {
  const [{ defaultConfig, children }, rest] = splitProps(props, [
    "defaultConfig",
    "children"
  ]);

  const context = usePowerlines<EnvPluginContext>();
  const defaultValue = computed(
    () => context && loadEnvFromContext(context, process.env)
  );

  const schemaGetProperties = computed(
    () =>
      (getPropertiesList(context.env.config)
        .filter(property => !property?.ignore && !property?.writeOnly)
        .sort((a, b) =>
          !a?.name && !b?.name
            ? 0
            : !a?.name
              ? 1
              : !b?.name
                ? -1
                : a?.name.localeCompare(b?.name)
        ) ?? []) as GetPropertiesResult[]
  );
  const schemaSetProperties = computed(
    () =>
      (getPropertiesList(context.env.config)
        .filter(property => !property?.ignore && !property?.readOnly)
        .sort((a, b) =>
          !a?.name && !b?.name
            ? 0
            : !a?.name
              ? 1
              : !b?.name
                ? -1
                : a?.name.localeCompare(b?.name)
        ) ?? []) as GetPropertiesResult[]
  );

  const parserCode = generateParserCode(context.env.config.schema);

  return (
    <BuiltinFile
      id="env"
      description="The environment configuration module provides an interface to define environment configuration parameters."
      {...rest}>
      <Show when={Boolean(context.env.config.schema)}>
        <EnvTypeDefinition defaultValue={defaultValue} />
        <Spacing />
      </Show>
      <ObjectDeclaration
        name="initialEnv"
        type="Partial<Env>"
        schema={context.env.config.schema}
        export
        const
        doc="The initial environment configuration object values for the runtime."
      />
      <Spacing />
      {parserCode}
      <Spacing />
      <Show when={Boolean(context?.entryPath)}>
        <TSDoc heading="Initializes the Powerlines environment configuration module.">
          <TSDocRemarks>
            {`This function initializes the Powerlines environment configuration object.`}
          </TSDocRemarks>
          <TSDocParam name="environmentConfig">
            {`The dynamic/runtime configuration - this could include the current environment variables or any other environment-specific settings provided by the runtime.`}
          </TSDocParam>
          <TSDocReturns>
            {`The initialized Powerlines configuration object.`}
          </TSDocReturns>
        </TSDoc>
        <FunctionDeclaration
          refkey={createEnvRefkey}
          async={false}
          export
          name="createEnv"
          parameters={[
            {
              name: "environmentConfig",
              type: `Partial<Env>`,
              optional: false,
              default: "{}"
            }
          ]}
          returnType="Env">
          {code`
  return new Proxy<Env>(
    parse({
      ...initialEnv,
      ...environmentConfig
    } as Env),
    {
      get: (target: UnprefixedEnv, propertyName: string) => { `}
          <hbr />
          <For each={schemaGetProperties.value}>
            {(property: GetPropertiesResult, index: number) => (
              <ConfigPropertyGet
                index={index}
                context={context}
                name={property.name}
                property={property}
              />
            )}
          </For>
          {code`
            return undefined;
          }, `}

          <Spacing />
          {code` set: (target: UnprefixedEnv, propertyName: string, newValue: any) => { `}
          <hbr />
          <For each={schemaSetProperties.value} ender={code` else `}>
            {(property: GetPropertiesResult, index: number) => (
              <ConfigPropertySet
                index={index}
                context={context}
                name={property.name}
                property={property}
              />
            )}
          </For>

          <hbr />
          {code`return false;
      }
    }
  );
`}
        </FunctionDeclaration>
      </Show>
      <Spacing />
      <TSDoc heading="The environment configuration object.">
        <TSDocRemarks>
          {`This object provides access to the environment configuration parameters in the application runtime.`}
        </TSDocRemarks>
      </TSDoc>
      <VarDeclaration
        refkey={envRefkey}
        name="env"
        type="Env"
        export
        const
        initializer={
          <>{code`createEnv(${defaultConfig || "{}"} as Partial<Env>);`}</>
        }
      />
      <Spacing />

      <VarDeclaration
        export
        const
        name="isCI"
        doc="Detect if the application is running in a continuous integration (CI) environment."
        initializer={code`Boolean(
          env.CI ||
          env.RUN_ID ||
          env.AGOLA_GIT_REF ||
          env.AC_APPCIRCLE ||
          env.APPVEYOR ||
          env.CODEBUILD ||
          env.TF_BUILD ||
          env.bamboo_planKey ||
          env.BITBUCKET_COMMIT ||
          env.BITRISE_IO ||
          env.BUDDY_WORKSPACE_ID ||
          env.BUILDKITE ||
          env.CIRCLECI ||
          env.CIRRUS_CI ||
          env.CF_BUILD_ID ||
          env.CM_BUILD_ID ||
          env.CI_NAME ||
          env.DRONE ||
          env.DSARI ||
          env.EARTHLY_CI ||
          env.EAS_BUILD ||
          env.GERRIT_PROJECT ||
          env.GITEA_ACTIONS ||
          env.GITHUB_ACTIONS ||
          env.GITLAB_CI ||
          env.GOCD ||
          env.BUILDER_OUTPUT ||
          env.HARNESS_BUILD_ID ||
          env.JENKINS_URL ||
          env.LAYERCI ||
          env.MAGNUM ||
          env.NETLIFY ||
          env.NEVERCODE ||
          env.PROW_JOB_ID ||
          env.RELEASE_BUILD_ID ||
          env.RENDER ||
          env.SAILCI ||
          env.HUDSON ||
          env.SCREWDRIVER ||
          env.SEMAPHORE ||
          env.SOURCEHUT ||
          env.STRIDER ||
          env.TASK_ID ||
          env.RUN_ID ||
          env.TEAMCITY_VERSION ||
          env.TRAVIS ||
          env.VELA ||
          env.NOW_BUILDER ||
          env.APPCENTER_BUILD_ID ||
          env.CI_XCODE_PROJECT ||
          env.XCS || false
        ); `}
      />
      <Spacing />

      <TSDoc heading="Detect the \`mode\` of the current runtime environment.">
        <TSDocRemarks>
          {code`The \`mode\` is determined by the \`MODE\` environment variable, or falls back to the \`NEXT_PUBLIC_VERCEL_ENV\`, \`NODE_ENV\`, or defaults to \`production\`. While the value can potentially be any string, it is generally recommended to only allow a value in the following list:
          - \`production\`
          - \`test\`
          - \`development\`
          `}
        </TSDocRemarks>
      </TSDoc>
      <VarDeclaration
        export
        const
        name="mode"
        initializer={code`String(env.MODE) || "production"; `}
      />
      <Spacing />

      <VarDeclaration
        export
        const
        name="isProduction"
        doc='Detect if the application is running in `"production"` mode'
        initializer={code`["prd", "prod", "production"].includes(mode.toLowerCase()); `}
      />
      <Spacing />

      <VarDeclaration
        export
        const
        name="isTest"
        doc='Detect if the application is running in `"test"` mode'
        initializer={code`["tst", "test", "testing", "stg", "stage", "staging"].includes(mode.toLowerCase()) || env.TEST; `}
      />
      <Spacing />

      <VarDeclaration
        export
        const
        name="isDevelopment"
        doc='Detect if the application is running in `"development"` mode'
        initializer={code`["dev", "development"].includes(mode.toLowerCase()); `}
      />
      <Spacing />

      <VarDeclaration
        export
        const
        name="isDebug"
        doc="Detect if the application is currently being debugged"
        initializer={code`Boolean(isDevelopment && env.DEBUG); `}
      />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
