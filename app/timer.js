const app = require("./");
const { ipcMain } = require("electron");
const { max, min } = Math;
const MAX_TIME = 24 * 60 * 60;
const TIME_SAFE_ZONE = 60;
var shutdowning = false;

function getUTCTime() {
    let d = new Date();
    return d.getTime() + d.getTimezoneOffset();
}

function timeInterval() {
    var s = getUTCTime();
    return function () {
        var t = getUTCTime() - s;
        s = getUTCTime();
        return t;
    }
}


var timer = 0, handle = null;
const source = app.wss("/timer");
source.on("connection", function (ws) {
    if (shutdowning) {
        ws.send(JSON.stringify({ type: "shutdown", time: timer }));
    } else if (handle) {
        ws.send(JSON.stringify({ type: "start", time: timer }));
    } else {
        ws.send(JSON.stringify({ type: "stop", time: timer }));
    }
});


function fire(type) {
    source.sendAll({
        type,
        time: timer
    });
}


function set(time) {
    if (!handle || time >= TIME_SAFE_ZONE) {
        timer = max(min(time, MAX_TIME), 0);
        fire("set");
    }
}


function shutdown() {
    shutdowning = true;
    stop();
    app.shutdown();
    fire("shutdown");
}

function accept() {
    shutdowning = false;
    app.accept();
    fire("accept");
}

function cancel() {
    shutdowning = false;
    app.cancel();
    fire("cancel");
}


function add(time) {
    set(timer + time);
}


function start() {
    if (!handle && timer > 0) {
        const ti = timeInterval();
        handle = setInterval(() => {
            timer -= ti() / 1000;
            if (timer <= 0) {
                stop();
                shutdown();
            }
        }, 100);
        fire("start");
    }
}


function pause() {
    if (handle) {
        clearInterval(handle);
        handle = null;
        fire("pause");
    }
}


function stop() {
    if (handle) {
        clearInterval(handle);
        handle = null;
        timer = 0;
        fire("stop");
    }
}


ipcMain.on("accept", (e) => {
    accept();
    e.returnValue = true;
});
    
ipcMain.on("cancel", (e) => {
    cancel();
    e.returnValue = true;
});


module.exports = {
    getUTCTime, timeInterval,
    add, start, pause, stop,
    shutdown, accept, cancel
};