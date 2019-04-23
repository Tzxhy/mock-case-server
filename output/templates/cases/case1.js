const Case = require('mock-case-server').MockCase;
const UrlPattern = require('mock-case-server').UrlPattern;

const myCase = new Case('case1', {
    defaultState: { // used to initialize this case's state
        login: false,
        money: 0,
    },
    description: 'switch login state', // description. uesd in log
});
myCase.addChange({
    path: '/changeLogin',
    change(query, originState) {
        // filed 'query' cantains url params and body params
        return {
            login: !originState.login,
        };
    },
    data(query, changedState) {
        return {
            login: changedState.login,
        };
    }
});
myCase.addChange({
    path: new UrlPattern('/addMoney/:money'),
    change(query, originState) {
        // filed 'query' also cantains pattern field
        const {
            pattern: {
                money, // all fileds are type of string,
            }
        } = query;
        return {
            money: originState.money + Number(money), // update money
        };
    },
    data(query, changedState) {
        return {
            money: changedState.money,
        };
    }
});

// use existing json
myCase.addChange({
    path: '/for-test',
    data() {
        return {
            ...require('../responses/for-test.json'),
        };
    },
});

// show case
// just generate a map remote item.
myCase.addChange({
    path: '/charles-map',
    transferTo: 'https://zh.wikipedia.org/zh-hans/%E5%AD%97%E8%8A%82%E8%B7%B3%E5%8A%A8',
});


module.exports = myCase;
