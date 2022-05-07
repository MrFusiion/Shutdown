const express = require("express");
const path = require("path");
const { add, start, pause, stop } = require(path.resolve(process.cwd(), "app/timer"));


const router = express.Router();

router.post("/add", (req, res) => {
    const { time } = req.body;
    if (req.session.user) {
        add(time);
        return res.sendStatus(200);
    }
    return res.sendStatus(401);
});

router.post("/start", (req, res) => {
    if (req.session.user) {
        start();
        return res.sendStatus(200);
    }
    return res.sendStatus(401);
});

router.post("/pause", (req, res) => {
    if (req.session.user) {
        pause();
        return res.sendStatus(200);
    }
    return res.sendStatus(401);
});

router.post("/stop", (req, res) => {
    if (req.session.user) {
        stop();
        return res.sendStatus(200);
    }
    return res.sendStatus(401);
});
        
module.exports = router;