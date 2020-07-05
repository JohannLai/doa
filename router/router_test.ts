import {
  equal,
  assertNotEquals,
  assertThrows,
  assertEquals,
  assert,
} from "https://deno.land/std/testing/asserts.ts";

import { Router } from "./router.ts";

Deno.test("test static", function (): void {
  const r = new Router();
  r.add("GET", "/static/:file", () => {});

  const result = r.find("GET", "/static/a.js");

  console.log(result[0], result[1]);
});
