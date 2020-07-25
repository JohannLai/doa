import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.inspect(), with no response.res present, should return null",
  async fn() {
    const res = createMockResponse();
    res.body = "hello";
    const expected = {
      status: 200,
      message: "OK",
      headers: new Headers({
        "cache-control": "max-age=0",
        "content-type": "text/plain; charset=utf-8",
        "content-length": "5",
      }),
      body: "hello",
    };

    assertEquals(res.inspect(), expected);
  },
});
