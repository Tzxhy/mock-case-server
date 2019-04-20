const Case = require('mock-case-server').MockCase;
const UrlPattern = require('mock-case-server').UrlPattern;

const case2 = new Case('case2', {
    defaultState: { // used to initial this case origin state
        name: 'test',
        money: 0,
        shouldTip: false,
    },
    description: 'switch login state', // description. uesd in log
});
let reqTime = 0;
case2.addChange({
    path: '/getName',
    change(query, originState) {
        reqTime++;
        const data = {
            name: originState.name,
        };
        if (reqTime > 2) {
            data.shouldTip = true;
        }
        // filed 'query' cantains url params and body params
        return data;
    },
    data(query, changedState) {
        return {
            name: changedState.name,
            shouldTip: changedState,
        };
    }
});
case2.addChange({
    path: new UrlPattern('/sub(/:money)'),
    change(query, originState) {
        // filed 'query' also cantains pattern field
        const data = {...originState};
        if ('money' in query.pattern) {
            data.money -= query.pattern.money;
        }
        return {
            ...data,
        };
    },
    data(query, changedState) {
        const {
            pattern: {
                money,
            }
        } = query;
        const ret = {...changedState};
        if (money === undefined) {
            ret.msg = 'please tell me money.';
        }
        return ret;
    }
});


module.exports = case2;