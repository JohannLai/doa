<div align="center">

<img src="/docs/logo.png" alt="Doa middleware framework for deno"/>

[![Github Action Status](https://github.com/JohannLai/doa/workflows/build/badge.svg)](https://github.com/JohannLai/doa/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/github/license/JohannLai/doa)](https://github.com/JohannLai/doa/blob/master/LICENSE)
[![tag](https://img.shields.io/badge/deno-1.1.3-green.svg)](https://github.com/denoland/deno)
[![tag](https://img.shields.io/badge/std-0.59.0-green.svg)](https://github.com/denoland/deno)

A middleware framework for Deno's http serve. Transplanted from Koa.

</div>

## ⚡️ Quick start

A basic usage, responding to every request with *Hello World*;

```js
import { App } from "https://deno.land/x/doa/mod.ts";

const app = new App();

app.use(async ctx => {
  ctx.status = 200;
  ctx.body = "Hello World";
});

app.listen({ port: 8000 });
```

Adding middlewares through `app.use(middleware)`, will cause all of the middlewares to be executed upon each request in the specified order. When you call the middleware, it passed the context and next method in the stack.

A more complex example with [responseTime middleware](https://github.com/JohannLai/response-time), which will add `x-response-time` in the response header:

```js
import { App } from "https://deno.land/x/doa/mod.ts";
import { responseTime } from "https://deno.land/x/response-time/mod.ts";

const app = new App();

app.use(responseTime());

app.use(async ctx => {
  ctx.status = 200;
  ctx.body = "Hello World";
});

app.listen({ port: 8000 });

```

## 📑 docs
For more information see https://koajs.com/.

## 🧪 Running tests

More than 199 test cases（ over 90% ） to ensure code quality.

```bash
$ deno test --allow-read --allow-write --allow-net --allow-hrtime  

# test result: ok. 199 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (715ms)
```

## 🚀 Running benchmarks
Use [wrk](https://github.com/wg/wrk) to benchmark doa.

```bash
$ make -C benchmarks 
```

## 🎯 Trouble Shooting

Make sure you are using **deno 1.1.3** and **std 0.59.0.**  Doa will continue to update deno to the latest version later. 

## License

[MIT](https://github.com/JohannLai/doa/blob/master/LICENSE)
