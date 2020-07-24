import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "ctx.append(name, val), should append multiple headers",
  async fn() {
    const ctx = createMockCtx();

    ctx.append("x-foo", "bar1");
    ctx.append("x-foo", "bar2");

    assertEquals(ctx.response.header.get("x-foo"), "bar1,bar2");
  },
});

test({
  name: "ctx.append(name, val), should accept array of values",
  async fn() {
    const ctx = createMockCtx();

    ctx.append("Set-Cookie", ["foo=bar", "fizz=buzz"]);
    ctx.append("Set-Cookie", "hi=again");

    assertEquals(
      ctx.response.header.get("set-cookie"),
      "foo=bar,fizz=buzz,hi=again",
    );
  },
});

test({
  name: "ctx.append(name, val), should get reset by res.set(field, val)",
  async fn() {
    const ctx = createMockCtx();

    ctx.append("Link", "<http://localhost/>");
    ctx.append("Link", "<http://localhost:80/>");

    ctx.set("Link", "<http://127.0.0.1/>");

    assertEquals(ctx.response.header.get("link"), "<http://127.0.0.1/>");
  },
});

test({
  name: "ctx.append(name, val), should work with res.set(field, val) first",
  async fn() {
    const ctx = createMockCtx();

    ctx.set("Link", "<http://localhost/>");
    ctx.append("Link", "<http://localhost:80/>");

    assertEquals(
      ctx.response.header.get("link"),
      "<http://localhost/>,<http://localhost:80/>",
    );
  },
});
