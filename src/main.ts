import { CLI, Shim } from "clime";
import { GitRepository } from "git-repository";
import { GitlabClient } from "gitlab-client";
import * as Path from "path";
import { TogglClient } from "toggl-client";
import { isDevelopment } from "utils/is-development";
import { Config } from "./config";

const main = async () => {
    await Config.load();

    GitRepository.initialize(Config.gitRepositoryPath);
    TogglClient.initialize(Config.togglToken);

    const { hostname } = await GitRepository.getRemoteInfo();

    GitlabClient.initialize(`https://${hostname}`, Config.gitlabToken);

    CLI.commandModuleExtension = isDevelopment() ? ".ts" : ".js";

    const cli = new CLI("gittt", Path.join(__dirname, "commands"));

    const shim = new Shim(cli);
    shim.execute(process.argv);
};

main();
