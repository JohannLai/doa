import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.search=, should replace the search",
  async fn() {
    const ctx = createMockCtx();
    ctx.req.headers.set("host", "localhost");
    ctx.search = "?page=2&color=blue";

    assertEquals(ctx.url, "/users/1?page=2&color=blue");
    assertEquals(ctx.search, "?page=2&color=blue");
  },
});

test({
  name: "ctx.search=, should update ctx.querystring and ctx.query",
  async fn() {
    const ctx = createMockCtx();
    ctx.req.headers.set("host", "localhost");
    ctx.search = "?page=2&color=blue";

    assertEquals(ctx.url, "/users/1?page=2&color=blue");
    assertEquals(ctx.querystring, "page=2&color=blue");
    assertEquals(ctx.query.page, "2");
    assertEquals(ctx.query.color, "blue");
  },
});

test({
  name: "ctx.search=, should change .url but not .originalUrl",
  async fn() {
    const ctx = createMockCtx();
    ctx.req.headers.set("host", "localhost");
    ctx.search = "?page=2&color=blue";

    assertEquals(ctx.url, "/users/1?page=2&color=blue");
    assertEquals(ctx.originalUrl, "/users/1?next=/dashboard");
    assertEquals(ctx.request.originalUrl, "/users/1?next=/dashboard");
  },
});
