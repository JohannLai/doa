import {
  test,
  assert,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name:
    "ctx.response.has(name), should check a field value, case insensitive way",
  async fn() {
    const ctx = createMockCtx();

    ctx.set("X-Foo", "");
    assert(ctx.response.has("x-Foo"));
    assert(ctx.has("x-foo"));
  },
});

test({
  name: "ctx.response.has(name), should return false for non-existent header",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.response.has("boo"), false);
    ctx.set("x-foo", 5);
    assertEquals(ctx.has("x-boo"), false);
  },
});
