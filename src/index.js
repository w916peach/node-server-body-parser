const originalBuffer = require('./utils/originalBuffer')
const resolveRHcontentType = require('./utils/resolveRHcontentType')
const mimesAble = require('./mimesAble')
const queryParams = require('./utils/queryParams')
module.exports = async (req) => {
    queryParams(req);
    let contentType = resolveRHcontentType(req);
    let bodyBuf = await originalBuffer(req);
    mimesAble[contentType](req, bodyBuf);
}