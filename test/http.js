const http = require('http')
const express = require('express')
const Koa = require('koa');
const expressApp = express();
const koaApp = new Koa();
const path = require('path');
const parser = require('../src')
expressApp.use(express.static(path.join(__dirname, './public'))); // 静态资源服务器
const app = (req, res) => {
    res.end('3000')
}




expressApp.post('/express/postTest', async (req, res, next) => {
    await parser(req);
    console.log(req.body);
    res.send('test');
});


















http.createServer(app).listen(3000, () => console.log(`server had run at http://localhost:3000`));
expressApp.listen(3001, () => console.log(`server had run at http://localhost:3001`));
koaApp.listen(3002, () => console.log(`server had run at http://localhost:3002`));