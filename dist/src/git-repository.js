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
const _ = require("lodash");
const exit_1 = require("utils/exit");
const chalk = require("chalk");
const SimpleGit = require("simple-git/promise");
class GitRepository {
    static initialize(path) {
        return __awaiter(this, void 0, void 0, function* () {
            this.path = path;
            this.simpleGit = SimpleGit(path);
            yield this.check();
        });
    }
    static getRemoteInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const remotes = yield this.simpleGit.getRemotes(true);
            if (remotes.length === 0) {
                exit_1.exit(`No remote for repository ${chalk.bold(this.path)}`);
            }
            const remote = _.find(remotes, (rem) => rem.name === "origin") || remotes[0];
            const ref = remote.refs.push;
            const matches = /^(git@|https:\/\/)([\w.]+)(?:\/|:)(.*\/*.)\.git$/.exec(ref);
            if (!matches) {
                exit_1.exit(`Invalid git remote ${chalk.bold(ref)}`);
            }
            return {
                hostname: matches[2],
                project: matches[3],
            };
        });
    }
    static getCurrentBranchName() {
        return __awaiter(this, void 0, void 0, function* () {
            const { current } = yield this.simpleGit.branch();
            return current;
        });
    }
    static check() {
        return __awaiter(this, void 0, void 0, function* () {
            const isRepository = yield this.simpleGit.checkIsRepo();
            if (!isRepository) {
                exit_1.exit(`${chalk.bold(this.path)} is not a git repository`);
            }
        });
    }
}
exports.GitRepository = GitRepository;
//# sourceMappingURL=git-repository.js.map