const path = require("path");
const { app, BrowserWindow } = require("electron");

async function createPopup() {
    await app.whenReady();

    const popup = new BrowserWindow({
        width: 700,
        height: 250,
        resizable: false,
        movable: false,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        paintWhenInitiallyHidden: true,
        show: false,
        center: true,
        closable: false,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "../interface/preload.js")
        }
    });
    popup.loadFile(path.resolve(__dirname, "../interface/index.html"));
    // this.#popup.loadURL("http://localhost:9080/server/interface/timer_popup");

    popup.on("hide", () => {
        popup.webContents.send("hide");
    });

    popup.on("show", () => {
        popup.webContents.send("show");
    });

    return popup;
}


module.exports.createPopup = createPopup;