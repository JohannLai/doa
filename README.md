<div align="center">

<img src="/docs/logo.png" alt="Doa middleware framework for deno"/>

![Github Action Status](https://github.com/JohannLai/doa/workflows/build/badge.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/github/license/JohannLai/doa)](https://github.com/JohannLai/doa/blob/master/LICENSE)
[![tag](https://img.shields.io/badge/deno->=1.1.3-green.svg)](https://github.com/denoland/deno)
[![tag](https://img.shields.io/badge/std-0.59.0-green.svg)](https://github.com/denoland/deno)

A middleware framework for Deno's http serve. Transplanted from Koa.

</div>

## ⚡️Quick start

A basic usage, responding to every request with *Hello Workd*;
```js
import { App } from "https://deno.land/x/gh:johannlai:doa/mod.ts";

app.use(async ctx => {
  ctx.status = 200;
  ctx.body = "Hello World";
});

app.listen({ port: 8000 });
```

Adding middlewares through `app.use(middleware)`, will cause all of the middlewares to be executed upon each request in the specified order. When you call the middleware, it passed the context and next method in the stack

A more complex example:

```js
import { App } from "https://deno.land/x/gh:johannlai:doa/mod.ts";

const app = new App();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response
app.use(async (ctx) => {
  ctx.status = 200;
  ctx.set("x-user-name", "johannlai");
  ctx.body = "Hello World";
});

app.on("error", (err: any) => {
  console.error("server error", err);
});

await app.listen({ port: 8000 });

```

## License

[MIT](https://github.com/JohannLai/doa/blob/master/LICENSE)
