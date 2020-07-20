import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "req.type, should return type void of parameters",
  async fn() {
    const req = createMockRequest();
    req.headers.set("content-type", "text/html; charset=utf-8");

    assertEquals(req.type, "text/html");
  },
});

test({
  name: "req.type, with no host present",
  async fn() {
    const req = createMockRequest();

    assertEquals(req.type, "");
  },
});
