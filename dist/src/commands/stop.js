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
const clime_1 = require("clime");
const config_1 = require("config");
const git_repository_1 = require("git-repository");
const gitlab_client_1 = require("gitlab-client");
const toggl_client_1 = require("toggl-client");
const logger_1 = require("utils/logger");
const time_to_string_1 = require("utils/time-to-string");
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const duration = yield toggl_client_1.TogglClient.stop();
            logger_1.Log.info(`Stopped toggl timer. Total time: ${time_to_string_1.timeToString(duration * 1000, true)}`);
            const { hostname } = yield git_repository_1.GitRepository.getRemoteInfo();
            gitlab_client_1.GitlabClient.initialize(`https://${hostname}`, config_1.Config.gitlabToken);
            gitlab_client_1.GitlabClient.logTime(duration * 1000);
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
        description: "Stops the current timer for a repository folder",
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=stop.js.map