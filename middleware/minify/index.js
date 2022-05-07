const path = require("path");
const fs = require("fs");
const ponse = require("ponse");

const jsMinify = require("terser").minify;
const cssMinfiy = require("clean-css");
const htmlMinify = require("html-minifier-terser").minify;
const browserify = require("browserify");

const PATHS = ["./modules"];
const EXTS = [ "js", "css", "html" ];
const OPTIONS = JSON.parse(fs.readFileSync(path.resolve(__dirname, "options.json"), "utf8"));

async function minifyFile(data, type, options) {
    switch (type) {
        case "js":
            return jsMinify(data, options.js || {})
                .then(({ code }) => code);
        case "css":
            const {
                styles,
                errors: { error }
            } = new cssMinfiy(options.css || {}).minify(data)
            
            if (error) return Promise.reject(error);
            return Promise.resolve(styles);
        case "html":
            return htmlMinify(data, options.html || {});

    }
    return Promise.reject(new Error("Unknown type"));
}

module.exports = function (options) {
    const {
        dir = "./"
    } = options;

    return function (req, res, next) {
        const { url } = req;
        const name = path.join(dir, url);
        
        const ext = path.extname(name).slice(1);
        if (!EXTS.includes(ext)) return next();

        fs.promises.readFile(name).then((data) => {
            if (ext === "js") {
                return new Promise((resolve, reject) => {
                    const b = browserify({ paths: PATHS });
                    b.add(name).bundle((err, buf) => {
                        if (err) return reject(err);
                        resolve(buf.toString("utf-8"));
                    });
                });
            }
            return data;
        }).then(data => {
            return minifyFile(data, ext, OPTIONS);
        }).then(data => {
            ponse.send(data, {
                request: req,
                response: res,
                name,
                gzip: true,
                cache: true,
            });
        });
    }
}