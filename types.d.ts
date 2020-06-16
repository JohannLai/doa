import * as compose from "./compose.ts";
import { Context } from "./context.ts";

export type HTTPMethods =
  | "HEAD"
  | "OPTIONS"
  | "GET"
  | "PUT"
  | "PATCH"
  | "POST"
  | "DELETE";

  export type DefaultStateExtends = any;
/**
 * This interface can be augmented by users to add types to Koa's default state
 */
export interface DefaultState extends DefaultStateExtends {}

export type DefaultContextExtends = {};
/**
 * This interface can be augmented by users to add types to Koa's default context
 */
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
