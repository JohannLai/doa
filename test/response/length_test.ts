import {
  test,
  assertEquals,
  Buffer,
  StringReader,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.length,  when Content-Length is defined,  should return a number",
  async fn() {
    const res = createMockResponse();
    res.set("Content-Length", "1024");
    assertEquals(res.length, 1024);
  },
});

test({
  name:
    "res.length,  when Content-Length is defined,  but not number, should return 0",
  async fn() {
    const res = createMockResponse();
    res.set("Content-Length", "hey");
    assertEquals(res.length, 0);
  },
});

test({
  name:
    "res.length,  when Content-Length is not defined  and a .body is set, should return a number",
  async fn() {
    const res = createMockResponse();

    res.body = "foo";
    res.remove("Content-Length");
    assertEquals(res.length, 3);

    res.body = "foo";
    assertEquals(res.length, 3);

    res.body = Buffer.from("foo bar");
    res.remove("Content-Length");
    assertEquals(res.length, 7);

    res.body = Buffer.from("foo bar");
    assertEquals(res.length, 7);

    res.body = { hello: "world" };
    res.remove("Content-Length");
    assertEquals(res.length, 17);

    res.body = { hello: "world" };
    assertEquals(res.length, 17);

    res.body = new StringReader("package.json");
    assertEquals(res.length, undefined);

    res.body = null;
    assertEquals(res.length, undefined);
  },
});

test({
  name:
    "res.length,  when Content-Length is defined, and .body is not, should return undefined",
  async fn() {
    const res = createMockResponse();
    assertEquals(res.length, undefined);
  },
});
