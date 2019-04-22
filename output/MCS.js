"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_pattern_1 = __importDefault(require("url-pattern"));
exports.UrlPattern = url_pattern_1.default;
var utils_1 = require("./utils");
var MockCase = /** @class */ (function () {
    /** case的唯一名称 */
    function MockCase(name, defaultObj) {
        if (defaultObj === void 0) { defaultObj = {
            defaultState: {},
            description: '',
        }; }
        this.name = name;
        this.defaultState = defaultObj.defaultState;
        this.description = defaultObj.description;
        this.matches = [];
    }
    /** 添加一条匹配规则 */
    MockCase.prototype.addChange = function (change) {
        if (this.matches) {
            this.matches.push(change);
        }
        else {
            this.matches = [change];
        }
        return this;
    };
    return MockCase;
}());
exports.MockCase = MockCase;
var MockCaseServer = /** @class */ (function () {
    function MockCaseServer() {
    }
    // static default: object = {};
    MockCaseServer.createCase = function (n, defaultObj) {
        return new MockCase(n, defaultObj);
    };
    MockCaseServer.loadCases = function (cases) {
        // check
        var caseIds = [];
        cases.forEach(function (caseItem) { return caseIds.push(caseItem.name); });
        var map = utils_1.groupName(caseIds);
        for (var key in map) {
            if (map[key] !== 1) {
                throw new Error("Found no uniq caseId: " + key + "!");
            }
        }
        MockCaseServer.cases = cases;
        if (cases.length === 1) { // if only one case, sets it as currentCase
            MockCaseServer.setCurrentCase(cases[0]);
        }
    };
    MockCaseServer.setCurrentCase = function (c) {
        MockCaseServer.currentCase = c;
        return c;
    };
    // static matchs: Change[];
    // static addChange: (change: Change) => void = (c) => {
    //     if (MockCaseServer.matchs) {
    //         MockCaseServer.matchs.push(c);
    //     } else {
    //         MockCaseServer.matchs = [c];
    //     }
    // }
    MockCaseServer.findCaseByName = function (n) {
        if (!MockCaseServer.cases || !MockCaseServer.cases.length) {
            return;
        }
        var re = MockCaseServer.cases.find(function (item) { return item.name === n; });
        if (re) {
            return MockCaseServer.setCurrentCase(re);
        }
        return;
    };
    MockCaseServer.setState = function (s) {
        MockCaseServer.state = s;
    };
    return MockCaseServer;
}());
exports.default = MockCaseServer;
