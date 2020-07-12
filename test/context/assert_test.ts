import {
  test,
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  assertThrowsAsync,
  superdeno,
  ServerRequest,
  BufReader,
  BufWriter,
} from "../test_deps.ts";
import { App } from "../../mod.ts";
import { Context } from "../../context.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";

function createMockApp(): App {
  return {} as any;
}

interface MockServerOptions {
  headers?: [string, string][];
  proto?: string;
  url?: string;
}

function createMockServerRequest({
  url = "/",
  proto = "HTTP/1.1",
  headers: headersInit = [["cache-control", "max-age=0"]],
}: MockServerOptions = {}): ServerRequest {
  const headers = new Headers(headersInit);
  return {
    conn: {
      close() {},
    },
    r: new BufReader(new Deno.Buffer(new Uint8Array())),
    w: new BufWriter(new Deno.Buffer(new Uint8Array())),
    headers,
    method: "GET",
    proto,
    url,
    async respond() {},
  } as any;
}

const createMockCtx = () => {
  return new Context(
    createMockApp(),
    createMockServerRequest(),
    new Request(createMockServerRequest()),
    new Response({ headers: new Headers() }),
  );
};

test({
  name: "ctx.throw(msg), should set .status to 500",
  async fn() {
    const ctx = createMockCtx();
    try {
      ctx.assert(false, 404);
      throw new Error("asdf");
    } catch (err) {
      assertEquals(err.status, 404);
      assertEquals(err.expose, true);
    }
  },
});
