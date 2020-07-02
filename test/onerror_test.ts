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
  name: "should throw an error if a non-error is given",
  async fn() {
    const app = new App();

    app.use((ctx) => ctx.throw("Not Found", 404));

    assertThrows(() => {
      app.onerror('foo');
    }, TypeError, 'non-error thrown: foo');
  },
});


// test({
//   name: "should do nothing if status is 404",
//   async fn() {
//     const app = new App();
//     const err = new Error();

//     app.use((ctx) => ctx.throw("Not Found", 404));

//     assertThrows(() => {
//       app.onerror('foo');
//     }, TypeError, 'non-error thrown: foo');
//   },
// });


