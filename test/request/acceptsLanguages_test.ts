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
    "ctx.acceptsLanguages(), with no arguments, when accept-language is populated, should return accepted types",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-language",
      "en;q=0.8, es, pt",
    );

    assertEquals(ctx.acceptsLanguages(), ["es", "pt", "en"]);
  },
});

test({
  name:
    "ctx.acceptsLanguages(), with multiple arguments, when Accept-Language is populated, if any types types match, should return the best fit",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-language",
      "en;q=0.8, es, pt",
    );

    assertEquals(ctx.acceptsLanguages("es", "en"), "es");
  },
});

test({
  name:
    "ctx.acceptsLanguages(), with multiple arguments, when Accept-Language is populated, if no types match should return false",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-language",
      "en;q=0.8, es, pt",
    );

    assertEquals(ctx.acceptsLanguages("fr", "au"), false);
  },
});

test({
  name:
    "ctx.acceptsLanguages(), with multiple arguments, when Accept-Language is not populated, should return the first type",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.acceptsLanguages("es", "en"), "es");
  },
});

test({
  name: "ctx.acceptsLanguages(), with an array, should return the best fit",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-language",
      "en;q=0.8, es, pt",
    );

    assertEquals(ctx.acceptsLanguages(["es", "en"]), "es");
  },
});
