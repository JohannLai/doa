export const test = Deno.test;

export { BufReader, BufWriter } from "https://deno.land/std@0.59.0/io/bufio.ts";
export { StringReader } from "https://deno.land/std@0.59.0/io/readers.ts";
export { StringWriter } from "https://deno.land/std@0.59.0/io/writers.ts";
export {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@0.59.0/testing/asserts.ts";

export { superdeno } from "https://deno.land/x/superdeno@main/mod.ts";
