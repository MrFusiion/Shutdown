const { xPost } = require("requests");
const { AppWebSocket } = require("websocket");

var time = 0
handle = null;


const timerText = document.querySelector("#timer-text");
function setTime(time) {
    function span(text, hidden, sep) {
        if (hidden || sep) {
            return `<span class="${hidden ? "hidden" : ""} ${sep ? "sep" : ""}">${text}</span>\n`;
        }
        return `<span>${text}</span>\n`;
    }

    time = Math.floor(time);
    const hours = Math.floor(time / 60 * (1 / 60));
    const minutes = Math.floor(time % 3600 * (1 / 60));
    const seconds = time % 60;

    var html = "";
    var sum = 0;
    for (let val of [hours, minutes, seconds]) {
        const str = val.toString().padStart(2, "0");
        html += sum == 0 && val <= 9 ? span("0", true) : span(str[0]);
        html += sum == 0 && val == 0 ? span("0", true) : span(str[1]);
        html += span(":", val == 0, true);
        sum += val;
    }
    html = html.slice(0, -span(":", seconds == 0).length - 1);
    timerText.innerHTML = html;
}

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

function set(t) {
    time = t;
    setTime(time);
}

function startTimer() {
    if (!handle && time > 0) {
        setTime(time);
        var ti = timeInterval();
        handle = setInterval(() => {
            time -= ti() / 1000;
            setTime(time);
        }, 100)
    };
}

function pauseTimer() {
    if (handle) {
        clearInterval(handle);
        handle = null;
    }
}

function stopTimer() {
    pauseTimer();
    time = 0;
} 


const dialogElem = document.querySelector(".dialog");
const acceptBtn = dialogElem.querySelector("#accept");
const cancelBtn = dialogElem.querySelector("#cancel");

function showDialog() {
    dialogElem.style.pointerEvents = "all";
    dialogElem.style.opacity = 1;
}

function hideDialog() {
    dialogElem.style.pointerEvents = "none";
    dialogElem.style.opacity = 0;
}
    

acceptBtn.addEventListener("click", () => {
    xPost("/api/v1/action/shutdown/accept");
});

cancelBtn.addEventListener("click", () => {
    xPost("/api/v1/action/shutdown/cancel");
});


/**
 * Buttons actions
 */
const startBtn = document.querySelector("#start.btn");
const pauseBtn = document.querySelector("#pause.btn");
const stopBtn = document.querySelector("#stop.btn");
const shutdownBtn = document.querySelector("#shutdown.btn");
const logoutBtn = document.querySelector("#logout.btn");


startBtn.addEventListener("click", () => xPost("/api/v1/timer/start"));
pauseBtn.addEventListener("click", () => xPost("/api/v1/timer/pause"));
stopBtn.addEventListener("click", () => xPost("/api/v1/timer/stop"));

shutdownBtn.addEventListener("click", () => xPost("/api/v1/action/shutdown"));
logoutBtn.addEventListener("click", () => xPost("/api/v1/user/logout")
    .then(() => window.location.href = window.location.origin));
    

const timeButtons = document.querySelectorAll(".time-buttons .btn");
timeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const time = parseInt(btn.dataset.seconds);
        xPost("/api/v1/timer/add", { time });
    });
});


const aws = new AppWebSocket("/timer");
aws.addEventListener("message", (e) => {
    const { type, time } = JSON.parse(e.data);;
    switch (type) {
        case "set":
            set(time);
            break;
        case "start":
            set(time);
            startTimer();
            break;
        case "pause":
            set(time);
            pauseTimer();
            break;
        case "stop":
            set(time);
            stopTimer();
            break;
        case "shutdown":
            showDialog();
            break;
        case "accept":
        case "cancel":
            hideDialog();
            break;
    }
});