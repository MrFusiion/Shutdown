const path = require("path");
const fs = require("fs");
const express = require("express");


function createApi(folder) {
    const router = express.Router();
    for (let p of fs.readdirSync(folder)) {
        if (path.extname(p)) {
            router.use(`/${p.split(".")[0]}`, require(path.join(folder, p)));
        }
    }
    return router;
}

const router = express.Router();

router.use("/v1", createApi(path.join(__dirname, "v1")));

module.exports = router;