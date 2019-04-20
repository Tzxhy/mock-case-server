const Case = require('mock-case-server').MockCase;
const UrlPattern = require('mock-case-server').UrlPattern;

const case1 = new Case('case1', {
    defaultState: { // used to initial this case origin state
        login: false,
    },
    description: 'switch login state', // description. uesd in log
});
case1.addChange({
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
case1.addChange({
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


module.exports = case1;