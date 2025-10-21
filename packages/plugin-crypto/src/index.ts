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

import env from "@powerlines/plugin-env";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { joinPaths } from "@stryke/path/join";
import { Plugin } from "../../powerlines/src/types/plugin";
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

      this.config.crypto.salt ??= this.env.parsed.SALT;
      if (!this.config.crypto.salt) {
        this.log(
          LogLevelLabel.WARN,
          `No salt provided for the Crypto plugin. ` +
            `It's highly recommended to provide a unique salt via the plugin options or the SALT environment variable.`
        );
      }

      this.config.crypto.encryptionKey ??= this.env.parsed.ENCRYPTION_KEY;
      if (!this.config.crypto.encryptionKey) {
        this.log(
          LogLevelLabel.WARN,
          `No encryption key provided for the Crypto plugin. ` +
            `It's highly recommended to provide a secure encryption key via the plugin options or the ENCRYPTION_KEY environment variable.`
        );
      }
    },
    async prepare() {
      this.log(
        LogLevelLabel.TRACE,
        `Preparing the Crypto runtime artifacts for the Powerlines project.`
      );

      await this.fs.writeBuiltinFile(
        "crypto",
        joinPaths(this.builtinsPath, "crypto.ts"),
        await Promise.resolve(cryptoModule(this))
      );
    }
  };
}

export default plugin;
