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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var MCS_1 = __importDefault(require("./MCS"));
var log_1 = require("./log");
var utils_1 = require("./utils");
var url_pattern_1 = __importDefault(require("url-pattern"));
var server = new koa_1.default();
server.use(koa_bodyparser_1.default());
server.use(function (context, next) {
    context.state = __assign({}, context.query, context.request.body);
    next();
});
server.use(function (ctx, next) {
    if (ctx.path === '/changeCase') {
        var caseId = ctx.state.caseId;
        var nowCase = MCS_1.default.findCaseByName(caseId);
        if (!nowCase) { // 未找到该 case，报错
            ctx.body = "Not found caseId " + caseId + ".";
            ctx.status = 404;
            return;
        }
        else { // 初始化状态
            log_1.changeCase(caseId);
            MCS_1.default.setState(nowCase.defaultState);
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
    next();
});
server.use(function (ctx, next) {
    if (MCS_1.default.currentCase) {
        var changeIndex = utils_1.findIndexByUrlPath(ctx.path, MCS_1.default.currentCase.matches);
        if (changeIndex !== -1) {
            var originState = MCS_1.default.state;
            var match = MCS_1.default.currentCase.matches[changeIndex];
            var urlPatternMatch = {};
            if (match.path instanceof url_pattern_1.default) {
                urlPatternMatch = match.path.match(ctx.path);
            }
            var pattern = __assign({}, urlPatternMatch);
            var changedState = match.change(__assign({}, ctx.state, { pattern: pattern }), __assign({}, originState));
            MCS_1.default.setState(__assign({}, originState, changedState));
            var data = match.data(__assign({}, ctx.state, { pattern: pattern }), __assign({}, MCS_1.default.state));
            ctx.body = data;
            log_1.logChange(ctx.path, MCS_1.default.currentCase.description, ctx.state, data);
            log_1.logNowState(MCS_1.default.state);
            return;
        }
    }
    next();
});
server.use(function (ctx) {
    var path = ctx.path;
    ctx.body = {
        code: 404,
        msg: "Please add CHANGE '" + path + "' to your config or check your request.",
    };
    return;
});
exports.default = server;
