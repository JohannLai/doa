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
  name: "req.ip, with no req.ips present, should return req.conn.remoteAddr",
  async fn() {
    const mockServerRequest = createMockServerRequest({
      conn: {
        close: {},
        remoteAddr: { hostname: "127.0.0.2", port: 64859, transport: "tcp" },
      },
    });

    const request = new Request(mockServerRequest);

    request.headers.set("x-forwarded-for", "127.0.0.1");

    assertEquals(request.ip, "127.0.0.2");
  },
});
