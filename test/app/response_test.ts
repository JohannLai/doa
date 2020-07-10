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

const app1 = new App();
app1.response.msg = "hello";
const app2 = new App();
const app3 = new App();
const app4 = new App();
const app5 = new App();

test({
  name: "should merge properties",
  async fn() {
    app1.use((ctx, next) => {
      assertEquals(ctx.response.msg, "hello");
      ctx.status = 204;
    });

    await superdeno(app1.listen())
      .get("/")
      .expect(204);
  },
});

test({
  name: "should not affect the original prototype",
  async fn() {
    app2.use((ctx, next) => {
      assertEquals(ctx.response.msg, undefined);
      ctx.status = 204;
    });

    await superdeno(app1.listen())
      .get("/")
      .expect(204);
  },
});
