import {
  encoder,
} from "../deps.ts";

export function byteLength(str: string): number {
  return encoder.encode(str).byteLength;
}
