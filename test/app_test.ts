import {
  test,
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrowsAsync,
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
  name: "construct App()",
  async fn() {
    const body = "Hello, World";
    const app = new App();
    app.use((ctx) => {
      ctx.status = 200;
      ctx.body = body;
    });

    await superdeno(app)
      .get("/")
      .expect(200)
      .expect(body);
  },
});
