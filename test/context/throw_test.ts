import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.throw(msg), should set .status to 500",
  async fn() {
    const ctx = createMockCtx();
    try {
      ctx.throw("boom");
    } catch (err) {
      assertEquals(err.status, 500);
      assertEquals(err.expose, false);
    }
  },
});

test({
  name: "ctx.throw(err), should set .status to 500",
  async fn() {
    const ctx = createMockCtx();
    const err = new Error("test");
    try {
      ctx.throw(err);
    } catch (err) {
      assertEquals(err.status, 500);
      assertEquals(err.message, "test");
      assertEquals(err.expose, false);
    }
  },
});

test({
  name: "ctx.throw(err, status)",
  async fn() {
    const ctx = createMockCtx();
    const error = new Error("test");
    try {
      ctx.throw(error, 422);
    } catch (err) {
      assertEquals(err.status, 422);
      assertEquals(err.message, "test");
      assertEquals(err.expose, true);
    }
  },
});

test({
  name: "ctx.throw(status, err)",
  async fn() {
    const ctx = createMockCtx();
    const error = new Error("test");
    try {
      ctx.throw(422, error);
    } catch (err) {
      assertEquals(err.status, 422);
      assertEquals(err.message, "test");
      assertEquals(err.expose, true);
    }
  },
});

test({
  name: "ctx.throw(status, msg)",
  async fn() {
    const ctx = createMockCtx();
    try {
      ctx.throw(400, "name required");
    } catch (err) {
      assertEquals(err.status, 400);
      assertEquals(err.message, "name required");
      assertEquals(err.expose, true);
    }
  },
});

test({
  name: "ctx.throw(status)",
  async fn() {
    const ctx = createMockCtx();
    try {
      ctx.throw(400);
    } catch (err) {
      assertEquals(err.status, 400);
      assertEquals(err.message, "Bad Request");
      assertEquals(err.expose, true);
    }
  },
});

test({
  name: "when not valid status",
  async fn() {
    const ctx = createMockCtx();
    try {
      const err = new Error("some error") as any;
      err.status = -1;
      ctx.throw(err);
    } catch (err) {
      assertEquals(err.message, "some error");
      assertEquals(err.expose, false);
    }
  },
});

test({
  name: "ctx.throw(status, msg, props)",
  async fn() {
    const ctx = createMockCtx();
    try {
      const err = new Error("some error") as any;
      err.status = -1;
      ctx.throw(err);
    } catch (err) {
      assertEquals(err.message, "some error");
      assertEquals(err.expose, false);
    }
  },
});

test({
  name: "ctx.throw(status, msg, props)",
  async fn() {
    const ctx = createMockCtx();
    try {
      const err = new Error("some error") as any;
      err.status = -1;
      ctx.throw(err);
    } catch (err) {
      assertEquals(err.message, "some error");
      assertEquals(err.expose, false);
    }
  },
});

test({
  name: "when props include status",
  async fn() {
    const ctx = createMockCtx();

    try {
      ctx.throw(400, "msg", {
        prop: true,
        status: -1,
      });
    } catch (err) {
      assertEquals(err.status, 400);
      assertEquals(err.message, "msg");
      assertEquals(err.expose, true);
      assertEquals(err.prop, true);
    }
  },
});

test({
  name: "ctx.throw(msg, props)",
  async fn() {
    const ctx = createMockCtx();

    try {
      ctx.throw("msg", { prop: true });
    } catch (err) {
      assertEquals(err.status, 500);
      assertEquals(err.message, "msg");
      assertEquals(err.expose, false);
      assertEquals(err.prop, true);
    }
  },
});

test({
  name: "ctx.throw(status, props)",
  async fn() {
    const ctx = createMockCtx();

    try {
      ctx.throw(400, { prop: true });
    } catch (err) {
      assertEquals(err.status, 400);
      assertEquals(err.message, "Bad Request");
      assertEquals(err.expose, true);
      assertEquals(err.prop, true);
    }
  },
});

test({
  name: "ctx.throw(err, props)",
  async fn() {
    const ctx = createMockCtx();

    try {
      ctx.throw(new Error("test"), { prop: true });
    } catch (err) {
      assertEquals(err.status, 500);
      assertEquals(err.message, "test");
      assertEquals(err.expose, false);
      assertEquals(err.prop, true);
    }
  },
});
