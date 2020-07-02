import {
  test,
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  assertThrowsAsync
} from "./test_deps.ts";
import {
  App,
} from "../mod.ts";
import { superdeno } from "https://deno.land/x/superdeno@main/mod.ts";

test({
  name: "construct App()",
  fn() {
    const app = new App();
    assert(app instanceof App);
  },
});

test({
  name: "app.use(fn)",
  async fn() {
    const app = new App();
    const calls: number[] = [];

    app.use((ctx, next) => {
      calls.push(1);
      return next().then(() => {
        calls.push(6);
      });
    });

    app.use((ctx, next) => {
      calls.push(2);
      return next().then(() => {
        calls.push(5);
      });
    });

    app.use((ctx, next) => {
      calls.push(3);
      return next().then(() => {
        calls.push(4);
      });
    });

    await superdeno(app)
      .get("/")
      .expect(404);

    assertEquals(calls, [1, 2, 3, 4, 5, 6]);
  },
});

test({
  name: "should catch thrown errors in non-async functions",
  async fn() {
    const app = new App();

    app.use((ctx) => ctx.throw("Not Found", 404));

    await superdeno(app)
      .get("/")
      .expect(404);
  },
});



