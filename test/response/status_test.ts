import {
  test,
  assert,
  assertEquals,
  assertThrows,
  superdeno,
} from "../test_deps.ts";
import { App } from "../../app.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "res.status=, when a status code, and valid, should set the status",
  async fn() {
    const res = createMockResponse();
    res.status = 403;
    assertEquals(res.status, 403);
  },
});

test({
  name: "res.status=, when a status code, and valid, should not throw",
  async fn() {
    const res = createMockResponse();
    res.status = 403;
  },
});

test({
  name: "res.status=, when a status code, and invalid, should throw",
  async fn() {
    const res = createMockResponse();
    assertThrows(() => {
      res.status = 99;
    });
  },
});

test({
  name:
    "res.status=, when a status code, and custom status, should set the status",
  async fn() {
    const res = createMockResponse();
    res.status = 700;
    assertEquals(res.status, 700);
  },
});

test({
  name: "res.status=, when a status code, and custom status, should not throw",
  async fn() {
    const res = createMockResponse();
    res.status = 700;
  },
});

function strip(status: number) {
  test({
    name: "res.status=, should strip content related header fields",
    async fn() {
      const app = new App();

      app.use((ctx) => {
        ctx.body = { foo: "bar" };
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.set("Content-Length", "15");
        ctx.set("Transfer-Encoding", "chunked");
        ctx.status = status;
        assert(null == ctx.response.header.get("content-type"));
        assert(null == ctx.response.header.get("content-length"));
        assert(null == ctx.response.header.get("transfer-encoding"));
      });

      await superdeno(app.listen())
        .get("/")
        .expect(status)
        .expect((res) => {
          assertEquals(res.headers.hasOwnProperty("content-type"), false);
          assertEquals(res.headers.hasOwnProperty("content-length"), false);
          assertEquals(res.headers.hasOwnProperty("content-encoding"), false);
          assertEquals(res.text.length, 0);
        });
    },
  });

  test({
    name:
      "res.status=, should strip content releated header fields after status set",
    async fn() {
      const app = new App();

      app.use((ctx) => {
        ctx.status = status;
        ctx.body = { foo: "bar" };
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.set("Content-Length", "15");
        ctx.set("Transfer-Encoding", "chunked");
      });

      await superdeno(app.listen())
        .get("/")
        .expect(status)
        .expect((res) => {
          assertEquals(res.headers.hasOwnProperty("content-type"), false);
          assertEquals(res.headers.hasOwnProperty("content-length"), false);
          assertEquals(res.headers.hasOwnProperty("content-encoding"), false);
          assertEquals(res.text.length, 0);
        });
    },
  });
}

test({
  name: "res.status=, when 204",
  async fn() {
    () => strip(204);
  },
});

test({
  name: "res.status=, when 204",
  async fn() {
    () => strip(205);
  },
});

test({
  name: "res.status=, when 304",
  async fn() {
    () => strip(205);
  },
});
