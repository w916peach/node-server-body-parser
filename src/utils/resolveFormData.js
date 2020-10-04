// 获取边界字符串和contentType

function getBoundaryStr(req) {
    let ctStr = req.headers['content-type']
    let contentType = ctStr.split(';')[0];
    let boundary = '--' + ctStr.split(';')[1].split('=')[1];
    return { boundary, contentType }
}

// 以字节的方式 解析formData数据
function resolveFormData(buf, boundary) {
    let [boundaryStarts, boundarySize] = findBoundaryStartIndex(buf, boundary);
    let bufFormDataArray = breakKeyAndValue(buf, boundaryStarts, boundarySize);
    return bufFormDataArray;
}


// 找出所有边界字符串在buf中的开始索引
function findBoundaryStartIndex(buf, boundary) {
    // 找出所有边界字符串在buf中的开始索引
    let boundarySize = Buffer.byteLength(boundary);
    let boundaryStarts = [];
    let index = -1;
    do {
        let startIndex = 0;
        if (boundaryStarts.length > 0) {
            startIndex = boundaryStarts[boundaryStarts.length - 1] + boundarySize;
        }
        index = buf.indexOf(boundary, startIndex);
        if (index !== -1) {
            boundaryStarts.push(index);
        }
    } while (index !== -1);
    return [boundaryStarts, boundarySize];
}
// 对每一块的formData数据进行解析（区分key和value）
function breakKeyAndValue(buf, boundaryStarts, boundarySize) {
    let bufs = []; // 分块储存解析到的buf数据
    for (let i = 0; i < boundaryStarts.length - 1; i++) {
        bufs.push(buf.slice(boundaryStarts[i] + boundarySize, boundaryStarts[i + 1]));
    }
    bufs = bufs.map(item => {
        let arr = [];
        let size = Buffer.byteLength('\r\n\r\n');
        let index = item.indexOf('\r\n\r\n');
        arr[0] = resolveKey(item.slice(0, index)); // key部分的buffer
        arr[1] = item.slice(index + size); // value部分的buffer
        let obj = { ...arr[0], bodyBuf: arr[1] }
        return obj;
    })
    return bufs;
}
// 解析key的数据
function resolveKey(keyBuf) {
    return keyBuf.toString()
        .split('\r\n')
        .filter(item => item)
        .map(item => item.split(';'))
        .reduce((prev, next) => prev.concat(next))
        .map(item => item.trim())
        .map(item => {
            let obj = {};
            let str = '';
            if (item.indexOf('=') !== -1) {
                str = '=';
            } else if (item.indexOf(':') !== -1) {
                str = ':';
            }
            let arr = item.split(str);
            if (arr[1][0] === '"' && arr[1][arr[1].length - 1] === '"') {
                arr[1] = arr[1].slice(1, arr[1].length - 1);
            }
            obj[arr[0]] = arr[1].trim();
            return obj;
        })
        .reduce((prev, next) => ({ ...prev, ...next }));
}

// 对数据进行类型分组

function groupData(bufFormDataArray, req, bodyBuf) {
    req.body = bufFormDataArray;
    req.bodyBuf = bodyBuf;
}

module.exports = (req, bodyBuf) => {
    // 检测接收到的数据类型的格式
    const { boundary } = getBoundaryStr(req);
    const bufFormDataArray = resolveFormData(bodyBuf, boundary);
    // 把文本数据挂在 ctx.request.body上
    // 把文件数据挂在 ctx.request.files上
    groupData(bufFormDataArray, req, bodyBuf);
}