const crypto = require("crypto");
const fs = require("fs");
const { exec } = require("child_process");

process.chdir("keys");


fs.writeFile("encrypt.key", crypto.randomBytes(8).toString("hex"), { flag: "w" }, (err) => {
    if (err) console.error("err: ", err);
    else console.log(`${process.cwd()}\\encrypt.key created`);
});


exec("openssl genrsa -out private.key", (err, stdout, stderr) => {
    if (err) console.error("err: ", stderr);
    else {
        if (stdout) console.log(stdout);
        console.log(`${process.cwd()}\\private.key created`);
    }
});