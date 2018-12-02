import { command, Command, metadata, param } from "clime";
import { Config } from "config";
import { GitRepository } from "git-repository";
import { GitlabClient } from "gitlab-client";
import { TogglClient } from "toggl-client";
import { Log } from "utils/logger";
import { timeToString } from "utils/time-to-string";

@command({
    description: "Stops the current timer for a repository folder",
})
export default class extends Command {
    @metadata
    public async execute() {
        const duration = await TogglClient.stop();
        Log.info(`Stopped toggl timer. Total time: ${timeToString(duration * 1000, true)}`);

        const { hostname } = await GitRepository.getRemoteInfo();
        GitlabClient.initialize(`https://${hostname}`, Config.gitlabToken);
        GitlabClient.logTime(duration * 1000);
    }
}
