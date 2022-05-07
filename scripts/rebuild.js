const fs = require("fs");
const { execSync } = require("child_process");

fs.rmSync("node_modules", { recursive: true, force: true });
fs.rmSync("package-lock.json", { force: true });

function spawn(command, args=[]) {
    return new Promise((resolve, reject) => {
        const child = _spawn(command, args);
        child.stdout.on("data", (d) => console.log(d.toString()));
        child.stderr.on("data", (d) => reject(d.toString()));
        child.on("close", resolve);
    }).catch((err) => console.error("err: ", err));
}

// spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", ["i"]).then(() => {
//     spawn("./node_modules/.bin/electron-rebuild.ps1").then(() => {
//         console.log("rebuilded!");
//     });
// });

execSync("npm install");
execSync("./node_modules/.bin/electron-rebuild", { shell: "powershell.exe" });
console.log("rebuilded!");