import {
  serve,
  serveTLS,
  HTTPSOptions,
  HTTPOptions,
  Server,
} from "./deps.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
// import { Middleware } from "./@types/koa.d.ts";
import { Middleware } from "./types.d.ts";
import { Context } from "./context.ts";
import { compose } from "./compose.ts";
import { statusEmpty } from "./utils/statusEmpty.ts";
import { byteLength } from "./utils/byteLength.ts";
import { isReader } from "./utils/isReader.ts";

export class App {
  server: Server | undefined;
  middleware: Middleware[] = [];

  public async listen(
    options?: number | string | HTTPOptions | HTTPSOptions,
  ): Promise<Server> {
    switch (typeof options) {
      case "undefined":
        options = { port: 80 };
        break;
      case "number":
        options = { port: options };
        break;
    }

    const isTls = typeof options !== "string" &&
      typeof (options as HTTPSOptions).certFile !== "undefined";

    this.server = isTls ? serveTLS(options as HTTPSOptions) : serve(options);

    // try {
    const fnMiddleware = compose(this.middleware);

    for await (const request of this.server) {
      const req = new Request(request);
      const res = new Response({
        headers: new Headers(),
      });

      const ctx = new Context(this, request, req, res);

      this.handleRequest(ctx, fnMiddleware);

      // ctx.req.respond({ status: 200, body: "<h1>Hello World</h1>" });
    }
    // } catch (error) {
    //   this.server.close();
    //   throw new Error(error);
    // }

    return this.server;
  }

  public use(fn: Middleware): App {
    this.middleware.push(fn);
    return this;
  }

  private handleRequest(ctx: Context, fnMiddleware: any) {
    ctx.res.status = 404;
    const onerror = (err: Error) => ctx.onerror(err);
    const handleResponse = () => this.respond(ctx);

    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  private async respond(
    ctx: Context,
  ): Promise<void> {
    if (!ctx.writable) {
      console.log("respond: ctx.writable === false");
      return;
    }

    let body = ctx.body;
    const code = ctx.status;

    // ignore body
    if (statusEmpty[code]) {
      // strip headers
      ctx.body = null;
      console.log("respond: empty response");
      return ctx.req.respond(ctx.res.toJSON());
    }

    if ("HEAD" === ctx.method) {
      if (!ctx.response.has("Content-Length")) {
        const { length } = ctx.response;
        if (length && Number.isInteger(length)) ctx.length = length;
      }

      console.log("respond: HEAD response");
      const _res = Object.assign({}, ctx.res.toJSON(), { body: undefined });

      return ctx.req.respond(_res);
    }

    // status body
    if (null == body) {
      // if (ctx.response._explicitNullBody) {
      //   ctx.response.remove("Content-Type");
      //   ctx.response.remove("Transfer-Encoding");
      //   console.log("respond: explicit null body");
      //   const _res = Object.assign({}, ctx.res);
      //   _res.body = undefined;
      //   return ctx.req.respond(_res);
      // }
      if (ctx.req.protoMajor >= 2) {
        body = String(code);
      } else {
        body = ctx.message || String(code);
      }
      ctx.type = "text";
      ctx.length = byteLength(body);
      console.log(`respond: default null reponse: `, ctx.res);
      return ctx.req.respond(Object.assign({}, ctx.res.toJSON(), { body }));
    }

    // responses
    if (
      "string" === typeof body ||
      body instanceof Uint8Array ||
      isReader(body)
    ) {
      console.log(`respond: string, Uint8Array or Deno.Reader response`);
      return ctx.req.respond(Object.assign({}, ctx.res.toJSON(), { body }));
    }

    // body: json
    body = JSON.stringify(body);
    ctx.length = byteLength(body);

    return ctx.req.respond(Object.assign({}, ctx.res.toJSON(), { body }));
  }
}
