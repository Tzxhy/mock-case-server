"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MockCase = /** @class */ (function () {
    /** case的唯一名称 */
    function MockCase(name) {
        this.name = name;
    }
    /** 添加一条匹配规则 */
    MockCase.prototype.addChange = function (change) {
        if (this.matches) {
            this.matches.push(change);
        }
        else {
            this.matches = [change];
        }
    };
    return MockCase;
}());
var MockCaseServer = /** @class */ (function (_super) {
    __extends(MockCaseServer, _super);
    function MockCaseServer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockCaseServer.Case = function (n) {
        return new MockCase(n);
    };
    MockCaseServer.loadCases = function (cases) {
        MockCaseServer.matches = cases;
    };
    return MockCaseServer;
}(MockCase));
exports.default = MockCaseServer;
