const express = require("express");
const { exec } = require("child_process");

const { createServer, address } = require("./server");
const { createPopup } = require("./popup");
const { WebSocketServer } = require("./websocket");

const {
    PORT = 5000,
    HOSTNAME = "127.0.0.1",
    PROTOCOL = "http",
} = process.env;


var popup = null;
const app = exports.app = express()
const server = exports.server = createServer(PROTOCOL, app);

async function init() {
    app.use(require("../routes"));
    popup = await createPopup();
}

function shutdown() {
    if (!popup) throw new Error("App not initialized!");
    popup.focus();
    popup.show();
}

function cancel() {
    if (!popup) throw new Error("App not initialized!"); 
    popup.blur();
    popup.hide();
}

function accept() {
    if (!popup) throw new Error("App not initialized!");
    exec("shutdown -s -t 10");
    popup.blur();
    popup.hide();
}


function start() {
    server.listen(PORT, HOSTNAME, () => {
        console.log(`Server running at ${address(PROTOCOL, HOSTNAME, PORT)}/`);
    });
}


function wss(path) {
    return new WebSocketServer(server, path);
}

module.exports = { init, start, shutdown, wss, app, server, accept, cancel };