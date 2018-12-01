import { Log } from "./logger";

export function exit(msg: string, code = 1) {
    Log.error(msg);
    process.exit(code);
}
