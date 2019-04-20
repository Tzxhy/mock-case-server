"use strict";
/*
 * @Author: tanzhixuan
 * @Date: 2019-04-19 16:14:19
 * @Last Modified by: tanzhixuan
 * @Last Modified time: 2019-04-20 13:33:51
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var logFilePath = path_1.default.resolve('log.log');
var flags = 'a';
var logFileExists = true;
try {
    fs_1.default.accessSync(logFilePath, fs_1.default.constants.F_OK);
}
catch (e) {
    logFileExists = false;
}
if (logFileExists && fs_1.default.statSync(logFilePath).size > 1024 * 1024 * 5) { // 5M
    flags = 'w';
}
var outputFile = fs_1.default.createWriteStream(logFilePath, {
    flags: flags,
});
var log = new console.Console(outputFile);
exports.log = log;
function nowDate() {
    return "(" + new Date().toLocaleString() + ") ";
}
/** record when case changed */
function changeCase(caseId) {
    log.info(nowDate(), 'changed case with ', caseId);
}
exports.changeCase = changeCase;
/** record one change's all data */
function logChange(path, description, query, returnData) {
    log.info(nowDate(), 'request URL: ', path, '. description: ', description, '. queryData: ', JSON.stringify(query), '. ReturnData: ', JSON.stringify(returnData));
}
exports.logChange = logChange;
/** record after one change's state */
function logNowState(state) {
    log.info(nowDate(), 'now State: ', JSON.stringify(state));
}
exports.logNowState = logNowState;
