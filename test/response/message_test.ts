import {
  test,
  assertEquals,
  Buffer,
  StringReader,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.message, should return the response status message",
  async fn() {
    const res = createMockResponse();
    res.status = 200;
    assertEquals(res.message, "OK");
  },
});

test({
  name: "res.message, when res.message not present, should look up in statuses",
  async fn() {
    const res = createMockResponse();
    res.res.status = 200;
    assertEquals(res.message, "OK");
  },
});

test({
  name: "res.message, should set response status message",
  async fn() {
    const res = createMockResponse();
    res.status = 200;
    res.message = "ok";
    assertEquals(res.res.statusMessage, "ok");
    assertEquals(res.inspect()?.message, "ok");
  },
});
