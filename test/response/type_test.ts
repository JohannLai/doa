import {
  test,
  assert,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "cctx.type=, with a mime, should set the Content-Type",
  async fn() {
    const ctx = createMockCtx();
    ctx.type = "text/plain";
    assertEquals(ctx.type, "text/plain");
    assertEquals(
      ctx.response.header.get("content-type"),
      "text/plain; charset=utf-8",
    );
  },
});

test({
  name: "cctx.type=, with an extension, should lookup the mime",
  async fn() {
    const ctx = createMockCtx();
    ctx.type = "json";
    assertEquals(ctx.type, "application/json");
    assertEquals(
      ctx.response.header.get("content-type"),
      "application/json; charset=utf-8",
    );
  },
});

test({
  name: "cctx.type=, without a charset, should default the charset",
  async fn() {
    const ctx = createMockCtx();
    ctx.type = "text/html";
    assertEquals(ctx.type, "text/html");
    assertEquals(
      ctx.response.header.get("content-type"),
      "text/html; charset=utf-8",
    );
  },
});

test({
  name: "cctx.type=, with a charset, should not default the charset",
  async fn() {
    const ctx = createMockCtx();
    ctx.type = "text/html; charset=foo";
    assertEquals(ctx.type, "text/html");
    assertEquals(
      ctx.response.header.get("content-type"),
      "text/html; charset=foo",
    );
  },
});

test({
  name: "cctx.type=, with an unknown extension, should not set a content-type",
  async fn() {
    const ctx = createMockCtx();
    ctx.type = "asdf";
    assert(!ctx.type);
    assert(!ctx.response.header.get("content-type"));
  },
});

test({
  name: 'ctx.type, with no Content-Type, should return ""',
  async fn() {
    const ctx = createMockCtx();
    assert(!ctx.type);
  },
});

test({
  name: "ctx.type, with a Content-Type, should return the mime",
  async fn() {
    const ctx = createMockCtx();
    ctx.type = "json";
    assertEquals(ctx.type, "application/json");
  },
});
