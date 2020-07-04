import { Middleware as BaseMiddleware } from "./types.d.ts";

export function compose<T1, U1, T2, U2>(
  middleware: [BaseMiddleware<T1, U1>, BaseMiddleware<T2, U2>],
): BaseMiddleware<T1 & T2, U1 & U2>;

export function compose<T1, U1, T2, U2, T3, U3>(
  middleware: [
    BaseMiddleware<T1, U1>,
    BaseMiddleware<T2, U2>,
    BaseMiddleware<T3, U3>,
  ],
): BaseMiddleware<T1 & T2 & T3, U1 & U2 & U3>;

export function compose<T1, U1, T2, U2, T3, U3, T4, U4>(
  middleware: [
    BaseMiddleware<T1, U1>,
    BaseMiddleware<T2, U2>,
    BaseMiddleware<T3, U3>,
    BaseMiddleware<T4, U4>,
  ],
): BaseMiddleware<T1 & T2 & T3 & T4, U1 & U2 & U3 & U4>;

export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5>(
  middleware: [
    BaseMiddleware<T1, U1>,
    BaseMiddleware<T2, U2>,
    BaseMiddleware<T3, U3>,
    BaseMiddleware<T4, U4>,
    BaseMiddleware<T5, U5>,
  ],
): BaseMiddleware<T1 & T2 & T3 & T4 & T5, U1 & U2 & U3 & U4 & U5>;

export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5, T6, U6>(
  middleware: [
    BaseMiddleware<T1, U1>,
    BaseMiddleware<T2, U2>,
    BaseMiddleware<T3, U3>,
    BaseMiddleware<T4, U4>,
    BaseMiddleware<T5, U5>,
    BaseMiddleware<T6, U6>,
  ],
): BaseMiddleware<T1 & T2 & T3 & T4 & T5 & T6, U1 & U2 & U3 & U4 & U5 & U6>;

export function compose<
  T1,
  U1,
  T2,
  U2,
  T3,
  U3,
  T4,
  U4,
  T5,
  U5,
  T6,
  U6,
  T7,
  U7,
>(
  middleware: [
    BaseMiddleware<T1, U1>,
    BaseMiddleware<T2, U2>,
    BaseMiddleware<T3, U3>,
    BaseMiddleware<T4, U4>,
    BaseMiddleware<T5, U5>,
    BaseMiddleware<T6, U6>,
    BaseMiddleware<T7, U7>,
  ],
): BaseMiddleware<
  T1 & T2 & T3 & T4 & T5 & T6 & T7,
  U1 & U2 & U3 & U4 & U5 & U6 & U7
>;

export function compose<
  T1,
  U1,
  T2,
  U2,
  T3,
  U3,
  T4,
  U4,
  T5,
  U5,
  T6,
  U6,
  T7,
  U7,
  T8,
  U8,
>(
  middleware: [
    BaseMiddleware<T1, U1>,
    BaseMiddleware<T2, U2>,
    BaseMiddleware<T3, U3>,
    BaseMiddleware<T4, U4>,
    BaseMiddleware<T5, U5>,
    BaseMiddleware<T6, U6>,
    BaseMiddleware<T7, U7>,
    BaseMiddleware<T8, U8>,
  ],
): BaseMiddleware<
  T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8,
  U1 & U2 & U3 & U4 & U5 & U6 & U7 & U8
>;

export function compose<T>(
  middleware: Array<Middleware<T>>,
): ComposedMiddleware<T>;

export function compose(middleware: Function[]) {
  return function (context: any, next?: Next) {
    // last called middleware #
    let index = -1;

    function dispatch(i: number): Promise<any> {
      if (i <= index) {
        return Promise.reject(new Error("next() called multiple times"));
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length && next) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0);
  };
}

export type Next = () => Promise<any>;
export type Middleware<T> = (context: T, next: Next) => any;
export type ComposedMiddleware<T> = (
  context: T,
  next?: Next,
) => Promise<void>;
