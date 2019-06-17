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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var MCS_1 = __importDefault(require("./MCS"));
var log_1 = require("./log");
var utils_1 = require("./utils");
var url_pattern_1 = __importDefault(require("url-pattern"));
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var axios_1 = __importDefault(require("axios"));
var server = new koa_1.default();
server.use(koa_bodyparser_1.default());
server.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('url: ', ctx.path);
        return [2 /*return*/, next()];
    });
}); });
// pac 文件
server.use(function (ctx, next) {
    if (ctx.path === '/pac.pac') {
        ctx.body = fs_1.default.readFileSync(path_1.default.resolve('pac.pac'), {
            encoding: 'utf8',
        });
        // ctx.set('Content-Type', 'application/x-ns-proxy-autoconfig')
        return;
    }
    return next();
});
server.use(function (context, next) {
    context.state = __assign({}, context.query, context.request.body);
    return next();
});
server.use(function (ctx, next) {
    if (ctx.path === '/changeCase') {
        var caseId = ctx.state.caseId;
        var nowCase = MCS_1.default.findCaseByName(caseId);
        if (!nowCase) { // 未找到该 case，报错
            ctx.body = {
                code: 404,
                msg: "Not found caseId " + caseId + ".",
            };
            return;
        }
        else { // 初始化状态
            log_1.changeCase(caseId);
            MCS_1.default.setState(JSON.parse(JSON.stringify(nowCase.defaultState)));
            ctx.body = {
                code: 0,
                msg: "Ok, now use " + caseId + " for coming tests...",
            };
            return;
        }
    }
    if (!MCS_1.default.currentCase) {
        ctx.body = {
            code: 500,
            msg: 'Please set caseId before start case!',
        };
        return;
    }
    return next();
});
function setResponseContentType(ctx, value) {
    ctx.set('content-type', value || 'text/plain');
}
// 代理转发
server.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var path, matchItem, targetUrl, matches, key, res, _a, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                path = ctx.path;
                matchItem = utils_1.getRouteByUrlPath(path, MCS_1.default.currentCase);
                if (!(matchItem && matchItem.transferTo)) return [3 /*break*/, 2];
                targetUrl = matchItem.transferTo;
                if (matchItem.path instanceof url_pattern_1.default) { // 拼参数
                    matches = matchItem.path.match(path);
                    console.log('matches', matches);
                    for (key in matches) {
                        targetUrl = targetUrl.replace("{{" + key + "}}", matches[key]);
                    }
                }
                return [4 /*yield*/, axios_1.default.get(targetUrl).catch(function (e) { return console.log(e); })];
            case 1:
                res = (_b.sent()) || { data: '', headers: '' };
                _a = res.data, data = _a === void 0 ? {} : _a;
                ctx.body = data;
                // 设置响应头
                setResponseContentType(ctx, res.headers['content-type']);
                return [2 /*return*/];
            case 2: return [2 /*return*/, next()];
        }
    });
}); });
server.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var changeIndex, originState, match, urlPatternMatch, pattern, changedState, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!MCS_1.default.currentCase) return [3 /*break*/, 4];
                changeIndex = utils_1.findMatchIndexByUrlPath(ctx.path, MCS_1.default.currentCase);
                if (!(changeIndex !== -1)) return [3 /*break*/, 4];
                originState = MCS_1.default.state;
                match = MCS_1.default.currentCase.matches[changeIndex];
                urlPatternMatch = {};
                if (match.path instanceof url_pattern_1.default) {
                    urlPatternMatch = match.path.match(ctx.path);
                }
                pattern = __assign({}, urlPatternMatch);
                changedState = {};
                if (!match.change) return [3 /*break*/, 2];
                ctx.status = 200;
                return [4 /*yield*/, match.change(__assign({}, ctx.state, { pattern: pattern }), __assign({}, originState))];
            case 1:
                changedState = (_a.sent()) || {};
                _a.label = 2;
            case 2:
                MCS_1.default.setState(__assign({}, originState, changedState));
                return [4 /*yield*/, match.data(__assign({}, ctx.state, { pattern: pattern }), __assign({}, MCS_1.default.state))];
            case 3:
                data = _a.sent();
                ctx.body = data;
                log_1.logChange(ctx.path, MCS_1.default.currentCase.description, ctx.state, data);
                log_1.logNowState(MCS_1.default.state);
                return [2 /*return*/];
            case 4: return [2 /*return*/, next()];
        }
    });
}); });
server.use(function (ctx) {
    var path = ctx.path;
    ctx.body = {
        code: 404,
        msg: "Please add CHANGE '" + path + "' into CASE `" + MCS_1.default.currentCase.name + "` or check your request.",
    };
    return;
});
server.on('close', function () {
    if (!MCS_1.default.currentCase) {
        return;
    }
    console.log(chalk_1.default.bgWhite.green('Please wait to record your state...'));
    // 记录状态
    utils_1.recordState(MCS_1.default.currentCase.name, MCS_1.default.state);
    console.log(chalk_1.default.bgBlack.white('See you next time!'));
});
exports.default = server;
