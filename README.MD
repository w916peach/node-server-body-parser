# node-server-body-parser

在服务端我们经常会接收浏览器端传递的数据，但是浏览器端的数据格式有很多，比如json格式，二进制数据，formData等等。

该工具能够解析浏览器传递的任意格式，并将解析的数据挂在 请求体对象(req.body)的body属性上，将原始数据挂在(req.bodyBuf)上

对于二进制数据，解析为Buffer，并未做任何存储的操作，可以根据自己的使用进行存储。

该库还对地址栏参数做了处理，会挂载至请求体(req.query)的query属性

# 使用

1. 安装

```js
npm i node-server-body-parser -S
```

2. 引入

```js
const bodyParser = require('node-server-body-parser');
```
其中bodyParser是一个函数，接收一个IncomingMessage类的请求体对象，该方法的作用就是把请求体的数据解析并挂载

该方法返回一个promise

3. 可以在任意框架中使用

- 在node原生服务器中使用

```js
const bodyParser = require('node-server-body-parser');
http.createServer(async (req, res) => {
    await bodyParser(req); // 解析请求体数据
    console.log(req.body) 
    console.log(req.bodyBuf)
})

```

- 在express中使用

```js
const app = require('express')();
app.use(async (req, res, next) => {
    await bodyParser(req);
    console.log(req.body) 
    console.log(req.bodyBuf)
    next();
})
```

- 在koa中使用
```js
const app = new require('koa')();
app.use(async (ctx, next) => {
    await bodyParser(ctx.req);
    console.log(ctx.req.body) 
    console.log(ctx.req.bodyBuf)
    await next();
})
```


