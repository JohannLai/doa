import {
  test,
  assert,
  assertEquals,
} from "../test_deps.ts";
import { HTTPMethods } from "../../types.d.ts";
import { createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "req.inspect, with no request.req present, should return null",
  async fn() {
    const req = createMockRequest();

    req.method = "GET";
    req.url = "example.com";
    req.header = new Headers([["host", "example.com"]]);

    const expected = {
      method: "GET",
      url: "example.com",
      header: new Headers([["host", "example.com"]]),
    };

    assertEquals(req.inspect(), expected);
  },
});
