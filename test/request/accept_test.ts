import {
  test,
  assertEquals,
  assert,
  Accepts as Accept,
} from "../test_deps.ts";
import { Request } from "../../request.ts";
import { createMockCtx, createMockRequest } from "../utils/createMockFn.ts";

test({
  name: "ctx.accept, should return an Accept instance",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain",
    );

    assert(ctx.accept instanceof Accept);
  },
});

test({
  name: "ctx.accept=, should replace the accept object",
  async fn() {
    const ctx = createMockCtx();

    ctx.req.headers.set(
      "accept",
      "text/plain",
    );

    assertEquals(ctx.accepts(), ["text/plain"]);
    const request = createMockRequest();

    request.req.headers.set(
      "accept",
      "application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain",
    );

    ctx.accept = new Accept(request.req.headers);

    assertEquals(
      ctx.accepts(),
      ["text/html", "text/plain", "image/jpeg", "application/*"],
    );
  },
});
