import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.path, should return the pathname",
  async fn() {
    const ctx = createMockCtx();
    ctx.request.headers.set("host", "localhost");
    ctx.url = "/login?next=/dashboard";

    assertEquals(ctx.path, "/login");
  },
});

test({
  name: "ctx.path, should set the pathname",
  async fn() {
    const ctx = createMockCtx();
    ctx.request.headers.set("host", "localhost");
    ctx.url = "/login?next=/dashboard";
    ctx.path = "/logout";

    assertEquals(ctx.path, "/logout");
    assertEquals(ctx.url, "/logout?next=/dashboard");
  },
});

test({
  name: "ctx.path=, should change .url but not .originalUrl",
  async fn() {
    const ctx = createMockCtx();
    ctx.request.headers.set("host", "localhost");
    ctx.path = "/logout";

    assertEquals(ctx.url, "/logout?next=/dashboard");
    assertEquals(ctx.originalUrl, "/users/1?next=/dashboard");
    assertEquals(ctx.request.originalUrl, "/users/1?next=/dashboard");
  },
});
