import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.body=, when Content-Type is set, should not override",
  async fn() {
    const res = createMockResponse();

    res.etag = '"asdf"';
    assertEquals(res.header.get("etag"), '"asdf"');
  },
});

test({
  name: "res.etag=, should not modify a weak etag",
  async fn() {
    const res = createMockResponse();

    res.etag = 'W/"asdf"';
    assertEquals(res.header.get("etag"), 'W/"asdf"');
  },
});

test({
  name: "res.etag=, should not modify a weak etag",
  async fn() {
    const res = createMockResponse();

    res.etag = 'W/"asdf"';
    assertEquals(res.header.get("etag"), 'W/"asdf"');
  },
});

test({
  name: "res.etag=, should add quotes around an etag if necessary",
  async fn() {
    const res = createMockResponse();
    res.etag = "asdf";
    assertEquals(res.header.get("etag"), '"asdf"');
  },
});

test({
  name: "res.etag, should return etag",
  async fn() {
    const res = createMockResponse();
    res.etag = "asdf";
    assertEquals(res.header.get("etag"), '"asdf"');
  },
});
