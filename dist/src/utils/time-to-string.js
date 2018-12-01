"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function timeToString(ms, pretty = false) {
    let left = ms;
    const hours = Math.floor(left / 3600000);
    left %= 3600000;
    const minutes = Math.floor(left / 60000);
    left %= 60000;
    const seconds = Math.floor(left / 1000);
    const space = pretty ? " " : "";
    let s = `${hours}h${space}${minutes}m${space}${seconds}s`;
    if (pretty) {
        s = chalk.bold.inverse(s);
    }
    return s;
}
exports.timeToString = timeToString;
//# sourceMappingURL=time-to-string.js.map