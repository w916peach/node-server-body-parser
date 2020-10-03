// 获取原始的buffer数据


async function originalBuffer(req) {
    let globalResolve = null;
    let bufs = Buffer.alloc(0);
    req.on('data', chunk => bufs = Buffer.concat([bufs, chunk]))
    req.on('end', () => globalResolve(bufs));
    return new Promise(resolve => {
        globalResolve = resolve;
    });
}

module.exports = originalBuffer;