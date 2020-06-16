import {
  App,
} from "../../mod.ts";
import { assertEquals, superdeno } from "./../deps.ts";

Deno.test("app works", async function () {
  const body = "Hello, I'm ako 🦕!";
  const app = new App();
  app.use((ctx) => {
    ctx.body = body;
  });
});
