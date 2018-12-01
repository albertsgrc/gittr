#!/usr/bin/env node

import * as Path from "path";

require("tsconfig-paths").register({
    baseUrl: __dirname,
    paths: {},
});

import { CLI, Shim } from "clime";
import { GitRepository } from "git-repository";
import { GitlabClient } from "gitlab-client";

import { TogglClient } from "toggl-client";
import { isDevelopment } from "utils/is-development";
import * as pkg from "../package.json";
import { Config } from "./config";

const main = async () => {
    await Config.load();

    GitRepository.initialize(Config.gitRepositoryPath);
    TogglClient.initialize(Config.togglToken);

    const { hostname } = await GitRepository.getRemoteInfo();

    GitlabClient.initialize(`https://${hostname}`, Config.gitlabToken);

    CLI.commandModuleExtension = isDevelopment() ? ".ts" : ".js";

    const cli = new CLI(pkg.name, Path.join(__dirname, "commands"));

    const shim = new Shim(cli);
    shim.execute(process.argv);
};

main();
