module.exports = function (req, res, next) {
    req.cookies = {};
    if (req.headers.cookie) {
        for (let cookie of req.headers.cookie.split(";")) {
            let [key, value] = cookie.split("=");
            req.cookies[key.trimStart()] = value;
        }
    }
    next();
}