const fs = require("fs");
const Database = require('better-sqlite3');
const { TableUsers } = require("./users.js");


class DataBase extends Database {
    constructor() {
        super("db.sqlite", {});
        this.users = new TableUsers(this, fs.readFileSync("keys/encrypt.key", "utf8"));
        this.exec(fs.readFileSync("db/db.sql", "utf8"));
    }
}

module.exports = new DataBase();