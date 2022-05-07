const fs = require("fs");
process.chdir("interface");

const RES = 360
const COLORS = [
    "#fd004c",
    "#fe9000",
    "#fff020",
    "#3edf4b",
    "#3363ff",
    "#b102b7",
    "#fd004c",
]
const step = 360 / RES;

var data = "@keyframes rgb {\n";
for (let i = 0; i < RES + 1; i++) {
    const deg = (i * step).toFixed(3);
    const per = (deg / RES * 100).toFixed(3);
    data += `\t${per.toString().padStart(6, " ")}% { background: conic-gradient(`

    var s = `from ${deg.toString().padStart(6, " ").toString()}deg, `
    for (let color of COLORS) {
        s += `${color}, `
    }
    s = s.slice(0, -2)

    data += s + `); }\n`
}
data += "}\n"


fs.writeFileSync("rgb.css", data);

console.log(`${process.cwd()}\\rgb.css created`);