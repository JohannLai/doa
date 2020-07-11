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
 * test: ctx.state
 */
test({
  name: "should provide a ctx.state namespace",
  async fn() {
    const app = new App();

    app.use((ctx) => {
      assertEquals(ctx.state, {});
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(404);
  },
});
