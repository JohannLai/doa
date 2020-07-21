import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name:
    "ctx.querystring, when ctx.req not present, should return an empty string",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.querystring, "next=/dashboard");
  },
});

test({
  name: "ctx.querystring=, should replace the querystring",
  async fn() {
    const ctx = createMockCtx();
    ctx.querystring = "page=2&color=blue";
    assertEquals(ctx.url, "/1?page=2&color=blue");
    assertEquals(ctx.querystring, "page=2&color=blue");
  },
});

test({
  name: "ctx.querystring=, should update ctx.search and ctx.query",
  async fn() {
    const ctx = createMockCtx();
    ctx.querystring = "page=2&color=blue";
    assertEquals(ctx.url, "/1?page=2&color=blue");
    assertEquals(ctx.search, "?page=2&color=blue");
    assertEquals(ctx.query.page, "2");
    assertEquals(ctx.query.color, "blue");
  },
});

test({
  name: "ctx.querystring=, should change .url but not .originalUrl",
  async fn() {
    const ctx = createMockCtx();
    ctx.querystring = "page=2&color=blue";
    assertEquals(ctx.url, "/1?page=2&color=blue");
    assertEquals(ctx.originalUrl, "/users/1?next=/dashboard");
    assertEquals(ctx.request.originalUrl, "/users/1?next=/dashboard");
  },
});
