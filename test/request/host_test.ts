import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "req.host, should return host with port",
  async fn() {
    const req = createMockRequest();
    req.headers.set("host", "foo.com:3000");
    assert(req.host, "foo.com:3000");
  },
});

test({
  name: 'req.host, with no host present, should return ""',
  async fn() {
    const req = createMockRequest();
    assertEquals(req.host, "");
  },
});

test({
  name:
    "req.host, when X-Forwarded-Host is present, and proxy is not trusted, should be used on HTTP/1",
  async fn() {
    const req = createMockRequest(true);

    req.headers.set("x-forwarded-host", "bar.com, baz.com");
    req.headers.set("host", "bar.com");
    assertEquals(req.host, "bar.com");
  },
});
