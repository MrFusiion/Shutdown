const crypto = require("crypto");


function generateIdentifier(length = 16) {
    return crypto.randomBytes(length).toString("base64url");
}


class Chipher {
    #bkey; #algorithm;

    constructor(key, algorithm = "aes-256-cbc") {
        this.#bkey = Buffer.from(key, "hex");
        this.#algorithm = algorithm;
    }

    encode(text) {
        const cipher = crypto.createCipheriv(this.#algorithm, this.#bkey, "")
        let encrypted = cipher.update(text, "utf8", "base64url");
        encrypted += cipher.final("base64url");
        return encrypted;
    }

    decode(encrypted) {
        const decipher = crypto.createDecipheriv(this.#algorithm, this.#bkey, "");
        let decrypted = decipher.update(encrypted, "base64url", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}


exports.generateIdentifier = generateIdentifier;
exports.Chipher = Chipher;