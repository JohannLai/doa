import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.lastModified=, should set the header as a UTCString",
  async fn() {
    const res = createMockResponse();
    const date = new Date();
    res.lastModified = date;
    assertEquals(res.header.get("last-modified"), date.toUTCString());
  },
});

test({
  name: "res.lastModified=, should work with date strings",
  async fn() {
    const res = createMockResponse();
    const date = new Date();
    res.lastModified = date.toString();
    assertEquals(res.header.get("last-modified"), date.toUTCString());
  },
});

test({
  name: "res.lastModified=, should get the header as a Date",
  async fn() {
    const res = createMockResponse();
    const date = new Date();
    res.lastModified = date;
    assertEquals(
      (res.lastModified.getTime() / 1000),
      Math.floor(date.getTime() / 1000),
    );
  },
});

test({
  name: "res.lastModified=, when lastModified not set, should get undefined",
  async fn() {
    const res = createMockResponse();

    assertEquals(res.lastModified, undefined);
  },
});
