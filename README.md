<div align="center">

<img src="/docs/logo.png" alt="Doa middleware framework for deno"/>

![Github Action Status](https://github.com/JohannLai/doa/workflows/build/badge.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/github/license/JohannLai/doa)](https://github.com/JohannLai/doa/blob/master/LICENSE)
[![tag](https://img.shields.io/badge/deno->=1.0.5-green.svg)](https://github.com/denoland/deno)
[![tag](https://img.shields.io/badge/std-0.54.0-green.svg)](https://github.com/denoland/deno)

A middleware framework for Deno's http serve.Transplanted from Koa

</div>



## ⚡️Quick start


```js
import {
  App
} from "https://deno.land/x/gh:johannlai:doa/mod.ts";

app.use(async ctx => {
  ctx.status = 200;
  ctx.body = 'Hello World';
});

app.listen({ port: 8000 });
```


## ⚠️ License

[MIT](https://github.com/JohannLai/doa/blob/master/LICENSE)