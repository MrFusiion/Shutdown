const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("accept", () => {
    ipcRenderer.sendSync("accept");
});

contextBridge.exposeInMainWorld("cancel", () => {
    ipcRenderer.sendSync("cancel");
});

contextBridge.exposeInMainWorld("getTime", () => {
    return process.env.TIME || 60;
});

var visibilityState = "hidden";
contextBridge.exposeInMainWorld("getVisibilityState", () => {
    return visibilityState;
});

ipcRenderer.on("show", () => {
    visibilityState = "visible";
    window.dispatchEvent(new Event("visibilitychanged"));
});

ipcRenderer.on("hide", () => {
    visibilityState = "hidden";
    window.dispatchEvent(new Event("visibilitychanged"));
});