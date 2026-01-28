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
  ClassDeclaration,
  ClassMethod,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  NewExpression,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import {
  ReflectionClass,
  ReflectionKind,
  ReflectionProperty
} from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { refkey } from "@powerlines/plugin-alloy/helpers/refkey";
import { ComponentProps } from "@powerlines/plugin-alloy/types/components";
import {
  BuiltinFile,
  BuiltinFileProps
} from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocExample,
  TSDocLink,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns,
  TSDocThrows
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import {
  TypeScriptInterface,
  TypeScriptInterfaceProps
} from "@powerlines/plugin-alloy/typescript/components/typescript-interface";
import { TypescriptObject } from "@powerlines/plugin-alloy/typescript/components/typescript-object";
import { titleCase } from "@stryke/string-format/title-case";
import defu from "defu";
import { loadEnvFromContext } from "../helpers/load";
import { EnvPluginContext } from "../types/plugin";

/**
 * Generates the environment configuration typescript definition for the Powerlines project.
 */
export function EnvTypeDefinition(
  props: Omit<TypeScriptInterfaceProps, "name">
) {
  const [{ defaultValue, reflection }] = splitProps(props, [
    "defaultValue",
    "reflection"
  ]);

  const context = usePowerlines<EnvPluginContext>();

  return (
    <>
      <TypeScriptInterface
        name=" EnvBase"
        defaultValue={defaultValue}
        reflection={reflection}
        export={true}
      />
      <hbr />
      <hbr />

      <TSDoc heading="The environment configuration object with prefixed keys.">
        <TSDocRemarks>
          {`The \`Env\` type extends the \`EnvBase\` interface by including additional keys that are prefixed according to the project's configuration. This allows for flexibility in accessing environment variables with different naming conventions.`}
        </TSDocRemarks>
      </TSDoc>
      <TypeDeclaration name="Env" export={true}>
        {code` {
    [Key in keyof EnvBase as Key ${context.config.env.prefix
      .map(prefix => `| \`${prefix.replace(/_$/g, "")}_\${Key}\``)
      .join(" ")}]: EnvBase[Key];
}
`}
      </TypeDeclaration>
      <hbr />
      <hbr />
    </>
  );
}

interface ConfigPropertyConditionalProps extends ComponentProps {
  context: EnvPluginContext;
  name: string;
}

function ConfigPropertyConditional(props: ConfigPropertyConditionalProps) {
  const [{ context, name }] = splitProps(props, ["context", "name"]);

  return code`propertyName === "${name}" || propertyName.replace(/^(${context.config.env.prefix
    .sort((a, b) =>
      a.startsWith(b) ? -1 : b.startsWith(a) ? 1 : a.localeCompare(b)
    )
    .map(prefix => `${prefix.replace(/_$/, "")}_`)
    .join("|")})/g, "").toLowerCase().replace(/[\\s\\-_]+/g, "") === "${name
    .toLowerCase()
    .replace(/[\s\-_]+/g, "")}"`;
}

interface ConfigPropertyProps extends ComponentProps {
  index: number;
  context: EnvPluginContext;
  property: ReflectionProperty;
}

function ConfigPropertyGet(props: ConfigPropertyProps) {
  const [{ context, property, index }] = splitProps(props, [
    "context",
    "property",
    "index"
  ]);

  return (
    <>
      {index === 0 ? (
        <IfStatement
          condition={
            <>
              <ConfigPropertyConditional
                name={property.getNameAsString()}
                context={context}
              />
              <Show
                when={property.getAlias() && property.getAlias().length > 0}>
                {code` || `}
                <For each={property.getAlias()} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`return target["${property.getNameAsString()}"];`}
        </IfStatement>
      ) : (
        <ElseIfClause
          condition={
            <>
              <ConfigPropertyConditional
                name={property.getNameAsString()}
                context={context}
              />
              <Show
                when={property.getAlias() && property.getAlias().length > 0}>
                {code` || `}
                <For each={property.getAlias()} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`return target["${property.getNameAsString()}"];`}
        </ElseIfClause>
      )}
    </>
  );
}

function ConfigPropertySet(props: ConfigPropertyProps) {
  const [{ context, property, index }] = splitProps(props, [
    "context",
    "property",
    "index"
  ]);

  return (
    <>
      {index === 0 ? (
        <IfStatement
          condition={
            <>
              <ConfigPropertyConditional
                name={property.getNameAsString()}
                context={context}
              />
              <Show
                when={property.getAlias() && property.getAlias().length > 0}>
                {code` || `}
                <For each={property.getAlias()} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`
    target["${property.getNameAsString()}"] = newValue;
    return true;
`}
        </IfStatement>
      ) : (
        <ElseIfClause
          condition={
            <>
              <ConfigPropertyConditional
                name={property.getNameAsString()}
                context={context}
              />
              <Show
                when={property.getAlias() && property.getAlias().length > 0}>
                {code` || `}
                <For each={property.getAlias()} joiner={code` || `}>
                  {alias => (
                    <ConfigPropertyConditional name={alias} context={context} />
                  )}
                </For>
              </Show>
            </>
          }>
          {code`
    target["${property.getNameAsString()}"] = newValue;
    return true;
`}
        </ElseIfClause>
      )}
    </>
  );
}

export interface EnvBuiltinProps extends Omit<BuiltinFileProps, "id"> {
  defaultConfig?: Children;
  reflection: ReflectionClass<any>;
}

const createEnvRefkey = refkey("createEnv");
const envRefkey = refkey("env");
const envSerializerRefkey = refkey("EnvSerializer");

/**
 * Generates the environment configuration module for the Powerlines project.
 */
export function EnvBuiltin(props: EnvBuiltinProps) {
  const [{ defaultConfig, reflection, children }, rest] = splitProps(props, [
    "defaultConfig",
    "reflection",
    "children"
  ]);

  const context = usePowerlines<EnvPluginContext>();
  const defaultValue = computed(
    () => context && loadEnvFromContext(context, process.env)
  );

  const envInstance = computed(() => {
    const result = new ReflectionClass(
      {
        kind: ReflectionKind.objectLiteral,
        description: `The initial environment configuration state for the ${titleCase(
          context?.config?.name
        )} project.`,
        types: []
      },
      reflection
    );

    return result;
  });

  const reflectionGetProperties = computed(
    () =>
      reflection
        ?.getProperties()
        .filter(property => !property.isIgnored())
        .sort((a, b) =>
          a.getNameAsString().localeCompare(b.getNameAsString())
        ) ?? []
  );
  const reflectionSetProperties = computed(
    () =>
      reflection
        ?.getProperties()
        .filter(property => !property.isIgnored() && !property.isReadonly())
        .sort((a, b) =>
          a.getNameAsString().localeCompare(b.getNameAsString())
        ) ?? []
  );

  return (
    <BuiltinFile
      id="env"
      description="The environment configuration module provides an interface to define environment configuration parameters."
      {...rest}
      imports={defu(
        {
          "@powerlines/deepkit/vendor/type": [
            "stringify",
            "serializer",
            "serializeFunction",
            "deserializeFunction",
            "ReflectionKind",
            "Serializer",
            "TemplateState",
            "Type",
            "TypeProperty",
            "TypePropertySignature"
          ]
        },
        rest.imports ?? {}
      )}>
      <Show when={Boolean(reflection)}>
        <EnvTypeDefinition
          defaultValue={defaultValue.value}
          reflection={reflection}
        />
        <hbr />
        <hbr />
      </Show>

      <TypescriptObject
        name="initialEnv"
        type="Partial<EnvBase>"
        defaultValue={defaultValue}
        reflection={envInstance}
        export={true}
        const={true}
        doc="The initial environment configuration object values for the runtime."
      />
      <hbr />
      <hbr />

      <TSDoc heading="The environment configuration serializer for the Powerlines application.">
        <TSDocLink>
          {`https://deepkit.io/docs/serialization/serializers`}
        </TSDocLink>
        <TSDocLink>
          {`https://github.com/marcj/untitled-code/blob/master/packages/type/src/serializer.ts#L1918`}
        </TSDocLink>
        <TSDocRemarks>
          {`This serializer is used to serialize and deserialize the Powerlines environment configuration.`}
        </TSDocRemarks>
      </TSDoc>
      <ClassDeclaration
        refkey={envSerializerRefkey}
        name="EnvSerializer"
        extends="Serializer"
        export={true}>
        <ClassMethod
          name="constructor"
          public={true}
          doc="Initializes a new instance of the `EnvSerializer` class.">
          {code`
    super("env");

    this.deserializeRegistry.register(
      ReflectionKind.boolean,
      (type: Type, state: TemplateState) => {
        state.addSetter(
          \`typeof \${state.accessor.toString()} !== "boolean" ? \${state.accessor.toString()} === 1 || \${state.accessor.toString()} === "1" || \${state.accessor.toString()}.toLowerCase() === "t" || \${state.accessor.toString()}.toLowerCase() === "true" || \${state.accessor.toString()}.toLowerCase() === "y" || \${state.accessor.toString()}.toLowerCase() === "yes" : \${state.accessor.toString()}\`
        );
      }
    );
`}
        </ClassMethod>
      </ClassDeclaration>
      <hbr />
      <hbr />

      <TSDoc heading="A {@link EnvSerializer | environment configuration serializer} instance for the Powerlines application.">
        <TSDocLink>
          {`https://deepkit.io/docs/serialization/serializers`}
        </TSDocLink>
        <TSDocLink>
          {`https://github.com/marcj/untitled-code/blob/master/packages/type/src/serializer.ts#L1918`}
        </TSDocLink>
        <TSDocRemarks>
          {`This serializer is used to serialize and deserialize the Powerlines environment configuration.`}
        </TSDocRemarks>
      </TSDoc>
      <VarDeclaration
        name="envSerializer"
        export={false}
        const={true}
        initializer={<NewExpression args={[]} target="EnvSerializer" />}
      />
      <hbr />
      <hbr />

      <TSDoc heading="Serialize a environment configuration object to JSON data objects (not a JSON string).">
        <TSDocRemarks>
          {`The resulting JSON object can be stringified using \`JSON.stringify()\`.`}
        </TSDocRemarks>
        <TSDocExample>{`const json = serializeEnv(env);`}</TSDocExample>
        <TSDocThrows>
          {`ValidationError when serialization or validation fails.`}
        </TSDocThrows>
      </TSDoc>
      <VarDeclaration
        name="serializeEnv"
        export={true}
        const={true}
        initializer={"serializeFunction<EnvBase>(envSerializer)"}
      />
      <hbr />
      <hbr />

      <TSDoc heading="Deserialize a environment configuration object from JSON data objects to JavaScript objects, without running any validators.">
        <TSDocRemarks>
          {`Types that are already correct will be used as-is.`}
        </TSDocRemarks>
        <TSDocExample>{`const env = deserializeEnv(json);`}</TSDocExample>
        <TSDocThrows>
          {`ValidationError when deserialization fails.`}
        </TSDocThrows>
      </TSDoc>
      <VarDeclaration
        name="deserializeEnv"
        export={true}
        const={true}
        initializer="deserializeFunction<EnvBase>(envSerializer)"
      />
      <hbr />
      <hbr />

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
      <Show when={Boolean(context?.entryPath)}>
        <FunctionDeclaration
          refkey={createEnvRefkey}
          async={false}
          export={true}
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
    deserializeEnv({
      ...initialEnv,
      ...environmentConfig
    }) as Env,
    {
      get: (target: EnvBase, propertyName: string) => { `}
          <hbr />

          <For each={reflectionGetProperties}>
            {(property: ReflectionProperty, index: number) => (
              <ConfigPropertyGet
                index={index}
                context={context}
                property={property}
              />
            )}
          </For>
          {code`
            return undefined;
          }, `}

          <hbr />
          <hbr />
          {code` set: (target: EnvBase, propertyName: string, newValue: any) => { `}
          <hbr />

          <For each={reflectionSetProperties} ender={code` else `}>
            {(property: ReflectionProperty, index: number) => (
              <ConfigPropertySet
                index={index}
                context={context}
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
      <hbr />
      <hbr />
      <hbr />

      <TSDoc heading="The environment configuration object.">
        <TSDocRemarks>
          {`This object provides access to the environment configuration parameters in the application runtime.`}
        </TSDocRemarks>
      </TSDoc>
      <VarDeclaration
        refkey={envRefkey}
        name="env"
        type="Env"
        export={true}
        const={true}
        initializer={
          <>{code`createEnv(${defaultConfig || "{}"} as Partial<Env>);`}</>
        }
      />
      <hbr />
      <hbr />

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
        );
        `}
      />
      <hbr />
      <hbr />

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
      <hbr />
      <hbr />

      <VarDeclaration
        export
        const
        name="isProduction"
        doc='Detect if the application is running in `"production"` mode'
        initializer={code`["prd", "prod", "production"].includes(mode.toLowerCase()); `}
      />
      <hbr />
      <hbr />

      <VarDeclaration
        export
        const
        name="isTest"
        doc='Detect if the application is running in `"test"` mode'
        initializer={code`["tst", "test", "testing", "stg", "stage", "staging"].includes(mode.toLowerCase()) || env.TEST; `}
      />
      <hbr />
      <hbr />

      <VarDeclaration
        export
        const
        name="isDevelopment"
        doc='Detect if the application is running in `"development"` mode'
        initializer={code`["dev", "development"].includes(mode.toLowerCase()); `}
      />
      <hbr />
      <hbr />

      <VarDeclaration
        export
        const
        name="isDebug"
        doc="Detect if the application is currently being debugged"
        initializer={code`Boolean(isDevelopment && env.DEBUG); `}
      />
      <hbr />
      <hbr />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
