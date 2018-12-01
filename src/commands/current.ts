import { command, Command, metadata, param } from "clime";
import { Config } from "config";
import { TogglClient } from "toggl-client";
import { Log } from "utils/logger";
import { timeToString } from "utils/time-to-string";
const chalk = require("chalk");

@command({
    description: "Prints the current ongoing task",
})
export default class extends Command {
    @metadata
    public async execute() {
        const current = await TogglClient.current();

        Log.info(`Current repository is ${chalk.bold(Config.gitRepositoryPath)}`);

        if (!current) {
            Log.info("Not working on any task right now");
        } else {
            const { description, start } = current;

            Log.info(
                `Current time entry:\n\n` +
                    `        ${chalk.bold(description)}\n` +
                    `        Start: ${chalk.bold(new Date(start).toLocaleString())}\n` +
                    `        Elapsed: ${timeToString(
                        Date.now() - new Date(start).getTime(),
                        true,
                    )}\n`,
            );
        }
    }
}
