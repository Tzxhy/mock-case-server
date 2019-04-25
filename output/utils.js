"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var util_1 = __importDefault(require("util"));
/**
 *
 * @param path 请求 url
 * @param matches changes 集合
 */
function findMatchIndexByUrlPath(path, caseItem) {
    var matches = caseItem.matches;
    return matches.findIndex(function (match) {
        if (typeof match.path === 'string') {
            return match.path === path;
        }
        return match.path.match(path);
    });
}
exports.findMatchIndexByUrlPath = findMatchIndexByUrlPath;
function getRouteByUrlPath(path, caseItem) {
    var routes = getCollectionWithMatchesAndRoute(caseItem);
    return routes && routes.find(function (match) {
        if (typeof match.path === 'string') {
            return match.path === path;
        }
        if (match.path.match(path)) {
            return true;
        }
        return false;
    });
}
exports.getRouteByUrlPath = getRouteByUrlPath;
var getCollectionWithMatchesAndRoute = util_1.default.deprecate(function (caseItem) {
    return __spread(new Set(__spread(caseItem.matches, caseItem.routes)));
}, '在 matches 中使用transferTo的功能将在 v0.3中移除！');
exports.getCollectionWithMatchesAndRoute = getCollectionWithMatchesAndRoute;
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
        var _a = __read(line.split('='), 2), key = _a[0], value = _a[1];
        envMap[key] = value;
    });
    return envMap[key] || '';
}
exports.getEnvKeyValue = getEnvKeyValue;
var stateObjPath = path_1.default.resolve('.db.state');
function recordState(caseId, state) {
    var data = JSON.stringify({ data: state, caseId: caseId });
    fs_1.default.writeFileSync(stateObjPath, data);
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
