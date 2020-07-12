import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.throw(msg), should set .status to 500",
  async fn() {
    const ctx = createMockCtx();
    try {
      ctx.assert(false, 404);
      throw new Error("asdf");
    } catch (err) {
      assertEquals(err.status, 404);
      assertEquals(err.expose, true);
    }
  },
});
