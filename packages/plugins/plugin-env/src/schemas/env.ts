/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import * as z from "zod";

declare module "zod" {
  interface GlobalMeta {
    /**
     * Alternate environment variable names that map to this field.
     */
    alias?: string[];

    /**
     * Platform category this parameter targets (`neutral` or `node`).
     */
    category?: "browser" | "neutral" | "node";

    /**
     * Documented default value for the environment variable.
     */
    defaultValue?: string | number | boolean | null;

    /**
     * Whether the value is treated as read-only / build-time.
     */
    readonly?: boolean;

    /**
     * Whether the value is resolved at runtime rather than injected at build time.
     */
    runtime?: boolean;

    /**
     * Whether the field should be hidden from generated documentation.
     */
    hidden?: boolean;

    /**
     * Related reference URLs.
     */
    see?: string[];
  }
}

/**
 * Runtime environment the application may execute in.
 */
export const RuntimeSchema = z.enum(["nodejs", "deno", "workerd", "browser"]);
export type Runtime = z.infer<typeof RuntimeSchema>;

/**
 * Platform the application was built for.
 */
export const PlatformSchema = z.enum(["node", "neutral", "browser"]);
export type Platform = z.infer<typeof PlatformSchema>;

/**
 * Application run mode.
 */
export const ModeSchema = z.enum(["development", "test", "production"]);
export type Mode = z.infer<typeof ModeSchema>;

/**
 * Lowest log level the logger will accept.
 */
export const LogLevelSchema = z.enum(["error", "warn", "info", "debug"]);
export type LogLevel = z.infer<typeof LogLevelSchema>;

/**
 * Value that may be a boolean flag or a numeric color/hyperlink force level.
 */
export const BooleanOrNumberSchema = z.union([z.boolean(), z.number()]);
export type BooleanOrNumber = z.infer<typeof BooleanOrNumberSchema>;

/**
 * Zod schema for the base environment configuration used by Powerlines applications.
 *
 * @remarks
 * Defaults match documented `@defaultValue` metadata on each field.
 */
export const envSchema = z
  .object({
    APP_NAME: z.string().meta({
      description: "The name of the application.",
      readonly: true,
      category: "neutral"
    }),
    APP_VERSION: z.string().default("1.0.0").meta({
      description: "The version of the application.",
      defaultValue: "1.0.0",
      readonly: true,
      category: "neutral"
    }),
    BUILD_ID: z.string().meta({
      description: "The unique identifier for the build.",
      readonly: true,
      category: "neutral"
    }),
    BUILD_TIMESTAMP: z.string().meta({
      description: "The timestamp the build was ran at.",
      readonly: true,
      category: "neutral"
    }),
    BUILD_CHECKSUM: z.string().meta({
      description: "A checksum hash created during the build.",
      readonly: true,
      category: "neutral"
    }),
    RELEASE_ID: z.string().meta({
      description: "The unique identifier for the release.",
      readonly: true,
      category: "neutral"
    }),
    RELEASE_TAG: z.string().meta({
      description:
        'The tag for the release. This is generally in the format of "<APP_NAME>@<APP_VERSION>".',
      readonly: true,
      category: "neutral"
    }),
    ORGANIZATION: z.string().meta({
      description:
        "The name of the organization that maintains the application. This variable is used to specify the name of the organization that maintains the application. If not provided in an environment, it will try to use the value in StormWorkspaceConfig.organization.",
      alias: ["ORG", "ORG_ID"],
      category: "neutral"
    }),
    RUNTIME: RuntimeSchema.optional().meta({
      description: "The runtime that the application is running in."
    }),
    PLATFORM: PlatformSchema.default("neutral").meta({
      description: "The platform for which the application was built.",
      defaultValue: "neutral",
      category: "neutral"
    }),
    MODE: ModeSchema.default("production").meta({
      description: "The mode in which the application is running.",
      defaultValue: "production",
      alias: ["NODE_ENV", "ENV", "VERCEL_ENV"],
      category: "neutral"
    }),
    ENVIRONMENT: z.string().default("production").meta({
      description:
        "The environment the application is running in. This value will be populated with the value of `MODE` if not provided.",
      defaultValue: "production",
      category: "neutral"
    }),
    DEBUG: z.boolean().meta({
      description: "Indicates if the application is running in debug mode.",
      category: "neutral"
    }),
    TEST: z.boolean().meta({
      description:
        "An indicator that specifies the current runtime is a test environment.",
      category: "neutral"
    }),
    MINIMAL: z.boolean().meta({
      description:
        "An indicator that specifies the current runtime is a minimal environment.",
      category: "node"
    }),
    NO_COLOR: z.boolean().meta({
      description:
        "An indicator that specifies the current runtime is a no color environment.",
      category: "node"
    }),
    FORCE_COLOR: BooleanOrNumberSchema.meta({
      description:
        "An indicator that specifies the current runtime is a force color environment.",
      category: "node"
    }),
    FORCE_HYPERLINK: BooleanOrNumberSchema.meta({
      description:
        "An indicator that specifies the current runtime should force hyperlinks in terminal output. This variable is used to force hyperlinks in terminal output, even if the terminal does not support them. This is useful for debugging and development purposes.",
      category: "node"
    }),
    AGENT_NAME: z.string().optional().meta({
      description:
        "The name of the agent running the application. This variable is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "neutral"
    }),
    COLORTERM: z.string().optional().meta({
      description:
        "The color terminal type. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TERM: z.string().optional().meta({
      description:
        "The terminal type. This variable is set by certain CI/CD systems. This variable is used to specify the terminal type that the application is running in. It can be used to determine how to format output for the terminal.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TERM_PROGRAM: z.string().optional().meta({
      description:
        "The terminal program name. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TERM_PROGRAM_VERSION: z.string().optional().meta({
      description:
        "The terminal program version. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TERMINAL_EMULATOR: z.string().optional().meta({
      description:
        "The terminal emulator name. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    WT_SESSION: z.string().optional().meta({
      description:
        "The terminal emulator session ID. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TERMINUS_SUBLIME: z.boolean().optional().meta({
      description:
        "An indicator that specifies the current terminal is running Terminus Sublime. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    ConEmuTask: z.string().optional().meta({
      description:
        "The ConEmu task name. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CURSOR_TRACE_ID: z.string().optional().meta({
      description:
        "The cursor trace ID. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    VTE_VERSION: z.string().optional().meta({
      description:
        "The VTE version. This variable is set by certain terminal emulators.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    STACKTRACE: z.boolean().meta({
      description: "Indicates if error stack traces should be captured.",
      category: "neutral"
    }),
    INCLUDE_ERROR_DATA: z.boolean().meta({
      description: "Indicates if error data should be included.",
      category: "neutral"
    }),
    ERROR_URL: z.string().optional().meta({
      title: "Error Details URL",
      description:
        "A web page to lookup error messages and display additional information given an error code. This variable is used to provide a URL to a page that can be used to look up error messages given an error code. This is used to provide a more user-friendly error message to the user.",
      category: "neutral"
    }),
    DEFAULT_TIMEZONE: z.string().default("America/New_York").meta({
      description: "The default timezone for the application.",
      defaultValue: "America/New_York",
      category: "neutral"
    }),
    DEFAULT_LOCALE: z.string().default("en_US").meta({
      description: "The default locale to be used in the application.",
      defaultValue: "en_US",
      category: "neutral"
    }),
    LOG_LEVEL: LogLevelSchema.nullable().default("info").meta({
      description:
        "The default lowest log level to accept. If `null`, the logger will reject all records.",
      defaultValue: "info",
      category: "neutral"
    }),
    CI: z.boolean().meta({
      title: "Continuous Integration",
      description:
        "An indicator that specifies the current runtime is a continuous integration environment.",
      alias: ["CONTINUOUS_INTEGRATION"],
      category: "neutral"
    }),
    RUN_ID: z.string().optional().meta({
      description:
        "The unique identifier for the current run. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    AGOLA_GIT_REF: z.string().optional().meta({
      description:
        "The agola git reference. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    AC_APPCIRCLE: z.string().optional().meta({
      description:
        "The appcircle build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    APPVEYOR: z.string().optional().meta({
      description:
        "The appveyor build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CODEBUILD: z.string().optional().meta({
      description:
        "The codebuild build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TF_BUILD: z.string().optional().meta({
      description:
        "The task force build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    bamboo_planKey: z.string().optional().meta({
      description:
        "The bamboo plan key. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    BITBUCKET_COMMIT: z.string().optional().meta({
      description:
        "The bitbucket commit. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    BITRISE_IO: z.string().optional().meta({
      description:
        "The bitrise build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    BUDDY_WORKSPACE_ID: z.string().optional().meta({
      description:
        "The buddy workspace ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    BUILDKITE: z.string().optional().meta({
      description:
        "The buildkite build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CIRCLECI: z.string().optional().meta({
      description:
        "The circleci build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CIRRUS_CI: z.string().optional().meta({
      description:
        "The cirrus-ci build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CF_BUILD_ID: z.string().optional().meta({
      description:
        "The cf build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CM_BUILD_ID: z.string().optional().meta({
      description:
        "The cm build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CI_NAME: z.string().optional().meta({
      description: "The ci name. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    DRONE: z.string().optional().meta({
      description:
        "The drone build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    DSARI: z.string().optional().meta({
      description:
        "The dsari build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    EARTHLY_CI: z.string().optional().meta({
      description:
        "The earthly build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    EAS_BUILD: z.string().optional().meta({
      description:
        "The eas build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    GERRIT_PROJECT: z.string().optional().meta({
      description:
        "The gerrit project. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    GITEA_ACTIONS: z.string().optional().meta({
      description:
        "The gitea actions build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    GITHUB_ACTIONS: z.string().optional().meta({
      description:
        "The github actions build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    GITLAB_CI: z.string().optional().meta({
      description:
        "The gitlab ci build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    GOCD: z.string().optional().meta({
      description:
        "The go cd build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    BUILDER_OUTPUT: z.string().optional().meta({
      description:
        "The builder output build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    HARNESS_BUILD_ID: z.string().optional().meta({
      description:
        "The harness build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    JENKINS_URL: z.string().optional().meta({
      description:
        "The jenkins url. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    LAYERCI: z.string().optional().meta({
      description:
        "The layerci build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    MAGNUM: z.string().optional().meta({
      description:
        "The magnum build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    NETLIFY: z.string().optional().meta({
      description:
        "The netlify build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    NEVERCODE: z.string().optional().meta({
      description:
        "The nevercode build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    PROW_JOB_ID: z.string().optional().meta({
      description:
        "The prow job ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    RELEASE_BUILD_ID: z.string().optional().meta({
      description:
        "The release build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    RENDER: z.string().optional().meta({
      description:
        "The render build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    SAILCI: z.string().optional().meta({
      description:
        "The sailci build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    HUDSON: z.string().optional().meta({
      description:
        "The hudson build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    SCREWDRIVER: z.string().optional().meta({
      description:
        "The screwdriver build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    SEMAPHORE: z.string().optional().meta({
      description:
        "The semaphore build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    SOURCEHUT: z.string().optional().meta({
      description:
        "The sourcehut build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    SPACESHIP_CI: z.string().optional().meta({
      description:
        "The spaceship build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    STRIDER: z.string().optional().meta({
      description:
        "The strider build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TASK_ID: z.string().optional().meta({
      description: "The task ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TEAMCITY_VERSION: z.string().optional().meta({
      description:
        "The teamcity version. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    TRAVIS: z.string().optional().meta({
      description:
        "The travis build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    VELA: z.string().optional().meta({
      description:
        "The vela build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    NOW_BUILDER: z.string().optional().meta({
      description:
        "The now builder build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    APPCENTER_BUILD_ID: z.string().optional().meta({
      description:
        "The appcenter build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    CI_XCODE_PROJECT: z.string().optional().meta({
      description:
        "The xcode project build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    XCS: z.string().optional().meta({
      description:
        "The xcode server build ID. This value is set by certain CI/CD systems.",
      readonly: true,
      runtime: true,
      hidden: true,
      category: "node"
    }),
    DATA_DIR: z.string().optional().meta({
      title: "Data Directory",
      description:
        "The application's runtime data directory. This variable is used to override the base path of the system's local application data directory. This variable is used to set the `$storm.paths.data` property.",
      runtime: true,
      category: "node"
    }),
    CONFIG_DIR: z.string().optional().meta({
      title: "Configuration Directory",
      description:
        "The application's configuration data directory. This variable is used to override the base path of the system's local application configuration directory. This variable is used to set the `$storm.paths.config` property.",
      runtime: true,
      category: "node"
    }),
    CACHE_DIR: z.string().optional().meta({
      title: "Cache Directory",
      description:
        "The application's cached data directory. This variable is used to override the base path of the system's local cache data directory. This variable is used to set the `$storm.paths.cache` property.",
      runtime: true,
      category: "node"
    }),
    LOG_DIR: z.string().optional().meta({
      title: "Log Directory",
      description:
        "The application's logging directory. This variable is used to override the base path of the system's local application log directory. This variable is used to set the `$storm.paths.log` property.",
      runtime: true,
      category: "node"
    }),
    TEMP_DIR: z.string().optional().meta({
      title: "Temporary Directory",
      description:
        "The application's temporary data directory. This variable is used to override the base path of the system's local temporary data directory. This variable is used to set the `$storm.paths.temp` property.",
      runtime: true,
      category: "node"
    }),
    LOCALAPPDATA: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the current user's local application data directory on Windows. This variable is used to specify a path to application data that is specific to the current user. This variable can be used to set the `$storm.paths.data`, `$storm.paths.cache`, and `$storm.paths.log` properties.",
        see: [
          "https://www.advancedinstaller.com/appdata-localappdata-programdata.html"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    APPDATA: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the application data directory on Windows. This variable is used to specify a path to application data that is specific to the current user. This variable can be used to set the `$storm.paths.config` property.",
        see: [
          "https://www.advancedinstaller.com/appdata-localappdata-programdata.html"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    XDG_DATA_HOME: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the data path in the home directory on Linux systems using the XDG base directory specification. This variable is used to specify a path to application data that is specific to the current user. This variable can be used to set the `$storm.paths.data` property.",
        see: [
          "https://gist.github.com/roalcantara/107ba66dfa3b9d023ac9329e639bc58c"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    XDG_CONFIG_HOME: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the configuration path in the home directory on Linux systems using the XDG base directory specification. This variable is used to specify a path to configuration data that is specific to the current user. This variable can be used to set the `$storm.paths.config` property.",
        see: [
          "https://gist.github.com/roalcantara/107ba66dfa3b9d023ac9329e639bc58c"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    XDG_CACHE_HOME: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the cache path in the home directory on Linux systems using the XDG base directory specification. This variable is used to specify a path to cache data that is specific to the current user. This variable can be used to set the `$storm.paths.cache` property.",
        see: [
          "https://gist.github.com/roalcantara/107ba66dfa3b9d023ac9329e639bc58c"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    XDG_STATE_HOME: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the state directory on Linux systems using the XDG base directory specification. This variable is used to specify a path to application state data that is specific to the current user. This variable can be used to set the `$storm.paths.state` property.",
        see: [
          "https://gist.github.com/roalcantara/107ba66dfa3b9d023ac9329e639bc58c"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    XDG_RUNTIME_DIR: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the runtime directory on Linux systems using the XDG base directory specification. This variable is used to specify a path to runtime data that is specific to the current user. This variable can be used to set the `$storm.paths.temp` property.",
        see: [
          "https://gist.github.com/roalcantara/107ba66dfa3b9d023ac9329e639bc58c"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      }),
    DEVENV_RUNTIME: z
      .string()
      .optional()
      .meta({
        description:
          "A variable that specifies the Devenv runtime directory. This variable is used to specify a path to application data that is specific to the current Nix environment. This variable can be used to set the `$storm.paths.temp` property.",
        see: [
          "https://devenv.sh/files-and-variables/#devenv_dotfile",
          "https://nixos.org/"
        ],
        readonly: true,
        runtime: true,
        hidden: true,
        category: "node"
      })
  })
  .meta({
    description:
      "The base environment configuration used by Powerlines applications. This schema defines the environment variables, configuration options, and runtime settings used by applications."
  });

/**
 * Inferred environment configuration type from {@link envSchema}.
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Input type for {@link envSchema} before defaults applied.
 */
export type EnvInput = z.input<typeof envSchema>;

/**
 * Zod schema for the base secrets configuration used by Powerlines applications.
 *
 * @remarks
 * Secrets have no defaults and must stay confidential (excluded from the client).
 */
export const secretsSchema = z
  .object({
    ENCRYPTION_KEY: z.string().meta({
      title: "Encryption Key",
      description:
        "The secret key used for encryption and decryption. This variable is used to provide a secret key for encryption and decryption of sensitive data. It is important that this value is kept confidential and not exposed in client-side code or public repositories."
    })
  })
  .meta({
    description:
      "The base secrets configuration used by Powerlines applications."
  });

/**
 * Inferred secrets configuration type from {@link secretsSchema}.
 */
export type Secrets = z.infer<typeof secretsSchema>;

/**
 * Input type for {@link secretsSchema}.
 */
export type SecretsInput = z.input<typeof secretsSchema>;
