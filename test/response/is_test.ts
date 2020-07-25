import {
  test,
  assertEquals,
} from "../test_deps.ts";
import { createMockCtx } from "../utils/createMockFn.ts";

test({
  name: "response.is(type), should ignore params",
  async fn() {
    const res = createMockCtx().response;

    res.type = "text/html; charset=utf-8";

    assertEquals(res.is("text/*"), "text/html");
  },
});

test({
  name: "response.is(type), when no type is set, should return false",
  async fn() {
    const res = createMockCtx().response;

    assertEquals(res.is(), false);
    assertEquals(res.is("html"), false);
  },
});

test({
  name: "response.is(type), when given no types, should return the type",
  async fn() {
    const res = createMockCtx().response;

    res.type = "text/html; charset=utf-8";

    assertEquals(res.is(), "text/html");
  },
});

test({
  name: "response.is(type), given one type, should return the type or false",
  async fn() {
    const res = createMockCtx().response;

    res.type = "image/png";

    assertEquals(res.is("png"), "png");
    assertEquals(res.is(".png"), ".png");
    assertEquals(res.is("image/png"), "image/png");
    assertEquals(res.is("image/*"), "image/png");
    assertEquals(res.is("*/png"), "image/png");

    assertEquals(res.is("jpeg"), false);
    assertEquals(res.is(".jpeg"), false);
    assertEquals(res.is("image/jpeg"), false);
    assertEquals(res.is("text/*"), false);
    assertEquals(res.is("*/jpeg"), false);
  },
});

test({
  name:
    "response.is(type), given multiple types, should return the first match or false",
  async fn() {
    const res = createMockCtx().response;

    res.type = "image/png";

    assertEquals(res.is("png"), "png");
    assertEquals(res.is(".png"), ".png");
    assertEquals(res.is("text/*", "image/*"), "image/png");
    assertEquals(res.is("image/*", "text/*"), "image/png");
    assertEquals(res.is("image/*", "image/png"), "image/png");
    assertEquals(res.is("image/png", "image/*"), "image/png");

    assertEquals(res.is(["text/*", "image/*"]), "image/png");
    assertEquals(res.is(["image/*", "text/*"]), "image/png");
    assertEquals(res.is(["image/*", "image/png"]), "image/png");
    assertEquals(res.is(["image/png", "image/*"]), "image/png");

    assertEquals(res.is("jpeg"), false);
    assertEquals(res.is(".jpeg"), false);
    assertEquals(res.is("text/*", "application/*"), false);
    assertEquals(
      res.is("text/html", "text/plain", "application/json; charset=utf-8"),
      false,
    );
  },
});

test({
  name:
    'response.is(type), when Content-Type: application/x-www-form-urlencoded, should match "urlencoded"',
  async fn() {
    const res = createMockCtx().response;

    res.type = "application/x-www-form-urlencoded";

    assertEquals(res.is("urlencoded"), "urlencoded");
    assertEquals(res.is("json", "urlencoded"), "urlencoded");
    assertEquals(res.is("urlencoded", "json"), "urlencoded");
  },
});
