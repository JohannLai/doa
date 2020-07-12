import { App } from "../app.ts";

const app = new App();

let n = parseInt(Deno.env.get("MW") || "1", 10);

console.log(`  ${n} middleware`);

while (n--) {
  app.use(async (ctx, next) => next());
}

app.use(async (ctx, next) => {
  await next();
  ctx.body = "Hello World";
});

await app.listen({ port: 3333 });
