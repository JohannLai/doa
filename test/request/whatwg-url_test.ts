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
    req.URL;
  },
});

test({
  name: "req.type, should return type void of parameters",
  async fn() {
    const req = createMockRequest();
    req.header.set("host", "invalid host");
    req.URL;
  },
});

test({
  name: "req.type, should return type void of parameters",
  async fn() {
    const req = createMockRequest();
    req.header.set("host", "invalid host");
    assertEquals(req.URL, Object.create(null));
  },
});
