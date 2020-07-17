import {
  test,
  assertEquals,
  assert,
} from "../test_deps.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "req.hostname, should return hostname void of port",
  async fn() {
    const req = createMockRequest();
    req.headers.set("host", "foo.com:3000");
    assert(req.hostname, "foo.com");
  },
});

test({
  name: 'req.hostname, with no host present， should return ""',
  async fn() {
    const req = createMockRequest();
    assertEquals(req.hostname, "");
  },
});

test({
  name: "req.hostname, with IPv6 in host, should parse localhost void of port",
  async fn() {
    const req = createMockRequest();
    req.headers.set("host", "[::1]");
    assertEquals(req.hostname, "[::1]");
  },
});

test({
  name: "req.hostname, with IPv6 in host, should parse localhost with port 80",
  async fn() {
    const req = createMockRequest();
    req.headers.set("host", "[::1]:80");
    assertEquals(req.hostname, "[::1]");
  },
});

test({
  name:
    "req.hostname, with IPv6 in host, should parse localhost with non special schema port",
  async fn() {
    const req = createMockRequest();
    req.headers.set("host", "[::1]:1337");
    assertEquals(req.hostname, "[::1]");
  },
});

// test({
//   name: "req.hostname, with IPv6 in host, should reduce IPv6 with non special schema port, as hostname",
//   async fn() {
//     const req = createMockRequest();
//     req.headers.set("host", "[2001:cdba:0000:0000:0000:0000:3257:9652]:1337");
//     assertEquals(req.hostname, "[2001:cdba::3257:9652]");
//   },
// });

test({
  name:
    "req.hostname, when X-Forwarded-Host is present, and proxy is not trusted, should be ignored",
  async fn() {
    const req = createMockRequest();

    req.headers.set("x-forwarded-host", "bar.com");
    req.headers.set("host", "foo.com");

    assertEquals(req.hostname, "foo.com");
  },
});

test({
  name:
    "req.hostname, when X-Forwarded-Host is present, and proxy is not trusted, should be ignored",
  async fn() {
    const req = createMockRequest(true);

    req.headers.set("x-forwarded-host", "bar.com");
    req.headers.set("host", "foo.com");

    assertEquals(req.hostname, "bar.com");
  },
});
