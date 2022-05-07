const express = require("express");
const router = express.Router();

const path = require("path");
const db = require(path.join(process.cwd(), "db"));


router.post("/login", (req, res) => {
    const { username, password, remember } = req.body;
        
    if (username && password) {
        const user = db.users.get({ username, password });
        if (user) {
            req.session.user = user;
            if (remember) res.token(user.username);
            return res.status(200).end();
        }
    }
    return res.sendStatus(401);
});


router.post("/logout", (req, res) => {
    if (req.session.user) {
        res.token(null);
        delete req.session.user;
        return res.redirect("/");
    }
    res.sendStatus(401);
});


//Don't enabled this in while in production !!!

// router.get("/token", (req, res) => {
//     if (req.cookies.token) {
//         try {
//             return res.status(200).json(db.users.verify(req.cookies.token));
//         } catch (e) {
//             return res.status(500).json(e);
//         }
//     }
//     res.status(200).json(null);
// });


module.exports = router;