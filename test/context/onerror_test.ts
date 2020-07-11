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
  name: "when invalid err.statusCode not number, should respond 500",
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
