import { App } from "./app.ts";
import { ServerRequest } from "./deps.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { delegates } from "./utils/delegates.ts";

export class Context {
  [key: string]: any

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
}
