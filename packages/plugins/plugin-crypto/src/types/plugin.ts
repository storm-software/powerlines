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
  EnvPluginContext,
  EnvPluginOptions,
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "@powerlines/plugin-env/types/plugin";

export interface CryptoPluginOptions {
  /**
   * The application specific secret used for encrypting and decrypting data.
   *
   * @remarks
   * If not provided, the plugin will attempt to read the key from the `SALT` environment variable.
   */
  salt?: string;

  /**
   * The encryption key used for encrypting and decrypting data.
   *
   * @remarks
   * If not provided, the plugin will attempt to read the key from the `ENCRYPTION_KEY` environment variable.
   */
  encryptionKey?: string;

  /**
   * Options for the Env plugin.
   */
  env?: EnvPluginOptions;
}

export interface CryptoPluginUserConfig extends EnvPluginUserConfig {
  /**
   * Options for the Crypto plugin.
   */
  crypto?: Omit<CryptoPluginOptions, "env">;
}

export interface CryptoPluginResolvedConfig extends EnvPluginResolvedConfig {
  /**
   * Options for the Crypto plugin.
   */
  crypto: Required<Omit<CryptoPluginOptions, "env">>;
}

export type CryptoPluginContext<
  TResolvedConfig extends CryptoPluginResolvedConfig =
    CryptoPluginResolvedConfig
> = EnvPluginContext<TResolvedConfig>;
