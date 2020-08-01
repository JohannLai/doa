import {
  serve,
  serveTLS,
  HTTPSOptions,
  HTTPOptions,
  Server,
  EventEmitter,
} from "./deps.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { Middleware } from "./types.d.ts";
import { Context } from "./context.ts";
import { compose } from "./compose.ts";

interface ApplicationOptions {
  proxy?: boolean;
  env?: string;
  keys?: string[];
}

export class App extends EventEmitter {
  server: Server | undefined;
  middleware: Middleware[] = [];
  silent: undefined | boolean = undefined;
  keys: string[] | undefined;
  proxy: boolean = false;
  secure: boolean = false;
  env: string = "development";
  context: Context;
  request: Request;
  response: Response;

  constructor(options?: ApplicationOptions) {
    super();

    if (options) {
      this.proxy = options.proxy ?? false;
      this.keys = options.keys;
      if (options.env) {
        this.env = options.env;
      } else if (Deno.env.get("DENO_ENV") !== undefined) {
        this.env = Deno.env.get("DENO_ENV")!;
      }
    }

    this.context = Object.create(Context);
    this.request = Object.create(Request);
    this.response = Object.create(Response);
  }

  public listen(
    options?: number | string | HTTPOptions | HTTPSOptions,
  ): Server {
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
    this.secure = isTls;
    this.handle(this.server);
    return this.server;
  }

  private async handle(server: Server): Promise<void> {
    const fnMiddleware = compose(this.middleware);

    if (!this.listenerCount("error")) this.on("error", this.onerror);

    for await (const req of server) {
      const request = new Request(req, this.proxy, this.secure);

      const response = Object.assign(
        new Response(request),
        this.response,
      );

      const ctx = Object.assign(
        new Context(this, req, request, response),
        {
          state: {},
        },
        this.context,
      );

      this.handleRequest(ctx, fnMiddleware);
    }
  }

  onerror(err: any): void {
    if (!(err instanceof Error)) {
      throw new TypeError(`non-error thrown: ${err}`);
    }

    if (404 === (err as any).status || (err as any).expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, "  "));
    console.error();
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
  ) {
    return ctx.req.respond(ctx.response.toServerResponse());
  }
}
