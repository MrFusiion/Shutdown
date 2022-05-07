PROTOCOLS = {
    "https:": "wss",
    "http:": "ws"
}


class AppWebSocket extends WebSocket {
    constructor(path) {
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        super(`${PROTOCOLS[protocol]}://${hostname}${port && ":" + port}${path}`);
    }
}


class ApiWebSocket extends AppWebSocket {
    constructor(path) {
        super(`/api${path}`);
    }
}


module.exports = {
    AppWebSocket, ApiWebSocket
}