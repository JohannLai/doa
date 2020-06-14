export function isReader(value: any): value is Deno.Reader {
  return typeof value === "object" && "read" in value &&
    typeof value.read === "function";
}
