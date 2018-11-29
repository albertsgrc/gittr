import { CLI, Shim } from "clime";
import { Log } from "logger";
import * as Path from "path";

const cli = new CLI("gittt", Path.join(__dirname, "commands"));

const shim = new Shim(cli);
shim.execute(process.argv);
