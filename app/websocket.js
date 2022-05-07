const ws = require("ws");


class WebSocketServer extends ws.Server {
    #conns;

    constructor(server, path) {
        super({ server, path });
        this.#conns = [];
        this.on("connection", (ws) => {
            const id = this.#conns.push(ws);
            //console.log("Connection", id);
            ws.on("close", () => {
                //console.log("Disconnection", id);
                delete this.#conns[id];
            });
        });
    }

    sendAll(msg) {
        this.#conns.forEach(ws => {
            ws.send(JSON.stringify(msg));
        });
    }
}


module.exports.WebSocketServer = WebSocketServer;