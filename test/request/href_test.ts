import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "req.href, should return the full request url",
  async fn() {
    const ctx = createMockCtx();
    ctx.req.headers.set("host", "localhost");
    assertEquals(ctx.href, "http://localhost/users/1?next=/dashboard");

    ctx.url = "/foo/users/1?next=/dashboard";
    assertEquals(ctx.href, "http://localhost/users/1?next=/dashboard");
  },
});
