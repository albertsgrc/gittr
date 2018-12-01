"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
function exit(msg, code = 1) {
    logger_1.Log.error(msg);
    process.exit(code);
}
exports.exit = exit;
//# sourceMappingURL=exit.js.map