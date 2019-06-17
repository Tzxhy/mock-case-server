"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var url_1 = __importDefault(require("url"));
var execSync = function (command) { return childProcess.execSync(command, {
    stdio: 'inherit',
}); };
var exec = function (command) { return childProcess.exec(command); };
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
function initServer(arg) {
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
                    writeConfig(arg);
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
function getFlattedCases(dirname, casesObj) {
    if (dirname === void 0) { dirname = ''; }
    var o = {};
    for (var filename in casesObj) {
        if (/.+\.js$/.test(filename)) {
            o[dirname + filename] = casesObj[filename];
        }
        else {
            o = __assign({}, o, getFlattedCases(filename + '/', casesObj[filename]));
        }
    }
    return o;
}
function loadAllCases() {
    var oldIndex = cwd + "/index.js";
    try {
        fs_1.default.accessSync(oldIndex, fs_1.default.constants.F_OK);
        require(oldIndex);
        console.log(chalk_1.default.green('Load all cases defined in index.js!'));
    }
    catch (e) { // no exists of old version's entry index.js
        var requireAll = require('require-all');
        var casesPath_1 = path.join(cwd, 'cases');
        var responsesPath_1 = path.join(cwd, 'responses');
        var cachedKeys = Object.keys(require.cache);
        cachedKeys.forEach(function (key) {
            if (key.indexOf(casesPath_1) !== -1) { // 用户 cases 目录
                delete require.cache[key]; // 删除引用，方便重复加载
            }
            if (key.indexOf(responsesPath_1) !== -1) {
                delete require.cache[key];
            }
        });
        var casesObj = requireAll({
            dirname: casesPath_1,
            filter: /.+\.js$/,
            recursive: true,
        });
        var casesObjFlatted = getFlattedCases('', casesObj);
        var cases = Object.values(casesObjFlatted);
        cases = cases.filter(function (item) { return item instanceof MCS_1.MockCase; }); // just load which export case
        MCS_1.default.loadCases(cases);
        console.log(chalk_1.default.green('Load all cases in ./cases!'));
    }
}
var justDoOnce = {
    watch: false,
};
var netServer = null;
/** command: mcs start */
function startServer() {
    loadAllCases(); // 加载 case
    var port = utils_1.getEnvKeyValue('port');
    if (process.env.continue) { // 加载上次 case 状态
        try {
            var data = utils_1.getRecordedState();
            MCS_1.default.findCaseByName(data.caseId);
            MCS_1.default.setState(__assign({}, MCS_1.default.state, data.data));
            console.log(chalk_1.default.bgGreen.black('Load last state successful!'));
        }
        catch (err) {
            console.log(chalk_1.default.blue('Load last state failed...'));
        }
    }
    netServer = server_1.default.listen(port);
    var logInfo = new Date() + ': Start server at http://localhost:' + port;
    log_1.log.info(logInfo);
    console.log(logInfo);
    console.log(chalk_1.default.blue.italic('You can look out the log.log file for detail...'));
    generateResource(); // 生成charles map文件 及 pac
    if (process.env.watch && !justDoOnce.watch) { // 监听 cases 目录
        justDoOnce.watch = true;
        watchCases();
    }
    if (process.env.open) {
        // if (googleChrome) {
        //     googleChrome.kill();
        // }
        try {
            openBrowser(port);
        }
        catch (err) {
            console.error(chalk_1.default.red('Can\'t open chrome in you pc!'));
        }
    }
    process.removeAllListeners('SIGINT');
    process.on('SIGINT', function () {
        server_1.default.emit('close');
        netServer.close();
        process.exit(0);
    });
    return netServer;
}
exports.startServer = startServer;
var googleChrome;
function openBrowser(port) {
    return __awaiter(this, void 0, void 0, function () {
        var target;
        return __generator(this, function (_a) {
            target = utils_1.getEnvKeyValue('target');
            try {
                fs_1.default.accessSync('~/.mcs/cache', fs_1.default.constants.F_OK);
            }
            catch (e) {
                execSync("mkdir -p ~/.mcs/cache"); // 不存在则创建
            }
            googleChrome = exec("/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --unsafe-pac-url=\"http://127.0.0.1:" + port + "/pac.pac\" --ignore-certificate-errors --ignore-urlfetcher-cert-requests --disable-machine-cert-request --start-fullscreen --user-data-dir=\"$HOME/.mcs/cache\" --proxy-pac-url=\"http://127.0.0.1:" + port + "/pac.pac\" --proxy-bypass-list=\"<local>\" --lang=local " + target);
            return [2 /*return*/];
        });
    });
}
function generagePac(_a) {
    var proxyAddr = _a.proxyAddr, proxyMaps = _a.proxyMaps, proxyPaths = _a.proxyPaths, regPaths = _a.regPaths;
    var file = fs_1.default.readFileSync(path.resolve(__dirname, 'file-templates', 'pac.template.pac'), {
        encoding: 'utf8',
    });
    file = file
        .replace('{{PROXY_PATHS}}', JSON.stringify(proxyPaths))
        .replace('{{MAP}}', JSON.stringify(proxyMaps))
        .replace('{{PROXY_ADDR}}', proxyAddr)
        .replace('{{REG_PATHS}}', JSON.stringify(regPaths));
    fs_1.default.writeFileSync(path.resolve('pac.pac'), file);
}
function watchCases() {
    var watch = require('watch');
    var restart = function () {
        console.log(chalk_1.default.blue('Now restart server...\n\n'));
        netServer.close(function (err) {
            if (err) {
                console.log('close server error: ', err);
            }
            setTimeout(function () {
                utils_1.clear();
                startServer();
            }, 100);
        });
        if (googleChrome && googleChrome.killed === false) {
            googleChrome.kill();
            googleChrome = null;
        }
    };
    watch.createMonitor(path.resolve('cases'), function (monitor) {
        monitor.on("created", function () {
            restart();
        });
        monitor.on("changed", function () {
            restart();
        });
        monitor.on("removed", function () {
            restart();
        });
    });
}
function generateResource() {
    var host = utils_1.getEnvKeyValue('host');
    var port = utils_1.getEnvKeyValue('port');
    if (!host) {
        return;
    }
    var xml = require('xml');
    var xmlArray = [];
    var proxyPaths = [];
    var regPaths = [];
    var proxyMaps = {};
    var proxyAddr = "127.0.0.1:" + port;
    (MCS_1.default.cases || []).forEach(function (caseItem) {
        utils_1.getCollectionWithMatchesAndRoute(caseItem).forEach(function (change) {
            var path = '';
            if (typeof change.path === 'string') {
                path = change.path;
                proxyPaths.push(path); // 添加命中的 path
            }
            else {
                var urlPattern = change.path;
                urlPattern.ast.every(function (tag) {
                    if (tag.tag === 'static') {
                        path = tag.value;
                        return false;
                    }
                });
                regPaths.push(path);
                path += '*'; // 生成包含*的 charles 对应项
            }
            var data = {
                mapMapping: [
                    {
                        sourceLocation: [{
                                host: host,
                            }, {
                                path: path,
                            }],
                    },
                    {
                        destLocation: [{
                                protocol: 'http',
                            }, {
                                host: 'localhost',
                            }, {
                                port: port,
                            }],
                    },
                    {
                        preserveHostHeader: true,
                    },
                    {
                        enabled: true,
                    }
                ]
            };
            if (change.transferTo) {
                var _a = url_1.default.parse(change.transferTo), protocol = _a.protocol, hostname = _a.hostname, port_1 = _a.port, tPath = _a.path;
                data.mapMapping[1].destLocation = [{
                        protocol: (protocol || 'http').replace(':', ''),
                    }, {
                        host: hostname,
                    }, {
                        port: port_1,
                    }, {
                        path: tPath,
                    }];
            }
            xmlArray[xmlArray.length] = data;
        });
    });
    var xmlString = xml({
        map: [
            {
                toolEnabled: true,
            },
            {
                mappings: xmlArray,
            }
        ]
    }, { declaration: true });
    xmlString = xmlString.replace('<?xml version="1.0" encoding="UTF-8"?>', "<?xml version=\"1.0\" encoding=\"UTF-8\"?><?charles serialisation-version='2.0' ?>");
    // console.log('xmlString', xmlString);
    fs_1.default.writeFileSync(path.resolve('map.xml'), xmlString, {
        encoding: 'utf8',
    });
    generagePac({
        proxyAddr: proxyAddr,
        proxyMaps: proxyMaps,
        proxyPaths: proxyPaths,
        regPaths: regPaths,
    });
}
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
