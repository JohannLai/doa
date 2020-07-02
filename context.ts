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
      .getter("headerSent")
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
   *
   */
  throw(...args: any[]): never {
    let status, message, props;

    switch (typeof args[0]) {
      case "number":
        ([status, message, props] = args);
        break;
      case "string":
        ([message, status, props] = args);
        break;
    }

    throw createError(status, message, props);
  }

  onerror(err?: any) {
    // don't do anything if there is no error.
    if (null == err) return;

    if (!(err instanceof Error)) {
      err = new Error(`non-error thrown: ${JSON.stringify(err)}`);
    }

    let headerSent = false;
    if (this.headerSent || !this.writable) {
      headerSent = (err as any).headerSent = true;
    }

    this.app.emit("error", err, this);

    // nothing we can do here other
    // than delegate to the app-level
    // handler and log.
    if (headerSent) {
      return;
    }

    // then set those specified
    this.set(err.headers);

    // force text/plain
    this.type = "text";

    let statusCode = err.status || err.statusCode;

    // ENOENT support
    if ("ENOENT" === err.code) {
      statusCode = 404;
    }

    if (
      "number" !== typeof statusCode ||
      !STATUS_TEXT.has(statusCode)
    ) {
      statusCode = 500;
    }

    // respond
    const code = STATUS_TEXT.get(statusCode);
    const msg = err.expose ? err.message : code;
    this.status = err.status = statusCode;

    this.req.respond(Object.assign({}, this.res.toJSON(), { body: msg }));
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
