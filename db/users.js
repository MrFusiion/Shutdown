const { Chipher, generateIdentifier } = require("./chipher.js");


const jwt = require("jsonwebtoken");
const fs = require("fs");
const SECRET = fs.readFileSync("keys/private.key", "utf8");


function verify(token) {
    return jwt.verify(token, SECRET)
}


function sign(user, options = {}) {
    const token = jwt.sign(user, SECRET, { expiresIn: options.expiresIn || 86400 });
    // console.log(user, token);
    return token;
}


class TableUsers {
    #db; #chipher;

    constructor(db, key) {
        this.#db = db;
        this.#chipher = new Chipher(key, "des-ecb");
    }

    add(user) {
        const username = user.username.toLowerCase();
        if (!this.get({ username })) {
            const epassword = this.#chipher.encode(user.password);

            this.#db.prepare("INSERT INTO users (username, password, is_admin) values (?, ?, ?)")
                .run(username, epassword, user.is_admin ? 1 : 0);
        }
    }

    get({ username, password, epassword }) {
        username = username.toLowerCase();
        if (password || epassword) {
            const user = this.#db.prepare("SELECT * FROM users WHERE username = ? AND password = ?")
                .get(username, epassword || this.#chipher.encode(password));
            if (user) user.is_admin = !!user.is_admin;
            return user;
        }
        return this.#db.prepare("SELECT * FROM users WHERE username = ?")
            .get(username);
    }

    update(username, newUser) {
        username = username.toLowerCase();
        const user = this.get({ username });
        if (user) {
            newUser = Object.assign({}, user, newUser);
            this.#db.prepare("UPDATE users SET username = ?, password = ?, is_admin = ? WHERE username = ?")
                .run(newUser.username, newUser.password, newUser.is_admin ? 1 : 0, username);
        }
    }

    token(username) {
        username = username.toLowerCase();
        const user = this.get({ username });
        if (user) {
            user.crumbles = generateIdentifier(32);
            this.#db.prepare("UPDATE users SET crumbles = ? WHERE username = ?")
                .run(user.crumbles, username);
        }
        return sign(Object.assign({}, user));
    }

    verify(token) {
        try {
            const { username = "", password = "", crumbles = "" } = verify(token);
            const _user = this.get({ username, epassword: password });
            if (_user && _user.crumbles == crumbles) {
                return _user;
            }
        } catch {}
    }

    print() {
        const stmt = this.#db.prepare("SELECT * FROM users");
        stmt.all().forEach(row => {
            if (err) {
                console.log(err);
            } else {
                console.log(row.id + ": " + row.username + " | " + row.password);
            }
        });
    }
}


exports.TableUsers = TableUsers;