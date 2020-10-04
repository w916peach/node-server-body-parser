// 根据请求头中不同的content-type值进行不同的处理
const fs = require('fs')
const resolveFormData = require('./utils/resolveFormData')
const mimesAble = {
    // 普通的文本数据
    'text/plain'(req, bodyBuf) {
        try {
            req.body = { text: bodyBuf.toString() }
            req.bodyBuf = bodyBuf;
        } catch (err) {
            throw new Error(err);
        }
    },
    // json格式的数据
    'application/json'(req, bodyBuf) {
        try {
            req.body = JSON.parse(bodyBuf.toString());
            req.bodyBuf = bodyBuf;
        } catch (err) {
            console.log('检测到您传递的contentType为application/json,但是您的body数据可能不是合法的json格式数据，请检查')
            throw new Error(err);
        }
    },
    // key-value格式的数据
    'application/x-www-form-urlencoded'(req, bodyBuf) {
        try {
            const text = bodyBuf.toString();
            let obj = {};
            text.split('&').forEach(item => {
                let arr = item.split('=');
                obj[arr[0]] = arr[1];
            });
            req.body = obj;
            req.bodyBuf = bodyBuf;
        } catch (err) {
            console.log('检测到您传递的contentType为application/x-www-form-urlencoded,但是您的body数据可能不是合法的该格式数据，请检查')
            throw new Error(err);
        }
    },
    // form-data格式的数据
    'multipart/form-data'(req, bodyBuf) {
        resolveFormData(req, bodyBuf);
    },
    // 处理单个文件（以二进制的方式）
    'application/single-file'(req, bodyBuf) {
        req.body = {
            contentType: req.headers['content-type'],
            buf: bodyBuf
        };
        req.bodyBuf = bodyBuf;
    }
}

module.exports = mimesAble;