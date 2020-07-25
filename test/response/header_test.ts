import {
  test,
  assert,
  assertEquals,
  superdeno,
} from "../test_deps.ts";
import { App } from "../../app.ts";
import { createMockResponse } from "../utils/createMockFn.ts";

test({
  name: "ctx.header, should return the response header string",
  async fn() {
    const res = createMockResponse();

    res.set("X-Foo", "bar");
    res.set("X-Number", 200);
    assertEquals(
      res.header,
      new Headers({ "x-foo": "bar", "x-number": "200" }),
    );
  },
});

test({
  name:
    "ctx.header, should return the response header object when no mocks are in use",
  async fn() {
    const app = new App();
    let header;
    app.use((ctx) => {
      ctx.set("x-foo", "42");
      header = Object.assign({}, ctx.response.header);
    });

    const server = app.listen();

    await superdeno(server)
      .get("/");

    assertEquals(header, new Headers({ "x-foo": "42" }));
  },
});
