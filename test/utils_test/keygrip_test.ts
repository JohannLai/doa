import {
  test,
  assert,
  assertStrictEquals,
  assertThrows,
  assertEquals,
} from "../test_deps.ts";
import { Keygrip } from "../../utils/keygrip.ts";

test("Keygrip, constructor, should construct new instance", () => {
  var keys = new Keygrip(["SEKRIT1"]);

  assert(keys);
  assert(keys instanceof Keygrip);
});

// test("Keygrip, .index(data), should return key index that signed data", () => {
//   const keys = new Keygrip(["SEKRIT2", "SEKRIT1"]);
//   const data = "Keyboard Cat has a hat.";

//   assertStrictEquals(keys.index(data, "_jl9qXYgk5AgBiKFOPYK073FMEQ"), 0);
//   assertStrictEquals(keys.index(data, "34Sr3OIsheUYWKL5_w--zJsdSNk"), 1);
// });

test("Keygrip, .index(data), should return -1 when no key matches", () => {
  const keys = new Keygrip(["SEKRIT2", "SEKRIT1"]);
  const data = "Keyboard Cat has a hat.";

  assertStrictEquals(keys.index(data, "xmM8HQl2eBtPP9nmZ7BK_wpqoxQ"), -1);
});

test('Keygrip, .index(data), with "algorithm", should return key index using algorithm', () => {
  const keys = new Keygrip(["SEKRIT1"], "sha256");
  const data = "Keyboard Cat has a hat.";

  assertStrictEquals(
    keys.index(data, "pu97aPRZRLKi3-eANtIlTG_CwSc39mAcIZ1c6FxsGCk"),
    0,
  );
});

test("Keygrip, .sign(data), should sign a string", () => {
  const keys = new Keygrip(["SEKRIT1"]);
  const hash = keys.sign("Keyboard Cat has a hat.");

  assertStrictEquals(hash, "pu97aPRZRLKi3-eANtIlTG_CwSc39mAcIZ1c6FxsGCk");
});

test("Keygrip, .sign(data), should sign with first secret", () => {
  const keys = new Keygrip(["SEKRIT2", "SEKRIT1"]);
  const hash = keys.sign("Keyboard Cat has a hat.");

  assertStrictEquals(hash, "lglsBnB7isG_dUwlD56WbA_PXLZZdA_MpHsPXhznfoc");
});

test('Keygrip, .sign(data), with "algorithm", should return signature using algorithm', () => {
  const keys = new Keygrip(["SEKRIT1"], "sha256");
  const hash = keys.sign("Keyboard Cat has a hat.");

  assertStrictEquals(hash, "pu97aPRZRLKi3-eANtIlTG_CwSc39mAcIZ1c6FxsGCk");
});
