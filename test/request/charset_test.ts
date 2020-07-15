import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: '"req.charset, with no content-type present, should return ""',
  async fn() {
    const req = createMockRequest();
    assert("" === req.charset);
  },
});

test({
  name: '"req.charset, with charset present, should return ""',
  async fn() {
    const req = createMockRequest();
    req.header.set("content-type", "text/plain");
    assert("" === req.charset);
  },
});

test({
  name: '"req.charset, with a charset, should return the charset',
  async fn() {
    const req = createMockRequest();
    req.header.set("content-type", "text/plain; charset=utf-8");
    assertEquals(req.charset, "utf-8");
  },
});

test({
  name:
    '"req.charset, with a charset, should return "" if content-type is invalid',
  async fn() {
    const req = createMockRequest();
    req.header.set(
      "content-type",
      "application/json; application/text; charset=utf-8",
    );
    assert("" === req.charset);
  },
});
