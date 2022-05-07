let shutdownBtn = document.querySelector(".btn#shutdown");
shutdownBtn ? shutdownBtn.addEventListener("click", window.accept) : null;

let cancelBtn = document.querySelector(".btn#cancel");
cancelBtn ? cancelBtn.addEventListener("click", window.cancel) : null;

const timerElm = document.querySelector(".timer-text > span");
var time = 0;
var handle = null;

function timeString() {
    return [
        [Math.floor(time/3600), "h"],
        [Math.floor(time%3600*(1/60)), "min"],
        [Math.floor(time % 60), "s"]
    ].reduce((r, [v, s]) => (v > 0 ? r.concat(v+s) : null) || r, []).join(", ");
}

function setTime(t) {
    time = t;
    timerElm.textContent = timeString();
}

function start() {
    if (!handle) {
        setTime(window.getTime());
        let s = new Date().getTime();
        handle = setInterval(() => {
            setTime(time - (new Date().getTime() - s) / 1000);
            s = new Date().getTime();
            if (time <= 0) {
                stop();
                setTime(0);
                window.accept();
            }
        }, 100);
    }
}

function stop() {
    clearInterval(handle);
    handle = null;
    time = window.getTime();
}

window.addEventListener("visibilitychanged", () => {
    if (window.getVisibilityState() === "visible") {
        start();
    } else {
        stop();
    }
});

setTime(window.getTime());