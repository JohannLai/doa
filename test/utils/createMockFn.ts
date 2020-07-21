import {
  ServerRequest,
  BufReader,
  BufWriter,
} from "../test_deps.ts";
import { App } from "../../mod.ts";
import { Context } from "../../context.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";
interface MockServerOptions {
  headers?: [string, string][];
  proto?: string;
  url?: string;
  conn?: any;
}

export function createMockApp(): App {
  return {} as any;
}

export function createMockServerRequest({
  url = "/users/1?next=/dashboard",
  proto = "HTTP/1.1",
  headers: headersInit = [["cache-control", "max-age=0"]],
  conn = {
    close() {},
  },
}: MockServerOptions = {}): ServerRequest {
  const headers = new Headers(headersInit);
  return {
    conn,
    r: new BufReader(new Deno.Buffer(new Uint8Array())),
    w: new BufWriter(new Deno.Buffer(new Uint8Array())),
    headers,
    method: "GET",
    proto,
    url,
    async respond() {},
  } as any;
}

export function createMockCtx() {
  const mockServerRequest = createMockServerRequest();
  return new Context(
    createMockApp(),
    mockServerRequest,
    new Request(mockServerRequest),
    new Response({ headers: new Headers() }),
  );
}

export function createMockRequest(proxy?: boolean, secure?: boolean) {
  const mockServerRequest = createMockServerRequest();
  return new Request(mockServerRequest, proxy, secure);
}
