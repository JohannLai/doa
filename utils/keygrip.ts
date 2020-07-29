/*!
 * Based on https://github.com/crypto-utils/keygrip/blob/master/index.js
 * Copyright(c) 2011-2014 Jed Schmidt
 * Copyright(c) 2020 Johannlai
 * MIT Licensed
 */

import { HmacSha256, HmacSha512, base64url } from "../deps.ts";

type Algorithm = "sha256" | "sha512";

export class Keygrip {
  #keys: string[];
  #algorithm: Algorithm;

  constructor(keys: string[], algorithm: Algorithm = "sha256") {
    if (!keys || !(0 in keys)) {
      throw new Error("Keys must be provided.");
    }

    this.#keys = keys;
    this.#algorithm = algorithm;
  }

  sign(data: string, key?: string | number): string {
    let buf: ArrayBuffer;
    const sKey = (typeof key == "number" ? this.#keys[key] : key) ??
      this.#keys[0];

    switch (this.#algorithm) {
      case "sha256":
        buf = new HmacSha256(sKey).update(data).arrayBuffer();
        break;

      case "sha512":
        buf = new HmacSha512(sKey).update(data).arrayBuffer();
        break;
    }

    return base64url.encode(buf);
  }

  verify(data: string, digest: string): boolean {
    return this.index(data, digest) != -1;
  }

  index(data: string, digest: string) {
    for (var i = 0, l = this.#keys.length; i < l; i++) {
      if (this.compare(digest, this.sign(data, this.#keys[i]))) {
        return i;
      }
    }

    return -1;
  }

  private compare(a: string, b: string): boolean {
    const key = crypto.getRandomValues(new Uint8Array(32));
    const ah = new HmacSha256(key).update(a).digest();
    const bh = new HmacSha256(key).update(b).digest();

    return ah.length === bh.length && ah.every((x, i) => x === bh[i]);
  }
}
