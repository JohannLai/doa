
import {
  App,
} from "../../mod.ts";
import { assertEquals, superdeno} from "./../deps.ts";

Deno.test("app works", async function  () {
  const customHeaderKey = "x-app-name";
  const customHeaderValue = "doa";
  const body = "Hello, world!";
  const app = new App();
  app.use((ctx, next) => {
    ctx.val = "testCtxValue";
    return next!();
  });

  app.use((ctx) => {
    assertEquals(ctx.val, "testCtxValue");
    ctx.body = body;
    ctx.set(customHeaderKey, customHeaderValue);
  });

  await superdeno(app)
    .get("/")
    .expect(200)
    .expect(body)
    .expect(customHeaderKey, customHeaderValue);
});
