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
    "ctx.acceptsCharsets(), with no arguments, when Accept-Charset is populated, should return accepted types",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-charset",
      "utf-8, iso-8859-1;q=0.2, utf-7;q=0.5",
    );

    assertEquals(ctx.acceptsCharsets(), ["utf-8", "utf-7", "iso-8859-1"]);
  },
});

test({
  name:
    "ctx.acceptsCharsets(), with multiple arguments, when Accept-Charset is populated,if any types match, should return the best fit",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-charset",
      "utf-8, iso-8859-1;q=0.2, utf-7;q=0.5",
    );

    assertEquals(
      ctx.acceptsCharsets("utf-7", "utf-8"),
      "utf-8",
    );
  },
});

test({
  name:
    "ctx.acceptsCharsets(), with multiple arguments, if no types match, should return false",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-charset",
      "utf-8, iso-8859-1;q=0.2, utf-7;q=0.5",
    );

    assertEquals(ctx.acceptsCharsets("utf-16"), false);
  },
});

test({
  name:
    "ctx.acceptsCharsets(), with multiple arguments, when Accept-Charset is not populated, should return the first type",
  async fn() {
    const ctx = createMockCtx();

    assertEquals(ctx.acceptsCharsets("utf-7", "utf-8"), "utf-7");
  },
});

test({
  name:
    "ctx.acceptsCharsets(), with multiple arguments, with an array, should return the best fit",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept-charset",
      "utf-8, iso-8859-1;q=0.2, utf-7;q=0.5",
    );

    assertEquals(ctx.acceptsCharsets(["utf-7", "utf-8"]), "utf-8");
  },
});
