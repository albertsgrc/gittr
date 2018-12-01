"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston = require("winston");
const is_development_1 = require("./is-development");
exports.Log = winston_1.createLogger({
    level: is_development_1.isDevelopment() ? "debug" : "info",
    format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint(), winston.format.printf((info) => {
        const { level, message } = info, args = __rest(info, ["level", "message"]);
        return `[${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`;
    })),
    transports: [new winston.transports.Console({ level: "info" })],
});
//# sourceMappingURL=logger.js.map