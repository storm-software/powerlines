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

import { code, Show, splitProps } from "@alloy-js/core";
import { FunctionDeclaration, VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@power-plant/alloy-js/core/components/spacing";
import {
  TSDoc,
  TSDocLink,
  TSDocParam,
  TSDocReturns
} from "@power-plant/alloy-js/typescript/components/tsdoc";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  BuiltinFile,
  BuiltinFileProps
} from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import defu from "defu";
import type { CryptoPluginContext } from "../types/plugin";

export type CryptoBuiltinProps = Omit<BuiltinFileProps, "id">;

/**
 * Generates the cryptography builtin module for the Powerlines project.
 */
export function CryptoBuiltin(props: CryptoBuiltinProps) {
  const [{ children, imports }, rest] = splitProps(props, [
    "children",
    "imports"
  ]);

  const context = usePowerlines<CryptoPluginContext>();
  const encryptionKey = context.config.crypto.encryptionKey;
  const salt = context.config.crypto.salt;
  const saltHex = salt || "nonce";
  const hashKeyExpr = salt
    ? `hexToBytes("${salt}")`
    : `new TextEncoder().encode("powerlines")`;

  return (
    <BuiltinFile
      id="crypto"
      description="The cryptography module provides custom helper functions to support encrypting and decrypting data."
      {...rest}
      imports={defu(
        {
          "@noble/ciphers/chacha.js": [
            { name: "xchacha20poly1305" },
            { name: "chacha20poly1305" }
          ],
          "@noble/ciphers/utils.js": [
            { name: "randomBytes" },
            { name: "hexToBytes" }
          ],
          "@noble/hashes/scrypt.js": [{ name: "scrypt" }],
          "@noble/hashes/blake3.js": [{ name: "blake3" }]
        },
        imports ?? {}
      )}>
      <Show when={Boolean(encryptionKey)}>
        <VarDeclaration
          const
          name="nonce"
          initializer={code`randomBytes(24)`}
        />
        <Spacing />
        <VarDeclaration
          const
          name="chacha"
          initializer={code`xchacha20poly1305(hexToBytes("${encryptionKey}"), nonce)`}
        />
        <Spacing />
        <TSDoc heading="Symmetrically encrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher.">
          <TSDocLink>
            {`https://en.wikipedia.org/wiki/ChaCha20-Poly1305`}
          </TSDocLink>
          <TSDocParam name="plaintext">{`The data to encrypt.`}</TSDocParam>
          <TSDocReturns>{`The encrypted data.`}</TSDocReturns>
        </TSDoc>
        <FunctionDeclaration
          name="encrypt"
          export
          parameters={[{ name: "plaintext", type: "string" }]}
          returnType="string">
          {code`return chacha.encrypt(
    nonce,
    new TextEncoder().encode(plaintext),
    null
  );`}
        </FunctionDeclaration>
        <Spacing />
        <TSDoc heading="Symmetrically decrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher.">
          <TSDocLink>
            {`https://en.wikipedia.org/wiki/ChaCha20-Poly1305`}
          </TSDocLink>
          <TSDocParam name="encrypted">
            {`The encrypted data to decrypt.`}
          </TSDocParam>
          <TSDocReturns>{`The decrypted data.`}</TSDocReturns>
        </TSDoc>
        <FunctionDeclaration
          name="decrypt"
          export
          parameters={[{ name: "encrypted", type: "string" }]}
          returnType="string">
          {code`const decrypted = chacha.decrypt(
    nonce,
    encrypted,
    null
  );

  return new TextDecoder().decode(decrypted);`}
        </FunctionDeclaration>
        <Spacing />
      </Show>

      <TSDoc heading="Symmetrically encrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher with a password.">
        <TSDocLink>
          {`https://en.wikipedia.org/wiki/ChaCha20-Poly1305`}
        </TSDocLink>
        <TSDocParam name="password">
          {`The password used to derive the encryption key.`}
        </TSDocParam>
        <TSDocParam name="plaintext">{`The data to encrypt.`}</TSDocParam>
        <TSDocReturns>{`The encrypted data.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="encryptWithPassword"
        export
        parameters={[
          { name: "password", type: "string" },
          { name: "plaintext", type: "string" }
        ]}
        returnType="string">
        {code`const key = scrypt(
    new TextEncoder().encode(password),
    hexToBytes("${saltHex}"),
    1048576, // requires 1GB of RAM to calculate
    8,
    1,
    32
  );

  return chacha20poly1305(key).encrypt(
    nonce,
    new TextEncoder().encode(plaintext),
    null
  );`}
      </FunctionDeclaration>
      <Spacing />

      <TSDoc heading="Symmetrically decrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher with a password.">
        <TSDocLink>
          {`https://en.wikipedia.org/wiki/ChaCha20-Poly1305`}
        </TSDocLink>
        <TSDocParam name="password">
          {`The password used to derive the decryption key.`}
        </TSDocParam>
        <TSDocParam name="encrypted">
          {`The encrypted data to decrypt.`}
        </TSDocParam>
        <TSDocReturns>{`The decrypted data.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="decryptWithPassword"
        export
        parameters={[
          { name: "password", type: "string" },
          { name: "encrypted", type: "string" }
        ]}
        returnType="string">
        {code`const key = scrypt(
    new TextEncoder().encode(password),
    hexToBytes("${saltHex}"),
    1048576, // requires 1GB of RAM to calculate
    8,
    1,
    32
  );

  const decrypted = chacha20poly1305(key).decrypt(
    nonce,
    encrypted,
    null
  );

  return new TextDecoder().decode(decrypted);`}
      </FunctionDeclaration>
      <Spacing />

      <TSDoc heading="Hashes data using the [BLAKE3](https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE3) hash function.">
        <TSDocLink>
          {`https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE3`}
        </TSDocLink>
        <TSDocParam name="data">{`The data to hash.`}</TSDocParam>
        <TSDocReturns>{`The hashed data.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="hash"
        export
        parameters={[{ name: "data", type: "string" }]}
        returnType="string">
        {code`return Buffer.from(
    blake3(new TextEncoder().encode(data), {
      key: ${hashKeyExpr}
    })
  ).toString("hex");`}
      </FunctionDeclaration>
      <Spacing />

      {code`
// Export noble cipher and hash functions for advanced usage

export * from "@noble/ciphers/chacha.js";
export * from "@noble/ciphers/aes.js";
export * from "@noble/ciphers/utils.js";
export * from "@noble/hashes/blake3.js";
export * from "@noble/hashes/pbkdf2.js";
export * from "@noble/hashes/scrypt.js";
export * from "@noble/hashes/utils.js";
`}
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
