import { App } from "./app.ts";
import {
  ServerRequest,
  STATUS_TEXT,
  createError,
  getCookies,
} from "./deps.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { delegates } from "./utils/delegates.ts";

const COOKIES = Symbol("context#cookies");

export class Context {
  [key: string]: any
  [COOKIES]: Object;

  public app: App;
  public request: Request;
  public response: Response;
  public path: string = "";
  public req: ServerRequest;
  public res: Response;

  constructor(
    app: App,
    req: ServerRequest,
    request: Request,
    response: Response,
  ) {
    this.request = request;
    this.response = response;
    this.app = app;
    this.req = req;
    this.res = response;
    this[COOKIES] = {};

    delegates(this, "response")
      .method("attachment")
      .method("redirect")
      .method("remove")
      .method("vary")
      .method("has")
      .method("set")
      .method("append")
      .method("flushHeaders")
      .access("status")
      .access("message")
      .access("body")
      .access("length")
      .access("type")
      .access("lastModified")
      .access("etag")
      .getter("writable");

    delegates(this, "request").method("acceptsLanguages")
      .method("acceptsEncodings")
      .method("acceptsCharsets")
      .method("accepts")
      .method("get")
      .method("is")
      .access("querystring")
      .access("idempotent")
      .access("socket")
      .access("search")
      .access("method")
      .access("query")
      .access("path")
      .access("url")
      .access("accept")
      .getter("origin")
      .getter("href")
      .getter("subdomains")
      .getter("protocol")
      .getter("host")
      .getter("hostname")
      .getter("URL")
      .getter("header")
      .getter("headers")
      .getter("secure")
      .getter("stale")
      .getter("fresh")
      .getter("ips")
      .getter("ip");
  }

  /**
   * inspect() implementation, which
   * just returns the JSON output.
   */
  inspect() {
    return this.toJSON();
  }

  toJSON() {
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app,
      originalUrl: this.originalUrl,
      req: "<original Deno req>",
      res: "<original Deno res>",
      socket: "<original Deno Conn>",
    };
  }

  /**
   * Throw an error with `msg` and optional `status`
   * defaulting to 500. Note that these are user-level
   * errors, and the message may be exposed to the client.
   *
   *    this.throw(403)
   *    this.throw(400, 'name required')
   *    this.throw('something exploded')
   *    this.throw(new Error('invalid'))
   *    this.throw(400, new Error('invalid'))
   *    * See: https://github.com/jshttp/http-errors
   *
   *    Note: `status` should only be passed as the first parameter.
   *
   *    @param {String|Number|Error} err, msg or status
   *    @param {String|Number|Error} [err, msg or status]
   *    @param {Object} [props]
   */
  throw(...args: any[]): never {
    let status = 500, message = "Bad Request", props;

    args.forEach((value) => {
      switch (true) {
        case typeof value == "object" && value instanceof Error:
          message = value.message;
          break;
        case typeof value == "object" && !(value instanceof Error):
          props = value;
          break;
        case typeof value === "string":
          message = value;
          break;
        case typeof value === "number":
          status = value;
          break;
        case typeof value === "number":
          status = value;
          break;
      }
    });

    throw createError(status, message, props);
  }

  onerror(err?: any) {
    if (null == err) return;

    if (!(err instanceof Error)) {
      err = typeof err === "object" ? JSON.stringify(err) : err;
      err = new Error(`non-error thrown: ${err}`);
    }

    this.app.emit("error", err, this);

    if (!this.writable) {
      return;
    }

    const headerKeys: string[] = [];
    this.response.headers.forEach((value, key) => {
      headerKeys.push(key);
    });
    headerKeys.forEach((key) => {
      this.remove(key);
    });

    // then set those specified
    if (err.headers) {
      Object.keys(err.headers).forEach((key) => {
        this.set(key, err.headers[key]);
      });
    }

    // force text/plain
    this.type = "text";

    const getStatusCode = (err: any) => {
      switch (true) {
        case err instanceof Deno.errors.NotFound || "ENOENT" === err.code:
          return 404;
        case err.status && typeof err.status === "number" && err.status <= 500:
          return err.status;
        case err.statusCode && typeof err.statusCode === "number" &&
          err.status <= 500:
          return err.statusCode;
        default:
          return 500;
      }
    };

    const statusCode = this.status = getStatusCode(err);

    this.body = err.expose ? err.message : STATUS_TEXT.get(statusCode);

    this.req.respond(this.response.toServerResponse());
  }

  get cookies() {
    if (!this[COOKIES]) {
      this[COOKIES] = getCookies(this.req);
    }
    return this[COOKIES];
  }

  set cookies(cookies) {
    this[COOKIES] = cookies;
  }
}
