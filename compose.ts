import * as Koa from "./@types/koa.d.ts";

export function compose<T1, U1, T2, U2>(
  middleware: [Koa.Middleware<T1, U1>, Koa.Middleware<T2, U2>],
): Koa.Middleware<T1 & T2, U1 & U2>;

export function compose<T1, U1, T2, U2, T3, U3>(
  middleware: [
    Koa.Middleware<T1, U1>,
    Koa.Middleware<T2, U2>,
    Koa.Middleware<T3, U3>,
  ],
): Koa.Middleware<T1 & T2 & T3, U1 & U2 & U3>;

export function compose<T1, U1, T2, U2, T3, U3, T4, U4>(
  middleware: [
    Koa.Middleware<T1, U1>,
    Koa.Middleware<T2, U2>,
    Koa.Middleware<T3, U3>,
    Koa.Middleware<T4, U4>,
  ],
): Koa.Middleware<T1 & T2 & T3 & T4, U1 & U2 & U3 & U4>;

export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5>(
  middleware: [
    Koa.Middleware<T1, U1>,
    Koa.Middleware<T2, U2>,
    Koa.Middleware<T3, U3>,
    Koa.Middleware<T4, U4>,
    Koa.Middleware<T5, U5>,
  ],
): Koa.Middleware<T1 & T2 & T3 & T4 & T5, U1 & U2 & U3 & U4 & U5>;

export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5, T6, U6>(
  middleware: [
    Koa.Middleware<T1, U1>,
    Koa.Middleware<T2, U2>,
    Koa.Middleware<T3, U3>,
    Koa.Middleware<T4, U4>,
    Koa.Middleware<T5, U5>,
    Koa.Middleware<T6, U6>,
  ],
): Koa.Middleware<T1 & T2 & T3 & T4 & T5 & T6, U1 & U2 & U3 & U4 & U5 & U6>;

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
    Koa.Middleware<T1, U1>,
    Koa.Middleware<T2, U2>,
    Koa.Middleware<T3, U3>,
    Koa.Middleware<T4, U4>,
    Koa.Middleware<T5, U5>,
    Koa.Middleware<T6, U6>,
    Koa.Middleware<T7, U7>,
  ],
): Koa.Middleware<
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
    Koa.Middleware<T1, U1>,
    Koa.Middleware<T2, U2>,
    Koa.Middleware<T3, U3>,
    Koa.Middleware<T4, U4>,
    Koa.Middleware<T5, U5>,
    Koa.Middleware<T6, U6>,
    Koa.Middleware<T7, U7>,
    Koa.Middleware<T8, U8>,
  ],
): Koa.Middleware<
  T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8,
  U1 & U2 & U3 & U4 & U5 & U6 & U7 & U8
>;

export function compose<T>(
  middleware: Array<Middleware<T>>,
): ComposedMiddleware<T>;

export function compose(middleware: Function[]) {
  return function (context: any, next?: Koa.Next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
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
  };
}

export type Middleware<T> = (context: T, next: Koa.Next) => any;
export type ComposedMiddleware<T> = (
  context: T,
  next?: Koa.Next,
) => Promise<void>;
