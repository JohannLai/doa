import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { HTTPMethods } from "../../types.d.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name:
    "ctx.idempotent, when the request method is idempotent, should return true",
  async fn() {
    const req = createMockRequest();
    const methods: HTTPMethods[] = [
      "GET",
      "HEAD",
      "PUT",
      "DELETE",
      "OPTIONS",
      "TRACE",
    ];
    methods.forEach(
      check,
    );
    function check(method: HTTPMethods, index: number) {
      const req = createMockRequest();
      req.method = method;
      assertEquals(req.idempotent, true);
    }
  },
});

test({
  name:
    "ctx.idempotent, when the request method is not idempotent, should return false",
  async fn() {
    const req = createMockRequest();
    req.method = "POST";
    assertEquals(req.idempotent, false);
  },
});
