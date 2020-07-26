import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.remove(name), should remove a field",
  async fn() {
    const ctx = createMockCtx();

    ctx.set("x-foo", "bar");
    ctx.remove("x-foo");
    assertEquals(ctx.response.header, {});
  },
});
