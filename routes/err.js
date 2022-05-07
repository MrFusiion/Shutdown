const express = require("express");
const router = express.Router();
const path = require("path");


router.use((req, res, next) => {
    if (res.statusCode === 401) {
        res.sendFile(path.resolve(__dirname, "../public/error/401.html"));
    } else {
        next();
    }
});


router.use((req, res, next) => {
    res.status(404).sendFile(path.resolve(__dirname, "../public/error/404.html"));
});


router.use((err, req, res, next) => {
    if (err) {
        res.status(500).sendFile(path.resolve(__dirname, "../public/error/500.html"));
    } else {
        next();
    }
});


module.exports = router;