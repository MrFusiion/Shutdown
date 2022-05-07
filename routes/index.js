const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const db = require("../db");
const { minify, cookie } = require("../middleware");


const router = express.Router();

router.use(session({
    name: "user",
    resave: false,
    saveUninitialized: false,
    secret: fs.readFileSync("keys/private.key", "utf8"),
    cookie: {
        sameSite: true,
        secure: process.env.PROTOCOL === "https"
    }
}));

router.use(express.json());
router.use(cookie);

router.use((req, res, next) => {
    res.token = function (username) {
        if (username) {
            res.cookie("token", db.users.token(username), {
                maxAge: process.env.TOKEN_AGE || 86400,
                secure: process.env.PROTOCOL === "https"
            });
        } else {
            res.cookie("token", null, { maxAge: 0 });
        }
    }

    if (!req.session.user && req.cookies.token) {
        const user = db.users.verify(req.cookies.token);
        if (user) {
            res.token(user.username);
            req.session.user = user;
        } else {
            res.token(null);
        }
    }
    next();
});

router.use("/error", (req, res, next) => {
    res.status(401);
    next();
});


router.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/app/timer");
    } else {
        res.redirect("/login");
    }
});

router.use("/app", minify({ dir: "./public/app" }), (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}, express.static(path.resolve(__dirname, "../public/app")));

router.use("/images", express.static(path.resolve(__dirname, "../public/images")));

router.use("/login", minify({ dir: "./public/login" }), (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/app/timer");
    }
    next();
}, express.static(path.resolve(__dirname, "../public/login")));

router.use("/api", require("./api"));

router.use(require("./err"))

module.exports = router;