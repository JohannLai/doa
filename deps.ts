// This file contains the external dependencies that doa depends upon.

// `std` dependencies
export {
  serve,
  serveTLS,
  HTTPSOptions,
  HTTPOptions,
  Server,
  ServerRequest,
  Response,
} from "https://deno.land/std@0.59.0/http/server.ts";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.59.0/http/http_status.ts";
export {
  Cookies,
  Cookie,
  getCookies,
  setCookie,
  deleteCookie,
  SameSite,
} from "https://deno.land/std@0.59.0/http/cookie.ts";
export { encoder } from "https://deno.land/std@0.59.0/encoding/utf8.ts";
export { EventEmitter } from "https://deno.land/std@0.59.0/node/events.ts";
export { assert } from "https://deno.land/std@0.59.0/testing/asserts.ts";
export {
  stringify as qsStringify,
  parse as qsParse,
} from "https://deno.land/std@0.59.0/node/querystring.ts";

export { HmacSha256 } from "https://deno.land/std@0.59.0/hash/sha256.ts";
export { HmacSha512 } from "https://deno.land/std@0.59.0/hash/sha512.ts";
export * as base64url from "https://deno.land/std@0.59.0/encoding/base64url.ts";

// 3rd party dependencies
export {
  createError,
  HttpError,
  Props,
} from "https://deno.land/x/http_errors/mod.ts";
export { vary, append } from "https://deno.land/x/vary/mod.ts";
export { encodeUrl } from "https://deno.land/x/encodeurl/mod.ts";
export {
  contentType,
  lookup,
} from "https://deno.land/x/media_types@v2.3.6/mod.ts";
export { parse } from "https://deno.land/x/content_type/mod.ts";
export { Accepts } from "https://deno.land/x/accepts@1.0.0/mod.ts";
export { isIP } from "https://deno.land/x/isIP/mod.ts";
export { ms } from "https://deno.land/x/ms/ms.ts";
