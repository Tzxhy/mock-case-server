const Case = require('mock-case-server').MockCase;
const UrlPattern = require('mock-case-server').UrlPattern;

// you may need to change case name.
const myCase = new Case('{{caseName}}', {
    defaultState: { // used to initial this case origin state
        login: false,
        money: 0,
        name: 'test',
    },
    description: '', // description. uesd in log
});
myCase.addChange({
    path: '/change1',
    change(query, originState) {
        // filed 'query' cantains url params and body params
        for (let i in query) {
            originState[i] = query[i];
        }
        return originState;
    },
    data(query, changedState) {
        return changedState;
    }
});
myCase.addChange({
    path: new UrlPattern('/makeMoney(/:money)'),
    change(query, originState) {
        // filed 'query' also cantains pattern field
        if (query.pattern.money) {
            originState.money += Number(query.pattern.money);
        }
        return originState;
    },
    data(query, changedState) {
        return changedState;
    }
});

// if you don't use this case, just comment out the next line.
module.exports = myCase;
