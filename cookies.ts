import {
  getCookies,
  setCookie,
  deleteCookie,
  Cookie,
  Response as ServerResponse,
  ServerRequest,
  SameSite,
  ms,
} from "./deps.ts";

import { Keygrip } from "./utils/keygrip.ts";

export interface CookiesInitOptions {
  keys?: string[] | Keygrip;
  secure?: boolean;
}

export interface CookieOptions {
  maxAge?: number | string;
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  signed?: boolean;
  overwrite?: boolean;
  sameSite?: SameSite | true;
}

export class Cookies {
  #res: ServerResponse;
  #req: ServerRequest;
  #secure: boolean = false;
  #keys?: Keygrip;

  #cache: Map<string, string>;

  private cache: {
    [index: string]: RegExp;
  } = {};

  constructor(
    req: ServerRequest,
    res: ServerResponse,
    options?: CookiesInitOptions,
  ) {
    this.#res = res;
    this.#req = req;
    this.#cache = new Map();

    if (options) {
      const { keys, secure } = options;
      this.#secure = !!secure;
      if (keys) {
        this.#keys = keys instanceof Keygrip ? keys : new Keygrip(keys);
      }
    }

    const cookies = getCookies(req);
    for (const key of Object.keys(cookies)) {
      this.#cache.set(key, cookies[key]);
    }
  }

  set(name: string, value: any, options: CookieOptions = {}): this {
    if (!value && !options) {
      return this.delete(name), this;
    }

    value = String(value);

    if (!options.overwrite && this.#cache.has(name)) {
      return this;
    }

    let {
      secure,
      maxAge,
      expires,
      sameSite,
      domain,
      path = "/",
      httpOnly = true,
    } = options;

    if (!this.#secure && secure) {
      throw new Error("Cannot send secure cookie over unencrypted connection.");
    }

    if (maxAge && typeof maxAge == "string") {
      const res = ms(maxAge) as number;
      maxAge = (res / 1000) | 0;
    }

    if (expires) {
      if (typeof expires == "string") {
        const time = ms(expires);
        if (typeof time == "number") {
          expires = Date.now() + time;
        }
      }

      expires = new Date(expires);
    }

    const cookie = {
      name,
      value,
      secure,
      domain,
      path,
      httpOnly,
      sameSite,
      maxAge,
      expires,
    } as Cookie;

    cookie.secure = secure ?? this.#secure;

    setCookie(this.#res, cookie);

    const signed = options.signed ?? !!this.#keys;
    if (signed) {
      if (!this.#keys) {
        throw new Error(".keys is required to signed cookies");
      }

      cookie.name += ".sig";
      cookie.value = this.#keys.sign(`${cookie.name}=${cookie.value}`);
      setCookie(this.#res, cookie);
    }

    return this;
  }

  get(
    name: string,
    options?: Pick<CookieOptions, "signed">,
  ): string | undefined {
    const signed = options?.signed ?? !!this.#keys;
    const value = this.#cache.get(name);

    if (!signed) {
      return value;
    }

    const signatureName = `${name}.sig`;
    const signature = this.#cache.get(signatureName);

    if (!signature) {
      return value;
    }

    if (!this.#keys) {
      throw new Error("Keys required for signed cookies");
    }

    const data = `${name}=${value}`;
    const idx = this.#keys.index(data, signature);
    if (idx == -1) {
      return this.delete(signatureName), void 0;
    } else if (idx) {
      this.set(signatureName, this.#keys.sign(data), { signed: false });
    }

    return value;
  }

  delete(name: string, options: CookieOptions = {}): boolean {
    this.set(name, null, options);
    return true;
  }
}
