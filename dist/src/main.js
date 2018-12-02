#!/usr/bin/env node
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
const Path = require("path");
require("tsconfig-paths").register({
    baseUrl: __dirname,
    paths: {},
});
const clime_1 = require("clime");
const git_repository_1 = require("git-repository");
const toggl_client_1 = require("toggl-client");
const is_development_1 = require("utils/is-development");
const pkg = require("../package.json");
const config_1 = require("./config");
const main = () => __awaiter(this, void 0, void 0, function* () {
    yield config_1.Config.load();
    git_repository_1.GitRepository.initialize(config_1.Config.gitRepositoryPath);
    toggl_client_1.TogglClient.initialize(config_1.Config.togglToken);
    clime_1.CLI.commandModuleExtension = is_development_1.isDevelopment() ? ".ts" : ".js";
    const cli = new clime_1.CLI(pkg.name, Path.join(__dirname, "commands"));
    const shim = new clime_1.Shim(cli);
    yield shim.execute(process.argv);
});
main();
//# sourceMappingURL=main.js.map