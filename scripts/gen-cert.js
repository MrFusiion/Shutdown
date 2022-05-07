require("dotenv").config();
const { exec } = require("child_process");
const ip = require("ip");

process.chdir("keys");
const ENV = {
    PASSPHRASE: process.env.PASSPHRASE,
    OPENSSL_CONF: "C:/Program Files/OpenSSL-Win64/bin/openssl.cfg",
}

const OPTIONS = {
    passout: "env:PASSPHRASE",
    x509: "",
    days: 365,
    newkey: "rsa:4096",
    keyout: "localhost.key",
    out: "localhost.crt",
    sha256: "",
    //nodes: "",
    subj: subjStr({
        C: "BE",
        ST: "Tienen",
        L: "Belgium",
        O: "Flux Studios",
        OU: "Fluxel",
        CN: ip.address(),
        emailAddress: "fuse-x-fuzionzz@outlook.be"
    }),
    _: [addextStr({
        subjectAltName: `IP:${ip.address()}`,
        certificatePolicies: "1.2.3.4"
    })]
}


function addextStr(addext) {
    return Object.keys(addext).map(key => `-addext "${key} = ${addext[key]}"`).join(" ");
}

function subjStr(subj) {
    return `"${Object.keys(subj).map(key => `/${key}=${subj[key]}`).join("")}"`;
}

function optionsArray(options) {
    return Object.keys(options).reduce((acc, key) => {
        if (key == "_") {
            acc.push(...options[key]);
            return acc;
        }
        return acc.concat([`-${key}`, options[key].toString()]);
    }, []).filter((x) => x);
}

function execCmd(cmd, args, options) {
    return new Promise((resolve, reject) => {
        exec([cmd, ...args].join(" "), options, (err, stdout, stderr) => {
            if (err) reject(err);
            else resolve(stdout);
        });
    });
}



var commands = [
    // ["openssl", ["genrsa", "-out", "key.pem"]],
    // ["openssl", ["req", "-new", "-subj", subjStr(SUBJECT), addextStr(ADD_EXT),
    //              "-key", "key.pem", "-out", "csr.pem", "-config", CONFIG]],
    // ["openssl", ["x509", "-req", "-days", DAYS, "-in", "csr.pem", "-signkey", "key.pem", "-out", "cert.pem"]],
    // ["del", ["csr.pem"]]

    ["openssl", ["req", ...optionsArray(OPTIONS)], `${process.cwd()}\\${OPTIONS.keyout} created\n${process.cwd()}\\${OPTIONS.out} created`],
]

async function run() {
    for (let cmddata of commands) {
        const [cmd, args, message] = cmddata;
        await execCmd(cmd, args, {
            env: ENV
        }).then(() => {
            if (message) console.log(message);
        }).catch((err) => {
            console.error("err: ", err);
        });
    }
}

run();