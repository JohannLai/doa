import {
  test,
  assertEquals,
  superdeno,
} from "../test_deps.ts";
import {
  App,
} from "../../mod.ts";

test({
  name: "ctx.cookies, ctx.cookies.set(), should set an unsigned cookie",
  async fn() {
    const app = new App();

    app.use((ctx, next) => {
      ctx.cookies.set("name", "jon");
      ctx.status = 204;
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(204)
      .expect("set-cookie", "name=jon; HttpOnly; Path=/");
  },
});

test({
  name: "ctx.cookies, ctx.cookies.set(), should send a signed cookie",
  async fn() {
    const app = new App();

    app.keys = ["a", "b"];

    app.use((ctx, next) => {
      ctx.cookies.set("name", "jon", { signed: true });
      ctx.status = 204;
    });

    const server = app.listen();

    await superdeno(server)
      .get("/")
      .expect(204)
      .expect(
        "set-cookie",
        "name=jon; HttpOnly; Path=/, name.sig=MChOMQXYlU-8nNC9o3RW9OYFu3q_p2awc05V9-27GqM; HttpOnly; Path=/",
      );
  },
});
