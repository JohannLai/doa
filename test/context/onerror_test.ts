import {
  test,
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  assertThrowsAsync,
  superdeno,
} from "../test_deps.ts";
import {
  App,
} from "../../mod.ts";

/**
 * test: ctx.onerror(err)
 */
test({
  name: "should respond",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.body = "something else";

      ctx.throw(418, "boom");
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(418)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Content-Length", "4");
  },
});

test({
  name: "should unset all headers",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.set("Vary", "Accept-Encoding");
      ctx.set("X-CSRF-Token", "asdf");
      ctx.set("etag", "123123123w");
      ctx.body = "response";

      ctx.throw(418, "boom");
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(418)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Content-Length", "4")
      .expect((res) => {
        assertEquals(res.headers.hasOwnProperty("vary"), false);
        assertEquals(res.headers.hasOwnProperty("x-csrf-token"), false);
      });
  },
});

test({
  name: "should set headers specified in the error",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.set("Vary", "Accept-Encoding");
      ctx.set("X-CSRF-Token", "asdf");
      ctx.body = "response";

      throw Object.assign(new Error("boom"), {
        status: 418,
        expose: true,
        headers: {
          "X-New-Header": "Value",
        },
      });
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(418)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("X-New-Header", "Value")
      .expect((res) => {
        assertEquals(res.headers.hasOwnProperty("vary"), false);
        assertEquals(res.headers.hasOwnProperty("x-csrf-token"), false);
      });
  },
});

test({
  name: "should set status specified in the error using statusCode",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.body = "something else";
      const err = new Error("Not found") as any;
      err.status = 404;
      throw err;
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(404)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Not Found");
  },
});

test({
  name: "when invalid err.statusCode, not number, should respond 500",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.body = "something else";
      const err = new Error("some error") as any;
      err.statusCode = "notnumber";
      throw err;
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(500)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Internal Server Error");
  },
});

test({
  name: "when invalid err.status, not number, should respond 500",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.body = "something else";
      const err = new Error("some error") as any;
      err.status = "notnumber";
      throw err;
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(500)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Internal Server Error");
  },
});

test({
  name: "when ENOENT error, should respond 404",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.body = "something else";
      const err = new Error("test for ENOENT") as any;
      err.code = "ENOENT";
      throw err;
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(404)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Not Found");
  },
});

test({
  name: "not http status code, should respond 500",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.body = "something else";
      const err = new Error("some error") as any;
      err.status = 9999;
      throw err;
    });
    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(500)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Internal Server Error");
  },
});

test({
  name:
    "when error from another scope thrown, should handle it like a normal error",
  async fn() {
    const app = new App();

    const error = Object.assign(new Error("boom"), {
      status: 418,
      expose: true,
    });

    app.use((ctx, next) => {
      throw error;
    });

    const server = app.listen();

    app.on("error", (receivedError: any) => {
      assertStrictEquals(receivedError, error);
    });

    await superdeno(server)
      .get("/")
      .expect(418);
  },
});

test({
  name: "when non-error thrown, should response non-error thrown message",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      throw "string error";
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(500)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Internal Server Error");
  },
});

test({
  name: "should stringify error if it is an object",
  async fn() {
    const app = new App();

    app.on("error", (err: any) => {
      assertEquals(err, new Error('Error: non-error thrown: {"key":"value"}'));
    });

    app.use(async (ctx) => {
      throw { key: "value" };
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(500)
      .expect("Internal Server Error");
  },
});
