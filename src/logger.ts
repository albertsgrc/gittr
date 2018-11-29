import { createLogger } from "winston";
import winston = require("winston");
import { name } from "../package.json";

export const Log = createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.align(),
        winston.format.prettyPrint(),
        winston.format.printf((info) => {
            const { level, message, ...args } = info;

            return `[${level}]: ${message} ${
                Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
            }`;
        }),
    ),
    transports: [new winston.transports.Console({ level: "info" })],
});
