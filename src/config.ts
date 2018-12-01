import * as ConfigStore from "configstore";
import { prompt } from "inquirer";
import * as Joi from "joi";
import * as _ from "lodash";
import * as Path from "path";
import { exit } from "utils/exit";
import { Log } from "utils/logger";
import * as pkg from "../package.json";
const chalk = require("chalk");

const schema = Joi.object({
    path: Joi.string(),

    gitlab: Joi.object({
        token: Joi.string()
            .token()
            .required(),
    }).required(),

    toggl: Joi.object({
        token: Joi.string()
            .token()
            .required(),
    }).required(),

    gitRepositoryPath: Joi.string().default(process.cwd()),
});

const inquirerValidator = (path: string) => {
    return (input: any) => {
        const { error } = Joi.reach(schema, path).validate(input);

        Log.debug(error);

        return error ? error.details[0].message : true;
    };
};

const questions: Object[] = [
    {
        name: "gitlab.token",
        type: "input",
        message: "Enter your GitLab token",
        validate: inquirerValidator("gitlab.token"),
    },
    {
        name: "toggl.token",
        type: "input",
        message: "Enter your toggl token",
        validate: inquirerValidator("toggl.token"),
    },
    {
        name: "gitRepositoryPath",
        type: "input",
        message: "Enter your git repository path",
        validate: inquirerValidator("gitRepositoryPath"),
        default: process.cwd(),
    },
];

export class Config {
    public static get gitlabToken() {
        return this.v.gitlab.token;
    }

    public static get togglToken() {
        return this.v.toggl.token;
    }

    public static get gitRepositoryPath() {
        return this.v.gitRepositoryPath;
    }

    public static set gitRepositoryPath(value: string) {
        this.configStore.set("gitRepositoryPath", Path.resolve(value));
        this.v.gitRepositoryPath = value;
    }
    public static async load(forceInitialize = false) {
        this.configStore = new ConfigStore(pkg.name);

        if (forceInitialize || this.isConfigEmpty(this.configStore)) {
            if (!forceInitialize) {
                this.justInitialized = true;

                Log.info(
                    `No configuration found. Will ask some questions ` +
                        `and create a new config at ${chalk.bold(this.configStore.path)}`,
                );
            }

            this.v = await this.initialize(this.configStore);
        } else {
            this.v = this.validate(this.configStore.all);
        }

        this.gitRepositoryPath = this.v.gitRepositoryPath;
    }

    public static reset() {
        if (!this.justInitialized) {
            this.load(true);
        }
    }

    private static configStore: ConfigStore;
    private static v: any;
    private static justInitialized: boolean;

    private static async initialize(configStore: ConfigStore) {
        const answers = await prompt(questions);

        configStore.all = answers;

        return answers;
    }

    private static isConfigEmpty(configStore: ConfigStore) {
        return configStore.size === 0;
    }

    private static validate(config: any) {
        const { error, value } = Joi.validate(config, schema);

        if (error) {
            const message = `
                Invalid configuration file:

                - ${_.map(error.details, "message").join("\n* ")}

            `;

            exit(message);
        }

        return value;
    }
}
