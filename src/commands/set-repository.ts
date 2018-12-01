import { command, Command, metadata, param } from "clime";
import { Config } from "config";
import { Log } from "utils/logger";
const chalk = require("chalk");

@command({
    description: "Sets the default git repository path",
})
export default class extends Command {
    public async execute(
        @param({
            description: "Repository path. Defaults to current working directory.",
        })
        path: string = process.cwd(),
    ) {
        Config.gitRepositoryPath = path;

        Log.info(`Git repository set to ${chalk.bold(path)}`);
    }
}
