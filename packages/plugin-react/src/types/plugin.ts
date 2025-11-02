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

import { BabelPluginOptions } from "@powerlines/plugin-babel/types/plugin";
import {
  EnvPluginContext,
  EnvPluginOptions,
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "@powerlines/plugin-env/types/plugin";
import { PluginOptions as ExternalReactCompilerOptions } from "babel-plugin-react-compiler";

export type ReactCompilerOptions = Omit<ExternalReactCompilerOptions, "logger">;

export interface ReactPluginOptions {
  /**
   * Control where the JSX factory is imported from.
   *
   * @see https://esbuild.github.io/api/#jsx-import-source
   *
   * @defaultValue "react"
   */
  jsxImportSource?: string;

  /**
   * Control how JSX is transformed.
   *
   * @remarks
   * Skipping React import with classic runtime is not supported from v4
   *
   * @defaultValue "automatic"
   */
  jsxRuntime?: "classic" | "automatic";

  /**
   * Options provided to the [React Compiler](https://npmjs.com/package/babel-plugin-react-compiler).
   *
   * @see https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Options.ts#L55
   * @see https://react.dev/blog/2025/04/21/react-compiler-rc
   *
   * @remarks
   * Set to `false` to disable the React Compiler. By default, the React Compiler is enabled and target is set to React 19.
   */
  compiler?: ReactCompilerOptions | false;

  /**
   * React Fast Refresh runtime URL prefix.
   *
   * @remarks
   * Useful in a module federation context to enable HMR by specifying the host application URL in the Vite config of a remote application.
   *
   * @example
   * reactRefreshHost: 'http://localhost:3000'
   */
  reactRefreshHost?: string;

  /**
   * Options to pass to the [Babel plugin](https://npmjs.com/package/\@powerlines/plugin-babel).
   */
  babel?: Partial<BabelPluginOptions>;

  /**
   * Options to pass to the [Env plugin](https://npmjs.com/package/\@powerlines/plugin-env).
   */
  env?: Partial<Omit<EnvPluginOptions, "babel">>;
}

export type ReactPluginUserConfig = EnvPluginUserConfig & {
  /**
   * Options for the React plugin.
   */
  react?: ReactPluginOptions;
};

export type ReactPluginResolvedConfig = EnvPluginResolvedConfig & {
  /**
   * Options for the React plugin.
   */
  react: ReactPluginOptions;
};

export type ReactPluginContext<
  TResolvedConfig extends ReactPluginResolvedConfig = ReactPluginResolvedConfig
> = EnvPluginContext<TResolvedConfig>;
