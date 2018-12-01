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
const toggl_client_1 = require("toggl-client");
const logger_1 = require("utils/logger");
const time_to_string_1 = require("utils/time-to-string");
const chalk = require("chalk");
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield toggl_client_1.TogglClient.current();
            logger_1.Log.info(`Current repository is ${chalk.bold(config_1.Config.gitRepositoryPath)}`);
            if (!current) {
                logger_1.Log.info("Not working on any task right now");
            }
            else {
                const { description, start } = current;
                logger_1.Log.info(`Current time entry:\n\n` +
                    `        ${chalk.bold(description)}\n` +
                    `        Start: ${chalk.bold(new Date(start).toLocaleString())}\n` +
                    `        Elapsed: ${time_to_string_1.timeToString(Date.now() - new Date(start).getTime(), true)}\n`);
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
        description: "Prints the current ongoing task",
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=current.js.map