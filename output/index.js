"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var childProcess = require("child_process");
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
var execSync = function (command) { return childProcess.execSync(command, {
    stdio: 'inherit',
}); };
var cwd = process.cwd();
function cpTemplates() {
    execSync("cp -r " + __dirname + "/templates/. " + cwd); // 使用/. 不要/*，后者不拷贝隐藏文件、夹
}
function chooseCpTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var dir, readline, rl_1;
        return __generator(this, function (_a) {
            dir = cwd + "/";
            try {
                fs_1.default.accessSync(path.join(dir, '.mcs.config'), fs_1.default.constants.F_OK);
                readline = require('readline');
                rl_1 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                return [2 /*return*/, new Promise(function (res) {
                        rl_1.question(chalk_1.default.red('You\'re already inititialized this project. Override? [y or n]: '), function (answer) {
                            if (answer === 'y' || answer === 'Y') {
                                cpTemplates();
                                res(true);
                            }
                            else {
                                console.log('Try use \'mcs start\' to start mock server, or clear the dir and run \'mcs init\'');
                                res(false);
                            }
                            rl_1.close();
                        });
                    })];
            }
            catch (e) {
                cpTemplates();
                return [2 /*return*/, true];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * command: mcs init
 * @param port http mock server port
 */
function initServer(port) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // make cases dir
                    console.log(chalk_1.default.blue('Prepare to init some dirs...'));
                    return [4 /*yield*/, chooseCpTemplates()];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        return [2 /*return*/];
                    }
                    console.log(chalk_1.default.green("Now init a npm project..."));
                    execSync("npm init -y  > /dev/null");
                    console.log(chalk_1.default.bgCyan.black('Init mock-case-server finished. Now you can write your own cases and then run \'mcs start\'!'));
                    // 写配置文件
                    writeConfig({
                        port: port,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.initServer = initServer;
function writeConfig(config) {
    var configPath = path.resolve('.mcs.config');
    var file = fs_1.default.readFileSync(configPath, {
        encoding: 'utf8',
    });
    var keys = Object.keys(config);
    keys.forEach(function (key) {
        file = file.replace("{{" + key + "}}", config[key]);
    });
    fs_1.default.writeFileSync(configPath, file);
}
var server_1 = __importDefault(require("./server"));
var log_1 = require("./log");
var utils_1 = require("./utils");
var MCS_1 = __importStar(require("./MCS"));
function loadAllCases() {
    var oldIndex = cwd + "/index.js";
    try {
        fs_1.default.accessSync(oldIndex, fs_1.default.constants.F_OK);
        require(oldIndex);
        console.log(chalk_1.default.green('Load all cases defined in index.js!'));
    }
    catch (e) { // no exists of old version's entry index.js
        var requireAll = require('require-all');
        var casesObj = requireAll(path.join(cwd, 'cases'));
        var cases = Object.values(casesObj);
        cases = cases.filter(function (item) { return item instanceof MCS_1.MockCase; }); // just load which export case
        MCS_1.default.loadCases(cases);
        console.log(chalk_1.default.green('Load all cases in ./cases!'));
    }
}
/** command: mcs start */
function startServer() {
    loadAllCases(); // 加载 case
    var port = utils_1.getEnvKeyValue('port');
    server_1.default.listen(port);
    var logInfo = new Date() + ': Start server at http://localhost:' + port;
    log_1.log.info(logInfo);
    console.log(logInfo);
    console.log(chalk_1.default.blue.italic('You can look out the log.log file for detail...'));
}
exports.startServer = startServer;
function newCase(name) {
    var caseDir = path.resolve('cases');
    var file = fs_1.default.readFileSync(path.resolve(__dirname, 'file-templates', 'case.template.js'), {
        encoding: 'utf8',
    });
    file = file.replace('{{caseName}}', name);
    var casePath = path.join(caseDir, name + '.js');
    try {
        fs_1.default.writeFileSync(casePath, file, {
            encoding: 'utf8',
            flag: 'wx',
        });
        console.log("Create " + casePath + " OK!");
    }
    catch (err) {
        if (err.code === 'EEXIST') {
            console.log(chalk_1.default.red("Error: " + casePath + " exists!"));
            return;
        }
    }
}
exports.newCase = newCase;
