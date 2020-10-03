const mimesABle = require('../mimesAble')
// 解析请求头的content-type值

// application/json
// application/x-www-form-urlencoded
// text/plain
// multipart/form-data

function resolveRHcontentType(req) {
    // req是原始的请求头
    let contentType = req.headers['content-type'];
    if (!contentType || contentType.startsWith('text/')) {
        return 'text/plain'
    }
    if (contentType.includes(';')) {
        contentType = contentType.slice(0, contentType.indexOf(';'));
    }
    if (!mimesABle[contentType]) {
        contentType = 'application/single-file';
    }
    return contentType;
}
module.exports = resolveRHcontentType