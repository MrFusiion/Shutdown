require("dotenv").config();
const app = require("./app");
const db = require("./db");

const {
    LOGIN_USERNAME: username = "admin",
    LOGIN_PASSWORD: password = "admin"
} = process.env;

db.users.add({username, password, is_admin: true});


app.init().then(() => {
    app.start();
});