"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const git_repository_1 = require("git-repository");
const request = require("request-promise-native");
const exit_1 = require("utils/exit");
const logger_1 = require("utils/logger");
const time_to_string_1 = require("utils/time-to-string");
class GitlabClient {
    static initialize(url, token) {
        this.url = url;
        this.token = token;
    }
    static logTime(time) {
        return __awaiter(this, void 0, void 0, function* () {
            const { project } = yield git_repository_1.GitRepository.getRemoteInfo();
            const currentBranchName = yield git_repository_1.GitRepository.getCurrentBranchName();
            const matches = /^(\d+)-/.exec(currentBranchName);
            const issueId = matches ? matches[1] : null;
            if (issueId) {
                let result = null;
                try {
                    result = JSON.parse(yield request.post(`${this.url}/api/v4/projects/${project
                        .split("/")
                        .join("%2F")}/issues/${issueId}/add_spent_time?duration=${time_to_string_1.timeToString(time)}`, {
                        headers: {
                            "private-token": this.token,
                        },
                        followRedirect: true,
                    }));
                }
                catch (error) {
                    if (error.statusCode === 401) {
                        exit_1.exit(`Invalid gitlab token`);
                    }
                    else {
                        exit_1.exit(`An error occurred when trying to log time spent to gitlab issue: ${error.error}`);
                    }
                }
                logger_1.Log.info(`
                Issue ${chalk.bold(currentBranchName)}
                Total issue time: ${time_to_string_1.timeToString(result.total_time_spent * 1000, true)}
                Estimated time: ${result.time_estimate
                    ? time_to_string_1.timeToString(result.time_estimate * 1000)
                    : chalk.bold("none")}
            `);
            }
            else {
                logger_1.Log.warn(`Did not log time to Gitlab because ${chalk.bold(currentBranchName)} ` +
                    "is not an issue branch");
            }
        });
    }
}
exports.GitlabClient = GitlabClient;
//# sourceMappingURL=gitlab-client.js.map