import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "ctx.headers, should return the response header string",
  async fn() {
    const res = createMockResponse();

    res.set("X-Foo", "bar");
    res.set("X-Number", 200);
    assertEquals(
      res.headers,
      new Headers({ "x-foo": "bar", "x-number": "200" }),
    );
  },
});
