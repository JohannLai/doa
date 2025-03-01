import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "req.origin, should return the origin of url",
  async fn() {
    const ctx = createMockCtx();
    ctx.header.set("host", "localhost");
    assertEquals(ctx.origin, "http://localhost");
    // change it also work
    ctx.url = "/foo/users/1?next=/dashboard";
    assertEquals(ctx.origin, "http://localhost");
  },
});
