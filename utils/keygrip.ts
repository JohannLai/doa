/*!
 * Based on https://github.com/crypto-utils/keygrip/blob/master/index.js
 * Copyright(c) 2011-2014 Jed Schmidt
 * Copyright(c) 2020 Johannlai
 * MIT Licensed
 */

import { HmacSha256, HmacSha512, base64url } from "../deps.ts";

export enum Algorithm {
  SHA256 = "sha256",
  SHA512 = "sha512",
}

export class Keygrip {
  #keys: string[];
  #algorithm: Algorithm;

  constructor(keys: string[], algorithm: Algorithm = Algorithm.SHA256) {
    if (!keys || !(0 in keys)) {
      throw new Error("Keys must be provided.");
    }

    this.#keys = keys;
    this.#algorithm = algorithm;
  }

  sign(data: string, key?: string | number): string {
    return "";
  }
}
