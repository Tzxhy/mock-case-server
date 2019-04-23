"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
/**
 *
 * @param path 请求 url
 * @param matches changes 集合
 */
function findIndexByUrlPath(path, caseItem) {
    var matches = caseItem.matches;
    return matches.findIndex(function (match) {
        if (typeof match.path === 'string') {
            return !match.transferTo && match.path === path;
        }
        return !match.transferTo && match.path.match(path);
    });
}
exports.findIndexByUrlPath = findIndexByUrlPath;
/** 将数组中出现的字符串进行分组 */
function groupName(arr) {
    var map = {};
    arr.forEach(function (i) {
        if (!map[i]) {
            map[i] = 1;
        }
        else {
            map[i] += 1;
        }
    });
    return map;
}
exports.groupName = groupName;
var envMap = null;
function getEnvKeyValue(key) {
    if (envMap) {
        return envMap[key] || '';
    }
    else {
        envMap = {};
    }
    var configPath = path_1.default.resolve('.mcs.config');
    var file = fs_1.default.readFileSync(configPath, {
        encoding: 'utf8',
    });
    file.split('\n').forEach(function (line) {
        var _a = line.split('='), key = _a[0], value = _a[1];
        envMap[key] = value;
    });
    return envMap[key] || '';
}
exports.getEnvKeyValue = getEnvKeyValue;
var stateObjPath = path_1.default.resolve('.db.state');
function recordState(caseId, state) {
    var data = JSON.stringify({ data: state, caseId: caseId });
    fs_1.default.writeFile(stateObjPath, data, function (err) {
        if (err) {
            console.log('write state obj err: ', err);
        }
    });
}
exports.recordState = recordState;
function getRecordedState() {
    var data = fs_1.default.readFileSync(stateObjPath, {
        encoding: 'utf8',
    });
    try {
        data = JSON.parse(data);
        return data;
    }
    catch (err) {
        console.log(chalk_1.default.red('Last state record file damaged...'));
        console.log('err: ', err);
    }
    return {};
}
exports.getRecordedState = getRecordedState;
function clear() {
    process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}
exports.clear = clear;
