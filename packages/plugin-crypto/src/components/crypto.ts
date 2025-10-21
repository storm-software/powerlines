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

import { getFileHeader } from "powerlines/lib/utilities/file-header";
import { CryptoPluginContext } from "../types/plugin";

/**
 * Generates the crypto module content.
 *
 * @param context - The build context containing runtime information.
 * @returns A string representing the crypto module code.
 */
export function cryptoModule(context: CryptoPluginContext) {
  return `
/**
 * The cryptography module provides custom helper functions to support encrypting and decrypting data.
 *
 * @module ${context.config.output.builtinPrefix}:crypto
 */

${getFileHeader(context)}

import { xchacha20poly1305, chacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes, managedNonce } from "@noble/ciphers/utils.js";
import { scrypt } from "@noble/hashes/scrypt.js";
import { blake3 } from "@noble/hashes/blake3.js";

const CIPHER_KEY_LENGTH = 32; // https://stackoverflow.com/a/28307668/4397028
const CIPHER_NONCE_LENGTH = 24;

const nonce = randomBytes(CIPHER_NONCE_LENGTH);
const chacha = xchacha20poly1305("${context.env.parsed.ENCRYPTION_KEY}", nonce);

/**
 * Symmetrically encrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher.
 *
 * @see https://en.wikipedia.org/wiki/ChaCha20-Poly1305
 *
 * @param plaintext - The data to encrypt.
 * @returns The encrypted data.
 */
export function encrypt(plaintext: string): string {
  return chacha.encrypt(
    nonce,
    new TextEncoder().encode(plaintext),
    null
  );
}

/**
 * Symmetrically decrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher.
 *
 * @see https://en.wikipedia.org/wiki/ChaCha20-Poly1305
 *
 * @param encrypted - The encrypted data to decrypt.
 * @returns The decrypted data.
 */
export function decrypt(encrypted: string): string {
  const decrypted = chacha.decrypt(
    nonce,
    encrypted,
    null
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Symmetrically encrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher with a password.
 *
 * @see https://en.wikipedia.org/wiki/ChaCha20-Poly1305
 *
 * @param password - The password used to derive the encryption key.
 * @param plaintext - The data to encrypt.
 * @returns The encrypted data.
 */
export function encryptWithPassword(password: string, plaintext: string): string {
  const key = scrypt(
    new TextEncoder().encode(password),
    ${context.config.crypto.salt ? context.config.crypto.salt : "nonce"},
    1048576, // requires 1GB of RAM to calculate
    8,
    1,
    CIPHER_KEY_LENGTH
  );

  return chacha20poly1305(key).encrypt(
    nonce,
    new TextEncoder().encode(plaintext),
    null
  );
}

/**
 * Symmetrically decrypts data using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) cipher with a password.
 *
 * @see https://en.wikipedia.org/wiki/ChaCha20-Poly1305
 *
 * @param password - The password used to derive the decryption key.
 * @param encrypted - The encrypted data to decrypt.
 * @returns The decrypted data.
 */
export function decryptWithPassword(password: string, encrypted: string): string {
  const key = scrypt(
    new TextEncoder().encode(password),
    ${context.config.crypto.salt ? context.config.crypto.salt : "nonce"},
    1048576, // requires 1GB of RAM to calculate
    8,
    1,
    CIPHER_KEY_LENGTH
  );

  const decrypted = chacha20poly1305(key).decrypt(
    nonce,
    encrypted,
    null
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Hashes data using the [BLAKE3](https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE3) hash function.
 *
 * @see https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE3
 *
 * @param data - The data to hash.
 * @returns The hashed data.
 */
export function hash(data: string): string {
  return Buffer.from(
    blake3(new TextEncoder().encode(data), {
      key: new TextEncoder().encode(${
        context.config.crypto.salt ? context.config.crypto.salt : "powerlines"
      })
    })
  ).toString("hex");
}

// Export noble cipher and hash functions for advanced usage

export * from "@noble/ciphers/chacha.js";
export * from "@noble/ciphers/aes.js";
export * from "@noble/ciphers/utils.js";
export * from '@noble/hashes/blake3.js';
export * from '@noble/hashes/pbkdf2.js';
export * from '@noble/hashes/scrypt.js';
export * from '@noble/hashes/utils.js';

`;
}
