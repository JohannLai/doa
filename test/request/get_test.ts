import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.get(name), should return the field value",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set("host", "http://google.com");
    ctx.req.headers.set("referer", "http://google.com");

    assertEquals(ctx.get("HOST"), "http://google.com");
    assertEquals(ctx.get("Host"), "http://google.com");
    assertEquals(ctx.get("host"), "http://google.com");
    assertEquals(ctx.get("referer"), "http://google.com");
    assertEquals(ctx.get("referrer"), "http://google.com");
  },
});
