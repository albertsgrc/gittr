const chalk = require("chalk");
import { command, Command, metadata, param } from "clime";
import { GitRepository } from "git-repository";
import { TogglClient } from "toggl-client";
import { exit } from "utils/exit";
import { Log } from "utils/logger";

@command({
    description: "Starts a new timer",
})
export default class extends Command {
    @metadata
    public async execute() {
        const currentBranchName = await GitRepository.getCurrentBranchName();

        const { project } = await GitRepository.getRemoteInfo();

        const description = currentBranchName;

        const current = await TogglClient.current();

        if (!current) {
            await TogglClient.start(project, description);
            Log.info(
                `Started task ${chalk.bold(description)} on project ${chalk.bold(project)}`,
            );
        } else {
            exit(`Task ${chalk.bold(current.description)} is currently in progress`);
        }
    }
}
