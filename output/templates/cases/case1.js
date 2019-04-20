"use strict";
var Case = require('mock-case-server').MockCase;
var UrlPattern = require('mock-case-server').UrlPattern;
var case1 = new Case('case1', {
    defaultState: {
        login: false,
    },
    description: 'switch login state',
});
case1.addChange({
    path: '/changeLogin',
    change: function (query, originState) {
        // filed 'query' cantains url params and body params
        return {
            login: !originState.login,
        };
    },
    data: function (query, changedState) {
        return {
            login: changedState.login,
        };
    }
});
case1.addChange({
    path: new UrlPattern('/addMoney/:money'),
    change: function (query, originState) {
        // filed 'query' also cantains pattern field
        var money = query.pattern.money;
        return {
            money: originState.money + Number(money),
        };
    },
    data: function (query, changedState) {
        return {
            money: changedState.money,
        };
    }
});
module.exports = case1;
