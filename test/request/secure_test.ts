import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "req.secure, should return true when https",
  async fn() {
    const proxy = false;
    const secure = true;
    const req = createMockRequest(proxy, secure);
    assertEquals(req.secure, true);
  },
});
