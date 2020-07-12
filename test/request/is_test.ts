import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.is(type), should ignore params",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set("content-type", "text/html; charset=utf-8");
    ctx.req.headers.set("transfer-encoding", "chunked");

    assertEquals(ctx.is("text/*"), "text/html");
  },
});

test({
  name: "ctx.is(type), when no body is given, should return null",
  async fn() {
    const ctx = createMockCtx();

    ctx.headers.set("transfer-encoding", "chunked");

    assertEquals(ctx.is(), false);
    assertEquals(ctx.is("image/*"), false);
    assertEquals(ctx.is("image/*", "text/*"), false);
  },
});

test({
  name: "ctx.is(type), when no content type is given, should return false",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.is(), false);
    assertEquals(ctx.is("image/*"), false);
    assertEquals(ctx.is("text/*", "image/*"), false);
  },
});

test({
  name: "ctx.is(type), give no types, should return the mime type",
  async fn() {
    const ctx = createMockCtx();

    ctx.headers.set("content-type", "image/png");
    ctx.headers.set("transfer-encoding", "chunked");

    assertEquals(ctx.is(), "image/png");
  },
});

test({
  name: "ctx.is(type), given one type, should return the type or false",
  async fn() {
    const ctx = createMockCtx();

    ctx.headers.set("content-type", "image/png");
    ctx.headers.set("transfer-encoding", "chunked");

    assertEquals(ctx.is("png"), "png");
    assertEquals(ctx.is(".png"), ".png");
    assertEquals(ctx.is("image/png"), "image/png");
    assertEquals(ctx.is("image/*"), "image/png");
    assertEquals(ctx.is("*/png"), "image/png");

    assertEquals(ctx.is("jpeg"), false);
    assertEquals(ctx.is(".jpeg"), false);
    assertEquals(ctx.is("image/jpeg"), false);
    assertEquals(ctx.is("text/*"), false);
    assertEquals(ctx.is("*/jpeg"), false);
  },
});

test({
  name:
    "ctx.is(type), given multiple types, should return the first match or false",
  async fn() {
    const ctx = createMockCtx();

    ctx.headers.set("content-type", "image/png");
    ctx.headers.set("transfer-encoding", "chunked");

    assertEquals(ctx.is("png"), "png");
    assertEquals(ctx.is(".png"), ".png");
    assertEquals(ctx.is("text/*", "image/*"), "image/png");
    assertEquals(ctx.is("image/*", "text/*"), "image/png");
    assertEquals(ctx.is("image/*", "image/png"), "image/png");
    assertEquals(ctx.is("image/png", "image/*"), "image/png");

    assertEquals(ctx.is(["text/*", "image/*"]), "image/png");
    assertEquals(ctx.is(["image/*", "text/*"]), "image/png");
    assertEquals(ctx.is(["image/*", "image/png"]), "image/png");
    assertEquals(ctx.is(["image/png", "image/*"]), "image/png");

    assertEquals(ctx.is("jpeg"), false);
    assertEquals(ctx.is(".jpeg"), false);
    assertEquals(ctx.is("text/*", "application/*"), false);
    assertEquals(
      ctx.is("text/html", "text/plain", "application/json; charset=utf-8"),
      false,
    );
  },
});

test({
  name: "ctx.is(type), when Content-Type: application/x-www-form-urlencoded",
  async fn() {
    const ctx = createMockCtx();

    ctx.headers.set("content-type", "application/x-www-form-urlencoded");
    ctx.headers.set("transfer-encoding", "chunked");

    assertEquals(ctx.is("urlencoded"), "urlencoded");
    assertEquals(ctx.is("json", "urlencoded"), "urlencoded");
    assertEquals(ctx.is("urlencoded", "json"), "urlencoded");
  },
});
