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
const ConfigStore = require("configstore");
const inquirer_1 = require("inquirer");
const Joi = require("joi");
const _ = require("lodash");
const Path = require("path");
const exit_1 = require("utils/exit");
const logger_1 = require("utils/logger");
const pkg = require("../package.json");
const chalk = require("chalk");
const schema = Joi.object({
    path: Joi.string(),
    gitlab: Joi.object({
        token: Joi.string()
            .required(),
    }).required(),
    toggl: Joi.object({
        token: Joi.string()
            .required(),
    }).required(),
    gitRepositoryPath: Joi.string().default(process.cwd()),
});
const inquirerValidator = (path) => {
    return (input) => {
        const { error } = Joi.reach(schema, path).validate(input);
        logger_1.Log.debug(error);
        return error ? error.details[0].message : true;
    };
};
const questions = [
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
class Config {
    static get gitlabToken() {
        return this.v.gitlab.token;
    }
    static get togglToken() {
        return this.v.toggl.token;
    }
    static get gitRepositoryPath() {
        return this.v.gitRepositoryPath;
    }
    static set gitRepositoryPath(value) {
        this.configStore.set("gitRepositoryPath", Path.resolve(value));
        this.v.gitRepositoryPath = value;
    }
    static load(forceInitialize = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.configStore = new ConfigStore(pkg.name);
            if (forceInitialize || this.isConfigEmpty(this.configStore)) {
                if (!forceInitialize) {
                    this.justInitialized = true;
                    logger_1.Log.info(`No configuration found. Will ask some questions ` +
                        `and create a new config at ${chalk.bold(this.configStore.path)}`);
                }
                this.v = yield this.initialize(this.configStore);
            }
            else {
                this.v = this.validate(this.configStore.all);
            }
            this.gitRepositoryPath = this.v.gitRepositoryPath;
        });
    }
    static reset() {
        if (!this.justInitialized) {
            this.load(true);
        }
    }
    static initialize(configStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = yield inquirer_1.prompt(questions);
            configStore.all = answers;
            return answers;
        });
    }
    static isConfigEmpty(configStore) {
        return configStore.size === 0;
    }
    static validate(config) {
        const { error, value } = Joi.validate(config, schema);
        if (error) {
            const message = `
                Invalid configuration file:

                - ${_.map(error.details, "message").join("\n* ")}

            `;
            exit_1.exit(message);
        }
        return value;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map