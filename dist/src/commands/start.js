"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const clime_1 = require("clime");
const git_repository_1 = require("git-repository");
const toggl_client_1 = require("toggl-client");
const exit_1 = require("utils/exit");
const logger_1 = require("utils/logger");
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentBranchName = yield git_repository_1.GitRepository.getCurrentBranchName();
            const { project } = yield git_repository_1.GitRepository.getRemoteInfo();
            const description = currentBranchName;
            const current = yield toggl_client_1.TogglClient.current();
            if (!current) {
                yield toggl_client_1.TogglClient.start(project, description);
                logger_1.Log.info(`Started task ${chalk.bold(description)} on project ${chalk.bold(project)}`);
            }
            else {
                exit_1.exit(`Task ${chalk.bold(current.description)} is currently in progress`);
            }
        });
    }
};
__decorate([
    clime_1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Starts a new timer",
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=start.js.map