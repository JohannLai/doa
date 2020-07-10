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

test({
  name: "should throw an error if a non-error is given",
  async fn() {
    const app = new App();

    app.use((ctx) => ctx.throw("Not Found", 404));

    assertThrows(
      () => {
        app.onerror("foo");
      },
      TypeError,
      "non-error thrown: foo",
    );
  },
});
