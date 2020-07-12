import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { Request } from "../../request.ts";
import { createMockServerRequest } from "../utils/createMockFn.ts";

test({
  name: "ctx.length, should return length in content-length",
  async fn() {
    const req = new Request(createMockServerRequest());
    req.header.set("content-length", "10");

    assertEquals(req.length, 10);
  },
});

test({
  name: "ctx.length, with no content-length present",
  async fn() {
    const req = new Request(createMockServerRequest());

    assertEquals(req.length, undefined);
  },
});
