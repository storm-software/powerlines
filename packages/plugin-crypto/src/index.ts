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

import { bytesToHex, randomBytes } from "@noble/ciphers/utils.js";
import env from "@powerlines/plugin-env";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { Plugin } from "powerlines/types/plugin";
import { cryptoModule } from "./components/crypto";
import { CryptoPluginContext, CryptoPluginOptions } from "./types/plugin";

export * from "./components";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export function plugin(
  options: CryptoPluginOptions = {}
): Plugin<CryptoPluginContext> {
  return {
    name: "crypto",
    dependsOn: [env(options.env)],
    config() {
      return {
        crypto: {
          salt: options.salt,
          encryptionKey: options.encryptionKey
        }
      };
    },
    configResolved() {
      this.dependencies["@noble/ciphers"] = "^2.0.1";
      this.dependencies["@noble/hashes"] = "^2.0.1";

      this.config.crypto.salt ??= this.env.parsed.SALT!;
      if (!this.config.crypto.salt) {
        this.log(
          LogLevelLabel.WARN,
          `No salt provided to the Crypto plugin - a salt value will be generated automatically. Please note: It's highly recommended to provide a unique salt value via the \`salt\` plugin option or the \`SALT\` environment variable.`
        );

        this.config.crypto.salt = bytesToHex(randomBytes(12));
      }

      this.config.crypto.encryptionKey ??= this.env.parsed.ENCRYPTION_KEY!;
      if (!this.config.crypto.encryptionKey) {
        this.log(
          LogLevelLabel.WARN,
          `No encryption key provided to the Crypto plugin - a secure key will be generated automatically. Please note: it's highly recommended to provide a secure encryption key via the \`encryptionKey\` plugin option or the \`ENCRYPTION_KEY\` environment variable.`
        );

        this.config.crypto.encryptionKey = bytesToHex(randomBytes(32));
      }
    },
    async prepare() {
      this.log(
        LogLevelLabel.TRACE,
        `Preparing the Crypto runtime artifacts for the Powerlines project.`
      );

      await this.emitBuiltin(
        await Promise.resolve(cryptoModule(this)),
        "crypto",
        "crypto.ts"
      );
    }
  };
}

export default plugin;
