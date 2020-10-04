const url = require('url');
module.exports = (req) => {
    const { query } = url.parse(req.url, true);
    req.query = query;
}