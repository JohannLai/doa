import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { Request } from "../../request.ts";
import { createMockServerRequest } from "../utils/createMockFn.ts";

test({
  name: "req.header, should return the request header object",
  async fn() {
    const req = new Request(createMockServerRequest());
    assertEquals(req.header, req.req.headers);
  },
});

test({
  name: "req.header, should set the request header object",
  async fn() {
    const req = new Request(createMockServerRequest());
    req.header.set("X-Custom-Headerfield", "Its one header, with headerfields");

    assertEquals(req.header, req.req.headers);
  },
});
