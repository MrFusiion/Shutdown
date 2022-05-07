const express = require("express");
const path = require("path");
const { shutdown, cancel, accept } = require(path.resolve(process.cwd(), "app/timer"));
const router = express.Router();


router.post("/shutdown", (req, res) => {
    if (req.session.user) {
        shutdown();
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});


router.post("/shutdown/accept", (req, res) => {
    if (req.session.user) {
        accept();
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});


router.post("/shutdown/cancel", (req, res) => {
    if (req.session.user) {
        cancel();
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});


module.exports = router;