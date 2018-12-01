const Toggl = require("toggl-api");
import { promisify } from "util";
import { exit } from "utils/exit";
import * as pkg from "../package.json";
const chalk = require("chalk");

export class TogglClient {
    public static initialize(apiToken: string) {
        this.client = new Toggl({ apiToken });

        const methods = [
            "startTimeEntry",
            "getCurrentTimeEntry",
            "stopTimeEntry",
            "getWorkspaces",
            "getWorkspaceProjects",
        ];

        for (const fn of methods) {
            this.client[fn] = promisify(this.client[fn]);
        }
    }

    public static async start(projectName: string, description: string) {
        let workspaces = null;

        try {
            workspaces = await this.client.getWorkspaces();
        } catch (error) {
            this.handleError(
                error,
                `An error occurred when trying to get toggl workspaces: ${error.message}`,
            );
        }

        let projectId = null;

        for (const workspace of workspaces) {
            let projects = null;

            try {
                projects = await this.client.getWorkspaceProjects(workspace.id);
            } catch (error) {
                this.handleError(
                    error,
                    `An error occurred when trying to retrieve toggl workspace projects: ${
                        error.message
                    }`,
                );
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
            exit(`Toggl project ${chalk.bold(projectName)} not found in any workspace`);
        }

        try {
            await this.client.startTimeEntry({
                description,
                pid: projectId,
                created_with: pkg.name,
            });
        } catch (error) {
            this.handleError(
                error,
                `An error occurred when trying to start toggl time entry: ${error.message}`,
            );
        }
    }

    public static async current() {
        let result = null;

        try {
            result = await this.client.getCurrentTimeEntry();
        } catch (error) {
            this.handleError(
                error,
                `An error occurred when trying to get current toggl time entry: ${
                    error.message
                }`,
            );
        }

        return result;
    }

    public static async stop(): Promise<number> {
        const current = await this.current();

        if (!current) {
            exit(`There is no current task in progress`);
        }

        let duration = null;

        try {
            ({ duration } = await this.client.stopTimeEntry(current.id));
        } catch (error) {
            this.handleError(
                error,
                `An error occurred when trying to stop toggl time entry: ${error.message}`,
            );
        }

        return duration;
    }

    private static client: any;

    private static handleError(error: any, defaultMessage: string) {
        if (error.code === 403) {
            exit(`Invalid toggl token`);
        } else {
            exit(defaultMessage);
        }
    }
}
