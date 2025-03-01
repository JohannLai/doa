import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "req.URL, should not throw when host is void",
  async fn() {
    const req = createMockRequest();
    req.URL;
  },
});

test({
  name: "req.URL, should not throw when header.host is invalid",
  async fn() {
    const req = createMockRequest();
    req.header.set("host", "invalid host");
    req.URL;
  },
});

test({
  name: "req.URL, should return empty object when invalid",
  async fn() {
    const req = createMockRequest();
    req.header.set("host", "invalid host");
    assertEquals(req.URL, Object.create(null));
  },
});
