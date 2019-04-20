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
var Case = require('mock-case-server').MockCase;
var UrlPattern = require('mock-case-server').UrlPattern;
var case2 = new Case('case2', {
    defaultState: {
        name: 'test',
        money: 0,
        shouldTip: false,
    },
    description: 'switch login state',
});
var reqTime = 0;
case2.addChange({
    path: '/getName',
    change: function (query, originState) {
        reqTime++;
        var data = {
            name: originState.name,
        };
        if (reqTime > 2) {
            data.shouldTip = true;
        }
        // filed 'query' cantains url params and body params
        return data;
    },
    data: function (query, changedState) {
        return {
            name: changedState.name,
            shouldTip: changedState,
        };
    }
});
case2.addChange({
    path: new UrlPattern('/sub(/:money)'),
    change: function (query, originState) {
        // filed 'query' also cantains pattern field
        var data = __assign({}, originState);
        if ('money' in query.pattern) {
            data.money -= query.pattern.money;
        }
        return __assign({}, data);
    },
    data: function (query, changedState) {
        var money = query.pattern.money;
        var ret = __assign({}, changedState);
        if (money === undefined) {
            ret.msg = 'please tell me money.';
        }
        return ret;
    }
});
module.exports = case2;
