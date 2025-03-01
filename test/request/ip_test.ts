import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { Request } from "../../request.ts";
import { createMockServerRequest } from "../utils/createMockFn.ts";
import { App } from "../../app.ts";
test({
  name: "req.ip, with req.ips present, should return req.ips[0]",
  async fn() {
    const proxy = true;
    const mockServerRequest = createMockServerRequest({
      conn: {
        close: {},
        remoteAddr: "127.0.0.2",
      },
    });

    const request = new Request(mockServerRequest, proxy);

    request.headers.set("x-forwarded-for", "127.0.0.1");

    assertEquals(request.ip, "127.0.0.1");
  },
});

test({
  name:
    "req.ips, when X-Forwarded-For is present, and proxy is not trusted, should be ignored",
  async fn() {
    const mockServerRequest = createMockServerRequest();

    const request = new Request(mockServerRequest);

    request.headers.set("x-forwarded-for", "127.0.0.1,127.0.0.2");

    assertEquals(request.ips, []);
  },
});

test({
  name:
    "req.ips, when X-Forwarded-For is present, and proxy is not trusted, should be used",
  async fn() {
    const mockServerRequest = createMockServerRequest();
    const proxy = true;
    const request = new Request(mockServerRequest, proxy);

    request.headers.set("x-forwarded-for", "127.0.0.1,127.0.0.2");

    assertEquals(request.ips, ["127.0.0.1", "127.0.0.2"]);
  },
});
