import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name:
    "ctx.query, when missing, should return the same object each time it\'s accessed",
  async fn() {
    const ctx = createMockCtx();
    ctx.query = { a: "2" };

    assertEquals(ctx.query.a, "2");
  },
});

test({
  name: "ctx.query, when missing, should return a parsed query string",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.query.next, "/dashboard");
  },
});

test({
  name: "ctx.query=, should stringify and replace the query string and search",
  async fn() {
    const ctx = createMockCtx();
    ctx.query = { page: 2, color: "blue" };

    assertEquals(ctx.url, "/1?page=2&color=blue");
    assertEquals(ctx.querystring, "page=2&color=blue");
    assertEquals(ctx.search, "?page=2&color=blue");
  },
});
