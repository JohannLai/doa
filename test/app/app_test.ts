import {
  App,
} from "../../mod.ts";

Deno.test("app works", async function () {
  const body = "Hello, world!";
  const app = new App();
  app.use((ctx) => {
    ctx.body = body;
  });
});
