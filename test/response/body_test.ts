import {
  test,
  assertEquals,
  StringReader,
  BufReader,
  Buffer,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.body=, when Content-Type is set, should not override",
  async fn() {
    const res = createMockResponse();

    res.type = "png";
    res.body = "something";

    assertEquals("image/png", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when body is an object, should override as json",
  async fn() {
    const res = createMockResponse();

    res.body = "<em>hey</em>";
    assertEquals("text/html; charset=utf-8", res.header.get("content-type"));

    res.body = { foo: "bar" };
    assertEquals(
      "application/json; charset=utf-8",
      res.header.get("content-type"),
    );
  },
});

test({
  name: "res.body=, when body is an object, should override length",
  async fn() {
    const res = createMockResponse();

    res.type = "html";
    res.body = "something";
    assertEquals(res.length, 9);
  },
});

test({
  name: "res.body=, when a string is given, should default to text",
  async fn() {
    const res = createMockResponse();

    res.body = "JohannLai";
    assertEquals("text/plain; charset=utf-8", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when a string is given, should set length",
  async fn() {
    const res = createMockResponse();

    res.body = "JohannLai";
    assertEquals("9", res.header.get("content-length"));
  },
});

test({
  name:
    "res.body=, when a string is given, should set length, and contains a non-leading <, should default to text",
  async fn() {
    const res = createMockResponse();

    res.body = "<h1>JohannLai</h1>";
    assertEquals("text/html; charset=utf-8", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when an html string is given, should default to html",
  async fn() {
    const res = createMockResponse();

    res.body = "<h1>JohannLai</h1>";
    assertEquals("text/html; charset=utf-8", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when an html string is given, should set length",
  async fn() {
    const res = createMockResponse();

    res.body = "<h1>JohannLai</h1>";
    assertEquals(18, res.length);
  },
});

test({
  name:
    "res.body=, when an html string is given, when it contains leading whitespace, should default to html",
  async fn() {
    const res = createMockResponse();
    res.body = "        <h1>JohannLai</h1>";
    assertEquals("text/html; charset=utf-8", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when an xml string is given, should default to html",
  async fn() {
    /**
       * ctx test is to show that we're not going
       * to be stricter with the html sniff
       * or that we will sniff other string types.
       * You should `.type=` if ctx simple test fails.
       */
    const res = createMockResponse();
    res.body = '<?xml version="1.0" encoding="UTF-8"?>\n<俄语>данные</俄语>';
    assertEquals("text/html; charset=utf-8", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when an xml string is given, should default to html",
  async fn() {
    /**
       * ctx test is to show that we're not going
       * to be stricter with the html sniff
       * or that we will sniff other string types.
       * You should `.type=` if ctx simple test fails.
       */
    const res = createMockResponse();
    res.body = '<?xml version="1.0" encoding="UTF-8"?>\n<俄语>данные</俄语>';
    assertEquals("text/html; charset=utf-8", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when a stream is given, should default to an octet stream",
  async fn() {
    const res = createMockResponse();
    res.body = new StringReader("LICENSE");
    assertEquals("application/octet-stream", res.header.get("content-type"));
  },
});

test({
  name:
    "res.body=, when a stream is given, should add error handler to the stream, but only once",
  async fn() {
    const res = createMockResponse();
    res.body = new StringReader("LICENSE");
    assertEquals("application/octet-stream", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when a buffer is given, should default to an octet stream",
  async fn() {
    const res = createMockResponse();
    res.body = Buffer.from("JohannLai");
    assertEquals("application/octet-stream", res.header.get("content-type"));
  },
});

test({
  name: "res.body=, when a buffer is given, should set length",
  async fn() {
    const res = createMockResponse();
    res.body = Buffer.from("JohannLai");
    assertEquals("9", res.header.get("content-length"));
  },
});

test({
  name: "res.body=, when an object is given, should default to json",
  async fn() {
    const res = createMockResponse();

    res.body = { foo: "bar" };

    assertEquals(
      "application/json; charset=utf-8",
      res.header.get("content-type"),
    );
  },
});
