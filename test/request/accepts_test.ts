import {
  test,
  assertEquals,
  assert,
  Accepts as Accept,
} from "../test_deps.ts";
import { Request } from "../../request.ts";
import { createMockCtx, createMockRequest } from "../utils/createMockFn.ts";

test({
  name:
    "ctx.accepts(types), with no arguments,when Accept is populated,should return all accepted types",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain",
    );

    assertEquals(
      ctx.accepts(),
      ["text/html", "text/plain", "image/jpeg", "application/*"],
    );
  },
});

test({
  name:
    "ctx.accepts(types), with no valid types, when Accept is populated, should return false",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain",
    );

    assertEquals(ctx.accepts("image/png", "image/tiff"), false);
  },
});

test({
  name:
    "ctx.accepts(types), with no valid types, when Accept is not populated', should return the first type",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(
      ctx.accepts("text/html", "text/plain", "image/jpeg", "application/*"),
      "text/html",
    );
  },
});

test({
  name:
    "ctx.accepts(types), when extensions are given, should convert to mime types",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "text/plain, text/html",
    );

    assertEquals(ctx.accepts("html"), "html");
    assertEquals(ctx.accepts(".html"), ".html");
    assertEquals(ctx.accepts("txt"), "txt");
    assertEquals(ctx.accepts(".txt"), ".txt");
    assertEquals(ctx.accepts("png"), false);
  },
});

test({
  name:
    "ctx.accepts(types), when an array is given, should return the first match",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "text/plain, text/html",
    );

    assertEquals(ctx.accepts(["png", "text", "html"]), "text");
    assertEquals(ctx.accepts(["png", "html"]), "html");
  },
});

test({
  name:
    "ctx.accepts(types), when multiple arguments are given, should return the first match",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "text/plain, text/html",
    );

    assertEquals(ctx.accepts("png", "text", "html"), "text");
    assertEquals(ctx.accepts("png", "html"), "html");
  },
});

test({
  name:
    "ctx.accepts(types), when present in Accept as an exact match, should return the type",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "text/plain, text/html",
    );

    assertEquals(ctx.accepts("text/html"), "text/html");
    assertEquals(ctx.accepts("text/plain"), "text/plain");
  },
});

test({
  name:
    "ctx.accepts(types), when present in Accept as a type match, should return the type",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "application/json, */*",
    );

    assertEquals(ctx.accepts("text/html"), "text/html");
    assertEquals(ctx.accepts("text/plain"), "text/plain");
    assertEquals(ctx.accepts("image/png"), "image/png");
  },
});

test({
  name:
    "ctx.accepts(types), when present in Accept as a subtype match, should return the type",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "application/json, text/*",
    );

    assertEquals(ctx.accepts("text/html"), "text/html");
    assertEquals(ctx.accepts("text/plain"), "text/plain");
    assertEquals(ctx.accepts("image/png"), false);
    assertEquals(ctx.accepts("png"), false);
  },
});
