import * as compose from "./compose.ts";
import { Context } from "./context.ts";

export type HTTPMethods =
  | "HEAD"
  | "OPTIONS"
  | "GET"
  | "PUT"
  | "PATCH"
  | "POST"
  | "DELETE"
  | "TRACE";

export type DefaultStateExtends = any;

export interface DefaultState extends DefaultStateExtends {}

export type DefaultContextExtends = {};

export interface DefaultContext extends DefaultContextExtends {
  /**
   * Custom properties.
   */
  [key: string]: any;
}

export type Middleware<
  StateT = DefaultState,
  CustomT = DefaultContext,
> = compose.Middleware<Context>;

export type Next = () => Promise<any>;
