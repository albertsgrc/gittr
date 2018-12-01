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
const Toggl = require("toggl-api");
const util_1 = require("util");
const exit_1 = require("utils/exit");
const pkg = require("../package.json");
const chalk = require("chalk");
class TogglClient {
    static initialize(apiToken) {
        this.client = new Toggl({ apiToken });
        const methods = [
            "startTimeEntry",
            "getCurrentTimeEntry",
            "stopTimeEntry",
            "getWorkspaces",
            "getWorkspaceProjects",
        ];
        for (const fn of methods) {
            this.client[fn] = util_1.promisify(this.client[fn]);
        }
    }
    static start(projectName, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let workspaces = null;
            try {
                workspaces = yield this.client.getWorkspaces();
            }
            catch (error) {
                this.handleError(error, `An error occurred when trying to get toggl workspaces: ${error.message}`);
            }
            let projectId = null;
            for (const workspace of workspaces) {
                let projects = null;
                try {
                    projects = yield this.client.getWorkspaceProjects(workspace.id);
                }
                catch (error) {
                    this.handleError(error, `An error occurred when trying to retrieve toggl workspace projects: ${error.message}`);
                }
                for (const project of projects) {
                    if (project.name === projectName) {
                        projectId = project.id;
                        break;
                    }
                }
                if (projectId) {
                    break;
                }
            }
            if (!projectId) {
                exit_1.exit(`Toggl project ${chalk.bold(projectName)} not found in any workspace`);
            }
            try {
                yield this.client.startTimeEntry({
                    description,
                    pid: projectId,
                    created_with: pkg.name,
                });
            }
            catch (error) {
                this.handleError(error, `An error occurred when trying to start toggl time entry: ${error.message}`);
            }
        });
    }
    static current() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            try {
                result = yield this.client.getCurrentTimeEntry();
            }
            catch (error) {
                this.handleError(error, `An error occurred when trying to get current toggl time entry: ${error.message}`);
            }
            return result;
        });
    }
    static stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield this.current();
            if (!current) {
                exit_1.exit(`There is no current task in progress`);
            }
            let duration = null;
            try {
                ({ duration } = yield this.client.stopTimeEntry(current.id));
            }
            catch (error) {
                this.handleError(error, `An error occurred when trying to stop toggl time entry: ${error.message}`);
            }
            return duration;
        });
    }
    static handleError(error, defaultMessage) {
        if (error.code === 403) {
            exit_1.exit(`Invalid toggl token`);
        }
        else {
            exit_1.exit(defaultMessage);
        }
    }
}
exports.TogglClient = TogglClient;
//# sourceMappingURL=toggl-client.js.map