const Case = require('mock-case-server').MockCase;
const UrlPattern = require('mock-case-server').UrlPattern;

// you may need to change case name.
const myCase = new Case('{{caseName}}', {
    defaultState: { // used to initial this case origin state

    },
    description: '', // description. uesd in log
});
myCase.addChange({
    path: '/change1',
    change(query, originState) {
        // filed 'query' cantains url params and body params
        return {
        };
    },
    data(query, changedState) {
        return {
            login: changedState.login,
        };
    }
});
myCase.addChange({
    path: new UrlPattern('/makeMoney(/:money)'),
    change(query, originState) {
        // filed 'query' also cantains pattern field
        return {
        };
    },
    data(query, changedState) {
        return {
        };
    }
});

// if you don't use this case, just comment out the next line.
module.exports = myCase;
