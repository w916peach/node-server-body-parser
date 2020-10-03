const originalBuffer = require('./utils/originalBuffer')
const resolveRHcontentType = require('./utils/resolveRHcontentType')
const mimesAble = require('./mimesAble')



module.exports = async (req) => {
    let contentType = resolveRHcontentType(req);
    let bodyBuf = await originalBuffer(req);
    console.log(contentType)
    mimesAble[contentType](req, bodyBuf);
}