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
} from "https://deno.land/std@0.57.0/http/http_status.ts";
export {
  getCookies,
  Cookies,
} from "https://deno.land/std@0.59.0/http/cookie.ts";
export {
  acceptable,
  acceptWebSocket,
  WebSocket,
} from "https://deno.land/std@0.57.0/ws/mod.ts";
export { encoder } from "https://deno.land/std@0.59.0/encoding/utf8.ts";
export { EventEmitter } from "https://deno.land/std@0.59.0/node/events.ts";
export { assert } from "https://deno.land/std@0.59.0/testing/asserts.ts";

// 3rd party dependencies
export {
  createError,
  HttpError,
  Props,
} from "https://deno.land/x/http_errors/mod.ts";
export {
  stringify as qsStringify,
  parse as qsParse,
} from "https://deno.land/std@0.59.0/node/querystring.ts";
export {
  is,
  typeofrequest,
  hasBody,
} from "https://deno.land/x/type_is/mod.ts";
export { vary, append } from "https://deno.land/x/vary/mod.ts";
export { encodeUrl } from "https://deno.land/x/encodeurl/mod.ts";
export { contentType } from "https://deno.land/x/media_types@v2.3.6/mod.ts";
export { parse } from "https://deno.land/x/content_type/mod.ts";
export { Accepts } from "https://deno.land/x/accepts@1.0.0/mod.ts";
export { isIP } from "https://deno.land/x/isIP/mod.ts";
