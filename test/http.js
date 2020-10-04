const http = require('http')
const express = require('express')
const Koa = require('koa');
const expressApp = express();
const koaApp = new Koa();
const path = require('path');
const parser = require('../src');
const KoaRouter = require('koa-router')
const koaRoute = new KoaRouter();
const koaState = require('koa-static')
expressApp.use(express.static(path.join(__dirname, './public'))); // 静态资源服务器
koaApp.use(koaState(path.join(__dirname, './public'))); // 静态资源服务器
const app = (req, res) => {
    res.end('3000')
}
expressApp.use(async (req, res, next) => {
    await parser(req);
    console.log(req.body);
    next();
})

koaApp.use(async (ctx, next) => {
    await parser(ctx.req);
    console.log(ctx.req.body)
    console.log(ctx.req.query)
    await next();
})
expressApp.post('/express/postTest', async (req, res, next) => {

    res.send('test');
});
koaApp.use(koaRoute.routes()).use(koaRoute.allowedMethods())
koaRoute.post('/koa/posttest', async (ctx, next) => {
    ctx.body = 'koaTest'
})

http.createServer(app).listen(3000, () => console.log(`server had run at http://localhost:3000`));
expressApp.listen(3001, () => console.log(`server had run at http://localhost:3001`));
koaApp.listen(3002, () => console.log(`server had run at http://localhost:3002`));