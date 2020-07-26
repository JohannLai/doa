import {
  test,
  assertEquals,
  superdeno,
} from "../test_deps.ts";
import { App } from "../../app.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.redirect(url), should redirect to the given url",
  async fn() {
    const ctx = createMockCtx();
    ctx.redirect("http://google.com");
    assertEquals(ctx.response.header.get("location"), "http://google.com");
    assertEquals(ctx.status, 302);
  },
});

test({
  name: 'ctx.redirect(url), with "back", should default to alt',
  async fn() {
    const ctx = createMockCtx();

    ctx.redirect("back", "/index.html");
    assertEquals(ctx.response.header.get("location"), "/index.html");
  },
});

test({
  name: 'ctx.redirect(url), with "back", should default redirect to /',
  async fn() {
    const ctx = createMockCtx();

    ctx.redirect("back");
    assertEquals(ctx.response.header.get("location"), "/");
  },
});

test({
  name: "ctx.redirect(url), when html is accepted, should respond with html",
  async fn() {
    const ctx = createMockCtx();

    const url = "http://google.com";
    ctx.header.accept = "text/html";
    ctx.redirect(url);
    assertEquals(
      ctx.response.header.get("content-type"),
      "text/html; charset=utf-8",
    );
    assertEquals(ctx.body, `Redirecting to <a href="${url}">${url}</a>.`);
  },
});

test({
  name: "ctx.redirect(url), when html is accepted, should respond with html",
  async fn() {
    const ctx = createMockCtx();

    const url = "http://google.com";
    ctx.header.accept = "text/html";
    ctx.redirect(url);
    assertEquals(
      ctx.response.header.get("content-type"),
      "text/html; charset=utf-8",
    );
    assertEquals(ctx.body, `Redirecting to <a href="${url}">${url}</a>.`);
  },
});

test({
  name: "ctx.redirect(url), when html is accepted, should escape the url",
  async fn() {
    const ctx = createMockCtx();

    let url = "<script>";
    ctx.header.accept = "text/html";
    ctx.redirect(url);
    assertEquals(
      ctx.response.header.get("content-type"),
      "text/html; charset=utf-8",
    );
    assertEquals(
      ctx.body,
      `Redirecting to <a href=\"&lt;script&gt;\">&lt;script&gt;</a>.`,
    );
  },
});
