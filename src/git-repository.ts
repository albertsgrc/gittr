import * as _ from "lodash";
import { exit } from "utils/exit";
const chalk = require("chalk");

const SimpleGit = require("simple-git/promise");

export class GitRepository {
    public static async initialize(path: string) {
        this.path = path;
        this.simpleGit = SimpleGit(path);

        await this.check();
    }

    public static async getRemoteInfo() {
        const remotes = await this.simpleGit.getRemotes(true);

        if (remotes.length === 0) {
            exit(`No remote for repository ${chalk.bold(this.path)}`);
        }

        const remote = _.find(remotes, (rem: any) => rem.name === "origin") || remotes[0];
        const ref = remote.refs.push;

        const matches = /^(git@|https:\/\/)([\w.]+)(?:\/|:)(.*\/*.)\.git$/.exec(ref);

        if (!matches) {
            exit(`Invalid git remote ${chalk.bold(ref)}`);
        }

        return {
            hostname: matches[2],
            project: matches[3],
        };
    }

    public static async getCurrentBranchName() {
        const { current } = await this.simpleGit.branch();

        return current;
    }

    private static simpleGit: any;
    private static path: string;

    private static async check() {
        const isRepository = await this.simpleGit.checkIsRepo();

        if (!isRepository) {
            exit(`${chalk.bold(this.path)} is not a git repository`);
        }
    }
}
