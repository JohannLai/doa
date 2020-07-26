import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.set(name, val), should set a field value",
  async fn() {
    const ctx = createMockCtx();
    ctx.set("x-foo", "bar");
    assertEquals(ctx.response.header.get("x-foo"), "bar");
  },
});

test({
  name: "ctx.set(name, val), should coerce number to string",
  async fn() {
    const ctx = createMockCtx();
    ctx.set("x-foo", 5);
    assertEquals(ctx.response.header.get("x-foo"), "5");
  },
});

test({
  name: "ctx.set(name, val), should coerce undefined to string",
  async fn() {
    const ctx = createMockCtx();
    ctx.set("x-foo", undefined);
    assertEquals(ctx.response.header.get("x-foo"), "undefined");
  },
});

test({
  name: "ctx.set(name, val), should set a field value of array",
  async fn() {
    const ctx = createMockCtx();
    ctx.set("x-foo", ["foo", "bar", 123]);
    assertEquals(ctx.response.header.get("x-foo"), "foo,bar,123");
  },
});

test({
  name: "ctx.set(object), should set multiple fields",
  async fn() {
    const ctx = createMockCtx();

    ctx.set("x-foo", ["foo", "bar", 123]);
    ctx.set({
      foo: "1",
      bar: "2",
    });

    assertEquals(ctx.response.header.get("foo"), "1");
    assertEquals(ctx.response.header.get("bar"), "2");
  },
});
