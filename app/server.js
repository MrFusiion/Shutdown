const https = require("https");
const http = require("http");
const ip = require("ip");
const fs = require("fs");

function createServer(protocol, app) {
    if (protocol === "https") {
        return https.createServer({
            key: fs.readFileSync("keys/localhost.key"),
            cert: fs.readFileSync("keys/localhost.crt"),
            passphrase: process.env.PASSPHRASE
        }, app);
    } else if (protocol === "http") {
        return http.createServer(app);
    } else {
        throw new Error("Unsupported protocol");
    }
}


function address(protocol, hostname, port) {
    hostname == "0.0.0.0" ? hostname = ip.address() : hostname;
    return `${protocol}://${hostname}:${port}`;
}


module.exports = {
    createServer, address
}