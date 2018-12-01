const chalk = require("chalk");
import { GitRepository } from "git-repository";
import * as request from "request-promise-native";
import { exit } from "utils/exit";
import { Log } from "utils/logger";
import { timeToString } from "utils/time-to-string";

export class GitlabClient {
    public static initialize(url: string, token: string) {
        this.url = url;
        this.token = token;
    }

    public static async logTime(time: number) {
        const { project } = await GitRepository.getRemoteInfo();
        const currentBranchName = await GitRepository.getCurrentBranchName();

        const matches = /^(\d+)-/.exec(currentBranchName);
        const issueId = matches ? matches[1] : null;

        if (issueId) {
            let result = null;

            try {
                result = JSON.parse(
                    await request.post(
                        `${this.url}/api/v4/projects/${project
                            .split("/")
                            .join(
                                "%2F",
                            )}/issues/${issueId}/add_spent_time?duration=${timeToString(
                            time,
                        )}`,
                        {
                            headers: {
                                "private-token": this.token,
                            },
                            followRedirect: true,
                        },
                    ),
                );
            } catch (error) {
                if (error.statusCode === 401) {
                    exit(`Invalid gitlab token`);
                } else {
                    exit(
                        `An error occurred when trying to log time spent to gitlab issue: ${
                            error.error
                        }`,
                    );
                }
            }

            Log.info(`
                Issue ${chalk.bold(currentBranchName)}
                Total issue time: ${timeToString(result.total_time_spent * 1000, true)}
                Estimated time: ${
                    result.time_estimate
                        ? timeToString(result.time_estimate * 1000)
                        : chalk.bold("none")
                }
            `);
        } else {
            Log.warn(
                `Did not log time to Gitlab because ${chalk.bold(currentBranchName)} ` +
                    "is not an issue branch",
            );
        }
    }

    private static url: string;
    private static token: string;
}
