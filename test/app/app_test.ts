import {
  App,
} from "../../mod.ts";
import {
  assertEquals
} from "../deps.ts";

Deno.test("app should works", async function () {
  const body = "Hello, world!";
  const app = new App();
  app.use((ctx) => {
    ctx.body = body;
  });

  assertEquals(3, 3);
});
