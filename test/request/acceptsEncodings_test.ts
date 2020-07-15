import {
  test,
  assertEquals,
  assert,
  Accepts as Accept,
} from "../test_deps.ts";
import { Request } from "../../request.ts";
import { createMockCtx, createMockRequest } from "../utils/createMockFn.ts";

test({
  name:
    "ctx.acceptsEncodings(), with no arguments, when Accept-Encoding is populated, should return accepted types",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-encoding",
      "gzip, compress;q=0.2",
    );

    assertEquals(ctx.acceptsEncodings(), ["gzip", "compress", "identity"]);
    assertEquals(ctx.acceptsEncodings("gzip", "compress"), "gzip");
  },
});

test({
  name:
    "ctx.acceptsEncodings(), with no arguments, when Accept-Encoding is not populated, should return identity",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.acceptsEncodings(), ["identity"]);
    assertEquals(
      ctx.acceptsEncodings("gzip", "deflate", "identity"),
      "identity",
    );
  },
});

test({
  name:
    "ctx.acceptsEncodings(), with multiple arguments, should return the best fit",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-encoding",
      "gzip, compress;q=0.2",
    );

    assertEquals(ctx.acceptsEncodings("compress", "gzip"), "gzip");
    assertEquals(ctx.acceptsEncodings("gzip", "compress"), "gzip");
  },
});

test({
  name: "ctx.acceptsEncodings(), with an array, should return the best fit",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-encoding",
      "gzip, compress;q=0.2",
    );

    assertEquals(ctx.acceptsEncodings(["compress", "gzip"]), "gzip");
  },
});
